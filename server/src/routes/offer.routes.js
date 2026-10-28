import { Router } from 'express'
import { authenticate, authorize } from '../middleware/auth.js'
import { validateBody } from '../middleware/validate.js'
import { counterOffer, createOffer, decideOffer, getListingOffers, getMyOffers, getOfferHistory } from '../controllers/offer.controller.js'
import { counterSchema, offerSchema } from '../validators/offer.validator.js'

const router = Router()
router.use(authenticate)
router.get('/offers/mine', getMyOffers)
router.get('/listings/:id/offers', authorize('buyer'), getListingOffers)
router.post('/listings/:id/offers', authorize('farmer'), validateBody(offerSchema), createOffer)
router.post('/offers/:id/counter', validateBody(counterSchema), counterOffer)
router.get('/offers/:id/history', getOfferHistory)
router.post('/offers/:id/accept', decideOffer('accept'))
router.post('/offers/:id/reject', decideOffer('reject'))
router.post('/offers/:id/withdraw', decideOffer('withdraw'))
export default router
