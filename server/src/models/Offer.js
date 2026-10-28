import mongoose from 'mongoose'

const proposalSchema = new mongoose.Schema(
  {
    price: { type: Number, required: true, min: 1 },
    quantity: { type: Number, required: true, min: 1 },
    deliveryDate: { type: Date, required: true },
    message: { type: String, trim: true, default: '' },
    by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    role: { type: String, enum: ['farmer', 'buyer'], required: true },
  },
  { _id: false, timestamps: true }
)

const offerSchema = new mongoose.Schema(
  {
    listingId: { type: mongoose.Schema.Types.ObjectId, ref: 'RequirementListing', required: true, index: true },
    farmerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    buyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    proposedPrice: { type: Number, required: true, min: 1 },
    quantity: { type: Number, required: true, min: 1 },
    deliveryDate: { type: Date, required: true },
    note: { type: String, trim: true, default: '' },
    latestProposal: { type: proposalSchema, required: true },
    status: { type: String, enum: ['negotiating', 'accepted', 'rejected', 'withdrawn'], default: 'negotiating' },
    termsSnapshot: { type: proposalSchema },
  },
  { timestamps: true }
)

offerSchema.index({ listingId: 1, farmerId: 1, status: 1 })
export default mongoose.model('Offer', offerSchema)
