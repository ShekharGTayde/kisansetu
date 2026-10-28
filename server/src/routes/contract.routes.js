import { Router } from 'express'
import { authenticate } from '../middleware/auth.js'
import { cancelContract, confirmContract, downloadContractPdf, getContract, listContracts } from '../controllers/contract.controller.js'

const router = Router()
router.use(authenticate)
router.get('/mine', listContracts)
router.get('/:id/pdf', downloadContractPdf)
router.get('/:id', getContract)
router.post('/:id/confirm', confirmContract)
router.post('/:id/cancel', cancelContract)
export default router
