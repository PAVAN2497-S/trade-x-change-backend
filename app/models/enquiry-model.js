const mongoose = require('mongoose')
const { Schema, model } = mongoose

const enquirySchema = new Schema({
    productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product'
    },
    phNo: Number,
    customerId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    company:{
        type: Schema.Types.ObjectId,
        ref: 'Company'
    },
    quantity: Number,
    date: Date
})

const Enquiry = model('Enquiry', enquirySchema)
module.exports = Enquiry