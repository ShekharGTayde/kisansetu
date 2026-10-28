import RequirementListing from '../models/RequirementListing.js'
import Offer from '../models/Offer.js'
import { isOwner } from '../middleware/auth.js'
import { sendError, sendSuccess } from '../utils/response.js'

const ownedListing = async (id, userId) => {
  const listing = await RequirementListing.findById(id)
  if (!listing) return { error: ['NOT_FOUND', 'Listing not found', 404] }
  if (!isOwner(listing.buyerId, userId)) return { error: ['FORBIDDEN', 'Only the listing owner can modify it', 403] }
  return { listing }
}

export const createListing = async (req, res, next) => {
  try {
    const listing = await RequirementListing.create({ ...req.body, buyerId: req.user.id })
    return sendSuccess(res, listing, 201)
  } catch (error) {
    return next(error)
  }
}

export const updateListing = async (req, res, next) => {
  try {
    const result = await ownedListing(req.params.id, req.user.id)
    if (result.error) return sendError(res, ...result.error)
    const accepted = await Offer.exists({ listingId: result.listing._id, status: 'accepted' })
    if (accepted) return sendError(res, 'LISTING_LOCKED', 'A listing cannot be edited after an offer is accepted', 409)
    Object.assign(result.listing, req.body)
    await result.listing.save()
    return sendSuccess(res, result.listing)
  } catch (error) {
    return next(error)
  }
}

export const updateListingStatus = async (req, res, next) => {
  try {
    const result = await ownedListing(req.params.id, req.user.id)
    if (result.error) return sendError(res, ...result.error)
    if (result.listing.status === 'fulfilled') return sendError(res, 'LISTING_LOCKED', 'Fulfilled listings cannot change status', 409)
    result.listing.status = req.body.status
    await result.listing.save()
    return sendSuccess(res, result.listing)
  } catch (error) {
    return next(error)
  }
}

export const getMyListings = async (req, res, next) => {
  try {
    const listings = await RequirementListing.find({ buyerId: req.user.id }).sort({ createdAt: -1 })
    return sendSuccess(res, listings)
  } catch (error) {
    return next(error)
  }
}

export const browseListings = async (req, res, next) => {
  try {
    const page = Math.max(Number.parseInt(req.query.page, 10) || 1, 1)
    const limit = Math.min(Math.max(Number.parseInt(req.query.limit, 10) || 12, 1), 50)
    const query = { status: 'open', $or: [{ validTill: { $exists: false } }, { validTill: { $gt: new Date() } }] }
    if (req.query.crop) query.crop = new RegExp(req.query.crop, 'i')
    if (req.query.location) query.deliveryLocation = new RegExp(req.query.location, 'i')
    if (req.query.minPrice || req.query.maxPrice) {
      query['priceTerms.pricePerUnit'] = {}
      if (req.query.minPrice) query['priceTerms.pricePerUnit'].$gte = Number(req.query.minPrice)
      if (req.query.maxPrice) query['priceTerms.pricePerUnit'].$lte = Number(req.query.maxPrice)
    }
    if (req.query.minQuantity || req.query.maxQuantity) {
      query.remainingQuantity = {}
      if (req.query.minQuantity) query.remainingQuantity.$gte = Number(req.query.minQuantity)
      if (req.query.maxQuantity) query.remainingQuantity.$lte = Number(req.query.maxQuantity)
    }
    const sort = req.query.sort === 'price' ? { 'priceTerms.pricePerUnit': 1 } : { createdAt: -1 }
    const [items, total] = await Promise.all([
      RequirementListing.find(query).sort(sort).skip((page - 1) * limit).limit(limit),
      RequirementListing.countDocuments(query),
    ])
    return sendSuccess(res, { items, pagination: { page, limit, total, pages: Math.ceil(total / limit) } })
  } catch (error) {
    return next(error)
  }
}

export const getListing = async (req, res, next) => {
  try {
    const listing = await RequirementListing.findById(req.params.id)
    if (!listing) return sendError(res, 'NOT_FOUND', 'Listing not found', 404)
    return sendSuccess(res, listing)
  } catch (error) {
    return next(error)
  }
}
