import Offer from '../models/Offer.js'
import NegotiationEntry from '../models/NegotiationEntry.js'
import RequirementListing from '../models/RequirementListing.js'
import { isOwner } from '../middleware/auth.js'
import { sendError, sendSuccess } from '../utils/response.js'
import { createContractForAcceptedOffer } from './contract.controller.js'

const findAccessibleOffer = async (id, userId) => {
  const offer = await Offer.findById(id)
  if (!offer) return { error: ['NOT_FOUND', 'Offer not found', 404] }
  if (!isOwner(offer.farmerId, userId) && !isOwner(offer.buyerId, userId)) {
    return { error: ['FORBIDDEN', 'You are not a party to this offer', 403] }
  }
  return { offer }
}

export const createOffer = async (req, res, next) => {
  try {
    const listing = await RequirementListing.findById(req.params.id)
    if (!listing || listing.status !== 'open') return sendError(res, 'LISTING_UNAVAILABLE', 'Listing is not open', 409)
    if (req.body.quantity > listing.remainingQuantity) return sendError(res, 'QUANTITY_EXCEEDED', 'Offer exceeds remaining quantity', 400)
    const existing = await Offer.findOne({ listingId: listing._id, farmerId: req.user.id, status: 'negotiating' })
    if (existing) return sendError(res, 'DUPLICATE_OFFER', 'You already have an active offer for this listing', 409)
    const proposal = { price: req.body.proposedPrice, quantity: req.body.quantity, deliveryDate: req.body.deliveryDate, message: req.body.note, by: req.user.id, role: 'farmer' }
    const offer = await Offer.create({
      listingId: listing._id,
      farmerId: req.user.id,
      buyerId: listing.buyerId,
      ...req.body,
      latestProposal: proposal,
    })
    await NegotiationEntry.create({ offerId: offer._id, senderId: req.user.id, senderRole: 'farmer', ...req.body, price: req.body.proposedPrice, message: req.body.note })
    return sendSuccess(res, offer, 201)
  } catch (error) {
    return next(error)
  }
}

export const counterOffer = async (req, res, next) => {
  try {
    const result = await findAccessibleOffer(req.params.id, req.user.id)
    if (result.error) return sendError(res, ...result.error)
    const { offer } = result
    if (offer.status !== 'negotiating') return sendError(res, 'OFFER_LOCKED', 'This offer is no longer negotiable', 409)
    if (isOwner(offer.latestProposal.by, req.user.id)) return sendError(res, 'TURN_NOT_ALLOWED', 'The other party must respond first', 409)
    if (req.body.quantity > (await RequirementListing.findById(offer.listingId)).remainingQuantity) {
      return sendError(res, 'QUANTITY_EXCEEDED', 'Counter-proposal exceeds remaining quantity', 400)
    }
    offer.latestProposal = { ...req.body, message: req.body.message, by: req.user.id, role: req.user.role }
    await offer.save()
    await NegotiationEntry.create({ offerId: offer._id, senderId: req.user.id, senderRole: req.user.role, ...req.body })
    return sendSuccess(res, offer)
  } catch (error) {
    return next(error)
  }
}

export const getOfferHistory = async (req, res, next) => {
  try {
    const result = await findAccessibleOffer(req.params.id, req.user.id)
    if (result.error) return sendError(res, ...result.error)
    const history = await NegotiationEntry.find({ offerId: req.params.id }).sort({ createdAt: 1 })
    return sendSuccess(res, { offer: result.offer, history })
  } catch (error) {
    return next(error)
  }
}

export const getMyOffers = async (req, res, next) => {
  try {
    const filter = req.user.role === 'farmer' ? { farmerId: req.user.id } : { buyerId: req.user.id }
    const offers = await Offer.find(filter).populate('listingId').sort({ updatedAt: -1 })
    return sendSuccess(res, offers)
  } catch (error) {
    return next(error)
  }
}

export const getListingOffers = async (req, res, next) => {
  try {
    const listing = await RequirementListing.findById(req.params.id)
    if (!listing) return sendError(res, 'NOT_FOUND', 'Listing not found', 404)
    if (!isOwner(listing.buyerId, req.user.id)) return sendError(res, 'FORBIDDEN', 'Only the listing owner can view its offers', 403)
    const offers = await Offer.find({ listingId: listing._id }).populate('farmerId', 'name location').sort({ updatedAt: -1 })
    return sendSuccess(res, offers)
  } catch (error) {
    return next(error)
  }
}

export const decideOffer = (action) => async (req, res, next) => {
  try {
    const result = await findAccessibleOffer(req.params.id, req.user.id)
    if (result.error) return sendError(res, ...result.error)
    const { offer } = result
    if (offer.status !== 'negotiating') return sendError(res, 'OFFER_LOCKED', 'This offer is already resolved', 409)
    if (action === 'accept' && isOwner(offer.latestProposal.by, req.user.id)) {
      return sendError(res, 'TURN_NOT_ALLOWED', 'The party who made the latest proposal cannot accept it', 409)
    }
    if (action === 'withdraw' && !isOwner(offer.farmerId, req.user.id)) return sendError(res, 'FORBIDDEN', 'Only the farmer can withdraw', 403)
    if (action === 'accept') {
      const listing = await RequirementListing.findById(offer.listingId)
      if (!listing || offer.latestProposal.quantity > listing.remainingQuantity) return sendError(res, 'QUANTITY_EXCEEDED', 'Accepted quantity is no longer available', 409)
      listing.remainingQuantity -= offer.latestProposal.quantity
      if (listing.remainingQuantity === 0) listing.status = 'fulfilled'
      await listing.save()
      offer.termsSnapshot = offer.latestProposal
    }
    offer.status = action === 'accept' ? 'accepted' : action === 'reject' ? 'rejected' : 'withdrawn'
    await offer.save()
    if (action === 'accept') await createContractForAcceptedOffer(offer)
    return sendSuccess(res, offer)
  } catch (error) {
    return next(error)
  }
}
