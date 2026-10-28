import mongoose from 'mongoose'

const purchaseOrderSchema = new mongoose.Schema(
  {
    cropListingId: { type: mongoose.Schema.Types.ObjectId, ref: 'CropListing', required: true, index: true },
    buyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    farmerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    quantity: { type: Number, required: true, min: 1 },
    unit: { type: String, required: true },
    pricePerUnit: { type: Number, required: true, min: 1 },
    totalAmount: { type: Number, required: true, min: 1 },
    deliveryLocation: { type: String, trim: true, required: true },
    note: { type: String, trim: true, default: '' },
    status: { type: String, enum: ['pending', 'accepted', 'rejected', 'cancelled'], default: 'pending', index: true },
  },
  { timestamps: true }
)

export default mongoose.model('PurchaseOrder', purchaseOrderSchema)
