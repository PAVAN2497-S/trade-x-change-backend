const mongoose = require('mongoose')
const { Schema, model } = mongoose

const companySchema = new Schema({
    companyname: String,
    GST: String,
    contactdetails: {
        address: {
            name: String,
            lattitude: Number,
            longitude: Number
        },
        phone: Number,
        email: String
    },
    products: [{
        type: Schema.Types.ObjectId,
        ref: 'Product'
    }],
    orders: [{
        type: Schema.Types.ObjectId,
        ref: "OrderAcceptance"
    }],
    customers: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    categories: [{
        type: Schema.Types.ObjectId,
        ref: 'Category'
    }],
    companydetails: Schema.Types.ObjectId,
    isApproval: {
        type: Boolean,
        default: false
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    enquiries: [{
        type: Schema.Types.ObjectId,
        ref: 'Enquiry'
    }],
    quotations: [{
        type: Schema.Types.ObjectId,
        ref: 'Quotation'
    }],
    details: {
        vision: String,
        mission: String,
        aboutus: String
    }
}, { timestamps: true })

const Company = model('Company', companySchema)
module.exports = Company