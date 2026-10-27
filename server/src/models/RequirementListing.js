import mongoose from 'mongoose'

const qualitySpecSchema = new mongoose.Schema(
  {
    grade: { type: String, trim: true, default: 'Standard' },
    moistureMax: { type: String, trim: true },
    notes: { type: String, trim: true },
  },
  { _id: false }
)

const priceTermsSchema = new mongoose.Schema(
  {
    // Stored in integer paise (e.g. ₹3,250 = 325000 paise)
    pricePerUnit: {
      type: Number,
      required: [true, 'Price per unit is required'],
      min: [1, 'Price per unit must be positive'],
    },
    minPrice: { type: Number },
    maxPrice: { type: Number },
  },
  { _id: false }
)

const requirementListingSchema = new mongoose.Schema(
  {
    buyerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Buyer reference is required'],
      index: true,
    },
    crop: {
      type: String,
      required: [true, 'Crop name is required'],
      trim: true,
      index: true,
    },
    variety: {
      type: String,
      trim: true,
      default: '',
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [1, 'Quantity must be at least 1'],
    },
    remainingQuantity: {
      type: Number,
      min: [0, 'Remaining quantity cannot be negative'],
    },
    unit: {
      type: String,
      required: [true, 'Unit is required'],
      enum: {
        values: ['quintal', 'kg', 'ton', 'tonne', 'Quintals'],
        message: 'Invalid unit of measurement',
      },
      default: 'quintal',
    },
    qualitySpec: {
      type: qualitySpecSchema,
      default: () => ({}),
    },
    priceTerms: {
      type: priceTermsSchema,
      required: [true, 'Price terms are required'],
    },
    deliveryLocation: {
      type: String,
      required: [true, 'Delivery location is required'],
      trim: true,
      index: true,
    },
    deliveryDate: {
      type: Date,
      required: [true, 'Delivery date is required'],
      validate: {
        validator: function (v) {
          return v && new Date(v) > new Date()
        },
        message: 'Delivery date must be in the future',
      },
    },
    paymentTerms: {
      type: String,
      required: [true, 'Payment terms are required'],
      trim: true,
    },
    validTill: {
      type: Date,
      validate: {
        validator: function (v) {
          if (!v) return true
          return new Date(v) > new Date()
        },
        message: 'Validity date must be in the future',
      },
    },
    status: {
      type: String,
      enum: {
        values: ['open', 'paused', 'closed', 'fulfilled'],
        message: 'Invalid listing status',
      },
      default: 'open',
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (_doc, ret) {
        delete ret.__v
        return ret
      },
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
)

// Pre-save hook: initialize remainingQuantity if not set
requirementListingSchema.pre('save', function (next) {
  if (this.isNew && this.remainingQuantity === undefined) {
    this.remainingQuantity = this.quantity
  }
  next()
})

// Compound index for efficient searching
requirementListingSchema.index({ crop: 1, status: 1, deliveryDate: 1 })
requirementListingSchema.index({ createdAt: -1 })

const RequirementListing = mongoose.model('RequirementListing', requirementListingSchema)

export default RequirementListing
