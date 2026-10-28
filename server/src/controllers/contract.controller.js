import crypto from 'node:crypto'
import { Buffer } from 'node:buffer'
import Contract from '../models/Contract.js'
import RequirementListing from '../models/RequirementListing.js'
import { isOwner } from '../middleware/auth.js'
import { sendError, sendSuccess } from '../utils/response.js'

const contractNumber = () => `AGP-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`
const accessible = (contract, userId) => isOwner(contract.farmerId, userId) || isOwner(contract.buyerId, userId)

export const createContractForAcceptedOffer = async (offer) => {
  const listing = await RequirementListing.findById(offer.listingId)
  const terms = {
    crop: listing.crop,
    variety: listing.variety,
    quantity: offer.termsSnapshot.quantity,
    unit: listing.unit,
    pricePerUnit: offer.termsSnapshot.price,
    totalAmount: offer.termsSnapshot.price * offer.termsSnapshot.quantity,
    qualitySpec: listing.qualitySpec,
    deliveryLocation: listing.deliveryLocation,
    deliveryDate: offer.termsSnapshot.deliveryDate,
    paymentTerms: listing.paymentTerms,
  }
  return Contract.create({
    contractNo: contractNumber(),
    offerId: offer._id,
    listingId: listing._id,
    farmerId: offer.farmerId,
    buyerId: offer.buyerId,
    terms,
    termsHash: crypto.createHash('sha256').update(JSON.stringify(terms)).digest('hex'),
  })
}

export const listContracts = async (req, res, next) => {
  try {
    const field = req.user.role === 'farmer' ? 'farmerId' : 'buyerId'
    return sendSuccess(res, await Contract.find({ [field]: req.user.id }).sort({ createdAt: -1 }))
  } catch (error) {
    return next(error)
  }
}

export const getContract = async (req, res, next) => {
  try {
    const contract = await Contract.findById(req.params.id)
    if (!contract) return sendError(res, 'NOT_FOUND', 'Contract not found', 404)
    if (!accessible(contract, req.user.id)) return sendError(res, 'FORBIDDEN', 'You are not a party to this contract', 403)
    return sendSuccess(res, contract)
  } catch (error) {
    return next(error)
  }
}

export const confirmContract = async (req, res, next) => {
  try {
    const contract = await Contract.findById(req.params.id)
    if (!contract) return sendError(res, 'NOT_FOUND', 'Contract not found', 404)
    if (!accessible(contract, req.user.id)) return sendError(res, 'FORBIDDEN', 'You are not a party to this contract', 403)
    if (contract.status !== 'pending_confirmation') return sendError(res, 'CONTRACT_LOCKED', 'Contract is already finalized', 409)
    contract.confirmedBy[req.user.role] = { at: new Date() }
    if (contract.confirmedBy.farmer?.at && contract.confirmedBy.buyer?.at) contract.status = 'active'
    await contract.save()
    return sendSuccess(res, contract)
  } catch (error) {
    return next(error)
  }
}

export const cancelContract = async (req, res, next) => {
  try {
    const contract = await Contract.findById(req.params.id)
    if (!contract) return sendError(res, 'NOT_FOUND', 'Contract not found', 404)
    if (!accessible(contract, req.user.id)) return sendError(res, 'FORBIDDEN', 'You are not a party to this contract', 403)
    if (contract.status !== 'pending_confirmation') return sendError(res, 'CONTRACT_LOCKED', 'Active contracts cannot be cancelled', 409)
    contract.status = 'cancelled'
    await contract.save()
    return sendSuccess(res, contract)
  } catch (error) {
    return next(error)
  }
}

  const pdfEscape = (value) => String(value ?? '').replace(/([\\()])/g, '\\$1').replace(/\r?\n/g, ' ')

  const createContractPdf = (contract) => {
      const { terms } = contract
      const commands = []
      const text = (value, x, y, size = 10, font = '/F1', color = '0.08 0.15 0.1') => {
        commands.push(`${color} rg`, 'BT', `${font} ${size} Tf`, `${x} ${y} Td`, `(${pdfEscape(value)}) Tj`, 'ET')
      }
      const line = (x1, y1, x2, y2, color = '0.82 0.87 0.83') => {
        commands.push(`${color} RG`, '0.7 w', `${x1} ${y1} m`, `${x2} ${y2} l`, 'S')
      }
      const box = (x, y, width, height, color = '0.96 0.98 0.96') => {
        commands.push(`${color} rg`, `${x} ${y} ${width} ${height} re`, 'f')
      }
      const row = (label, value, y, x = 70, valueX = 220) => {
        text(label.toUpperCase(), x, y, 8, '/F2')
        text(value, valueX, y, 10)
      }

      box(42, 700, 528, 58, '0.11 0.23 0.13')
      text('AGRIPACT', 64, 733, 22, '/F2', '1 1 1')
      text('PRE-CROP FARMING CONTRACT', 64, 714, 9, '/F1', '0.86 0.94 0.87')
      text(contract.contractNo, 420, 733, 10, '/F2', '1 1 1')
      text(`Status: ${contract.status.replace('_', ' ').toUpperCase()}`, 420, 716, 8, '/F1', '0.86 0.94 0.87')

      text('CONTRACT OVERVIEW', 42, 672, 12, '/F2')
      line(42, 663, 570, 663)
      row('Created', new Date(contract.createdAt).toLocaleDateString('en-IN'), 645)
      row('Contract ID', contract.contractNo, 627)

      text('PARTIES', 42, 592, 12, '/F2')
      line(42, 583, 570, 583)
      text('FARMER', 70, 562, 8, '/F2')
      text(contract.farmerId.name, 70, 545, 11)
      text('BUYER', 330, 562, 8, '/F2')
      text(contract.buyerId.name, 330, 545, 11)

      text('AGREED CROP TERMS', 42, 510, 12, '/F2')
      box(42, 385, 528, 108)
      row('Crop', `${terms.crop}${terms.variety ? ` (${terms.variety})` : ''}`, 470, 60, 190)
      row('Quantity', `${terms.quantity} ${terms.unit}`, 450, 60, 190)
      row('Price / unit', `INR ${(terms.pricePerUnit / 100).toLocaleString('en-IN')}`, 430, 60, 190)
      row('Total value', `INR ${(terms.totalAmount / 100).toLocaleString('en-IN')}`, 410, 60, 190)
      row('Delivery', terms.deliveryLocation, 470, 330, 430)
      row('Delivery date', new Date(terms.deliveryDate).toLocaleDateString('en-IN'), 450, 330, 430)
      row('Quality grade', terms.qualitySpec?.grade || 'Standard', 430, 330, 430)
      row('Moisture / notes', terms.qualitySpec?.moistureMax || terms.qualitySpec?.notes || 'As agreed', 410, 330, 430)

      text('PAYMENT TERMS', 42, 352, 12, '/F2')
      line(42, 343, 570, 343)
      text(terms.paymentTerms || 'As agreed by both parties.', 60, 323, 10)

      text('CONFIRMATION RECORD', 42, 285, 12, '/F2')
      line(42, 276, 570, 276)
      row('Farmer confirmed', contract.confirmedBy?.farmer?.at ? new Date(contract.confirmedBy.farmer.at).toLocaleString('en-IN') : 'Pending', 255, 60, 190)
      row('Buyer confirmed', contract.confirmedBy?.buyer?.at ? new Date(contract.confirmedBy.buyer.at).toLocaleString('en-IN') : 'Pending', 235, 60, 190)
      row('Contract state', contract.status.replace('_', ' '), 255, 330, 430)
      row('Terms locked', contract.status === 'active' ? 'Yes' : 'No', 235, 330, 430)

      box(42, 125, 528, 70)
      text('INTEGRITY', 60, 175, 9, '/F2')
      text('SHA-256 terms fingerprint:', 60, 155, 8)
      text(contract.termsHash, 60, 139, 7)
      text('This document represents the terms recorded by AgriPact at the time of generation.', 60, 110, 8)
      text('AgriPact | KisanSetu', 42, 62, 8)
      text('Page 1 of 1', 510, 62, 8)

      const stream = commands.join('\n')
    const objects = [
      '<< /Type /Catalog /Pages 2 0 R >>',
      '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
      '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R >>',
      '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
      '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>',
      `<< /Length ${Buffer.byteLength(stream, 'utf8')} >>\nstream\n${stream}\nendstream`,
    ]
    let pdf = '%PDF-1.4\n'
    const offsets = [0]
    objects.forEach((object, index) => {
      offsets.push(Buffer.byteLength(pdf, 'utf8'))
      pdf += `${index + 1} 0 obj\n${object}\nendobj\n`
    })
    const xref = Buffer.byteLength(pdf, 'utf8')
    pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`
    offsets.slice(1).forEach((offset) => { pdf += `${String(offset).padStart(10, '0')} 00000 n \n` })
    pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`
      return Buffer.from(pdf, 'utf8')
  }

export const downloadContractPdf = async (req, res, next) => {
    try {
      const contract = await Contract.findById(req.params.id).populate('farmerId', 'name').populate('buyerId', 'name')
      if (!contract) return sendError(res, 'NOT_FOUND', 'Contract not found', 404)
      if (!accessible(contract, req.user.id)) return sendError(res, 'FORBIDDEN', 'You are not a party to this contract', 403)
      const pdf = createContractPdf(contract)
      res.set({ 'Content-Type': 'application/pdf', 'Content-Disposition': `attachment; filename="${contract.contractNo}.pdf"` })
      return res.send(pdf)
    } catch (error) {
      return next(error)
  }
}
