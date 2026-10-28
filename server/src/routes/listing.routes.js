import { Router } from 'express'
import { authenticate, authorize } from '../middleware/auth.js'
import { validateBody } from '../middleware/validate.js'
import { listingSchema, listingStatusSchema, listingUpdateSchema } from '../validators/listing.validator.js'
import {
  browseListings,
  createListing,
  getListing,
  getMyListings,
  updateListing,
  updateListingStatus,
} from '../controllers/listing.controller.js'

const router = Router()
router.use(authenticate)
router.get('/mine', authorize('buyer'), getMyListings)
router.post('/', authorize('buyer'), validateBody(listingSchema), createListing)
router.put('/:id', authorize('buyer'), validateBody(listingUpdateSchema), updateListing)
router.patch('/:id/status', authorize('buyer'), validateBody(listingStatusSchema), updateListingStatus)
router.get('/', browseListings)
router.get('/:id', getListing)
export default router
