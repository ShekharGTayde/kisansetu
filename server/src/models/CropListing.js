import mongoose from 'mongoose'

const cropListingSchema = new mongoose.Schema(
  {
    farmerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    crop: { type: String, required: true, trim: true, index: true },
    variety: { type: String, trim: true, default: '' },
    cropType: { type: String, enum: ['available', 'expected'], required: true, index: true },
    quantity: { type: Number, required: true, min: 1 },
    remainingQuantity: { type: Number, min: 0 },
    unit: { type: String, enum: ['kg', 'quintal', 'ton', 'tonne'], required: true },
    pricePerUnit: { type: Number, required: true, min: 1 },
    location: { type: String, required: true, trim: true, index: true },
    availableFrom: { type: Date, required: true },
    qualityNotes: { type: String, trim: true, default: '' },
    status: { type: String, enum: ['open', 'paused', 'sold'], default: 'open', index: true },
  },
  { timestamps: true }
)

cropListingSchema.pre('save', function (next) {
  if (this.isNew && this.remainingQuantity === undefined) this.remainingQuantity = this.quantity
  next()
})

cropListingSchema.index({ status: 1, crop: 1, location: 1 })
export default mongoose.model('CropListing', cropListingSchema)
