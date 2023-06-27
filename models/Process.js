const mongoose = require("mongoose")

const { Schema } = mongoose

const requestSchema = new Schema({
    type: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    id: {
        type: Number,
        required: true
    },
    agency: {
        type: Number,
        required: true
    },
    account: {
        type: Number,
        required: true
    },
    cpf: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    nameForCard: {
        type: String,
        required: true
    },
    dueDate: {
        type: Number,
        required: true
    },
    password: {
        type: Number,
        required: true
    }

}, { timestamps: true })


const blockSchema = new Schema({
    type: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    id: {
        type: Number,
        required: true
    },
    agency: {
        type: Number,
        required: true
    },
    account: {
        type: Number,
        required: true
    },
    motive: {
        type: Number,
        required: true
    },
    idAction: {
        type: Number,
        required: true
    },
}, { timestamps: true })

const cancellationSchema = new Schema({
    type: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    id: {
        type: Number,
        required: true
    },
    agency: {
        type: Number,
        required: true
    },
    account: {
        type: Number,
        required: true
    },
    motive: {
        type: Number,
        required: true
    },
    idAction: {
        type: Number,
        required: true
    },
}, { timestamps: true })

const Request = mongoose.model("Request", requestSchema)
const Block = mongoose.model("Block", blockSchema)
const Cancellation = mongoose.model("Cancellation", cancellationSchema)

module.exports = {
    Request, requestSchema, 
    Block, blockSchema, 
    Cancellation, cancellationSchema
}