import mongoose from 'mongoose'

const schema = new mongoose.Schema(
  {
    offerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Offer', required: true, index: true },
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    senderRole: { type: String, enum: ['farmer', 'buyer'], required: true },
    price: { type: Number, required: true, min: 1 },
    quantity: { type: Number, required: true, min: 1 },
    deliveryDate: { type: Date, required: true },
    message: { type: String, trim: true, default: '' },
  },
  { timestamps: true }
)

export default mongoose.model('NegotiationEntry', schema)
