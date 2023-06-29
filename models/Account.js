const mongoose = require("mongoose")

const { Schema } = mongoose

const accountSchema = new Schema({
  agency: {
    type: Number,
    required: false
  },
  account: {
    type: Number,
    required: false
  },
  cpf: {
    type: String,
    required: false
  },
  dateOfBirth: {
    type: Number,
    required: false
  },
  fullName: {
    type: String,
    required: false
  },
  nameForCard: {
    type: String,
    required: false
  },
  flag: {
    type: String,
    required: false
  },
  type: {
    type: String,
    required: false
  },
  dueDate: {
    type: String,
    required: false
  },
  password: {
    type: Number,
    required: false
  },
  confirmPassword: {
    type: Number,
    required: false
  },
  state: {
    type: String
  },
  number: {
    type: Number,
  },
  cvv: {
    type: Number
  },
  limit:{
    type: Number
  },
  motive:{
    type: String
  }

}, { timestamps: true })

const Account = mongoose.model("Account", accountSchema)
module.exports = { Account, accountSchema }
