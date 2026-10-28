import { Router } from 'express'
import { authenticate, authorize } from '../middleware/auth.js'
import { validateBody } from '../middleware/validate.js'
import { createCropListing, createPurchaseOrder, browseCropListings, getMyCropListings, getMyOrders, updateCropStatus, updateOrderStatus } from '../controllers/crop.controller.js'
import { cropListingSchema, cropStatusSchema, orderStatusSchema, purchaseOrderSchema } from '../validators/crop.validator.js'

const router = Router()
router.use(authenticate)
router.get('/', browseCropListings)
router.get('/mine', authorize('farmer'), getMyCropListings)
router.post('/', authorize('farmer'), validateBody(cropListingSchema), createCropListing)
router.patch('/:id/status', authorize('farmer'), validateBody(cropStatusSchema), updateCropStatus)
router.post('/:id/orders', authorize('buyer'), validateBody(purchaseOrderSchema), createPurchaseOrder)
router.get('/orders/mine', getMyOrders)
router.patch('/orders/:id/status', authorize('farmer'), validateBody(orderStatusSchema), updateOrderStatus)
export default router
