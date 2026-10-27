import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Invalid email address'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    passwordHash: {
      type: String,
      required: [true, 'Password hash is required'],
    },
    role: {
      type: String,
      enum: {
        values: ['farmer', 'buyer'],
        message: 'Role must be either farmer or buyer',
      },
      required: [true, 'Role is required'],
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    // Role extras
    farmDetails: {
      cropsGrown: {
        type: [String],
        default: undefined,
      },
      totalAcres: {
        type: Number,
        default: undefined,
      },
    },
    businessName: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (_doc, ret) {
        delete ret.passwordHash
        delete ret.__v
        return ret
      },
    },
    toObject: {
      transform: function (_doc, ret) {
        delete ret.passwordHash
        delete ret.__v
        return ret
      },
    },
  }
)

// Instance method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.passwordHash)
}

// Static helper to hash password
userSchema.statics.hashPassword = async function (plainPassword) {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(plainPassword, salt)
}

const User = mongoose.model('User', userSchema)

export default User
