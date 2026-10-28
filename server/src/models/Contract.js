import mongoose from 'mongoose'

const contractSchema = new mongoose.Schema(
  {
    contractNo: { type: String, unique: true, required: true },
    offerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Offer', unique: true, required: true },
    listingId: { type: mongoose.Schema.Types.ObjectId, ref: 'RequirementListing', required: true },
    farmerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    buyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    terms: { type: mongoose.Schema.Types.Mixed, required: true },
    status: { type: String, enum: ['pending_confirmation', 'active', 'cancelled'], default: 'pending_confirmation' },
    confirmedBy: {
      farmer: { at: Date },
      buyer: { at: Date },
    },
    termsHash: String,
  },
  { timestamps: true }
)

export default mongoose.model('Contract', contractSchema)
