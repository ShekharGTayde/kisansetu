import CropListing from '../models/CropListing.js'
import PurchaseOrder from '../models/PurchaseOrder.js'
import { isOwner } from '../middleware/auth.js'
import { sendError, sendSuccess } from '../utils/response.js'

export const createCropListing = async (req, res, next) => {
  try {
    const listing = await CropListing.create({ ...req.body, farmerId: req.user.id })
    return sendSuccess(res, listing, 201)
  } catch (error) { return next(error) }
}

export const getMyCropListings = async (req, res, next) => {
  try {
    return sendSuccess(res, await CropListing.find({ farmerId: req.user.id }).sort({ createdAt: -1 }))
  } catch (error) { return next(error) }
}

export const browseCropListings = async (req, res, next) => {
  try {
    const query = { status: 'open', remainingQuantity: { $gt: 0 } }
    if (req.query.crop) query.crop = new RegExp(req.query.crop, 'i')
    if (req.query.location) query.location = new RegExp(req.query.location, 'i')
    if (req.query.cropType) query.cropType = req.query.cropType
    const listings = await CropListing.find(query).populate('farmerId', 'name location').sort({ createdAt: -1 })
    return sendSuccess(res, listings)
  } catch (error) { return next(error) }
}

export const updateCropStatus = async (req, res, next) => {
  try {
    const listing = await CropListing.findById(req.params.id)
    if (!listing) return sendError(res, 'NOT_FOUND', 'Crop listing not found', 404)
    if (!isOwner(listing.farmerId, req.user.id)) return sendError(res, 'FORBIDDEN', 'Only the farmer owner can update this listing', 403)
    if (listing.status === 'sold') return sendError(res, 'LISTING_LOCKED', 'Sold crop listings cannot be changed', 409)
    listing.status = req.body.status
    await listing.save()
    return sendSuccess(res, listing)
  } catch (error) { return next(error) }
}

export const createPurchaseOrder = async (req, res, next) => {
  try {
    const listing = await CropListing.findOneAndUpdate(
      { _id: req.params.id, status: 'open', remainingQuantity: { $gte: req.body.quantity } },
      { $inc: { remainingQuantity: -req.body.quantity } },
      { new: true }
    )
    if (!listing) return sendError(res, 'UNAVAILABLE', 'This crop quantity is no longer available', 409)
    if (listing.remainingQuantity === 0) {
      listing.status = 'sold'
      await listing.save()
    }
    const order = await PurchaseOrder.create({
      cropListingId: listing._id,
      buyerId: req.user.id,
      farmerId: listing.farmerId,
      quantity: req.body.quantity,
      unit: listing.unit,
      pricePerUnit: listing.pricePerUnit,
      totalAmount: listing.pricePerUnit * req.body.quantity,
      deliveryLocation: req.body.deliveryLocation,
      note: req.body.note,
    })
    return sendSuccess(res, order, 201)
  } catch (error) { return next(error) }
}

export const getMyOrders = async (req, res, next) => {
  try {
    const filter = req.user.role === 'buyer' ? { buyerId: req.user.id } : { farmerId: req.user.id }
    return sendSuccess(res, await PurchaseOrder.find(filter).populate('cropListingId').populate('buyerId', 'name location').populate('farmerId', 'name location').sort({ createdAt: -1 }))
  } catch (error) { return next(error) }
}

export const updateOrderStatus = async (req, res, next) => {
  try {
    const order = await PurchaseOrder.findById(req.params.id)
    if (!order) return sendError(res, 'NOT_FOUND', 'Purchase order not found', 404)
    if (!isOwner(order.farmerId, req.user.id)) return sendError(res, 'FORBIDDEN', 'Only the farmer can decide this order', 403)
    if (order.status !== 'pending') return sendError(res, 'ORDER_LOCKED', 'This order is already resolved', 409)
    order.status = req.body.status
    await order.save()
    if (req.body.status === 'rejected') {
      const listing = await CropListing.findById(order.cropListingId)
      if (listing) {
        listing.remainingQuantity += order.quantity
        if (listing.status === 'sold') listing.status = 'open'
        await listing.save()
      }
    }
    return sendSuccess(res, order)
  } catch (error) { return next(error) }
}
