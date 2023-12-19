const mongoose = require('mongoose')
const { Schema, model } = mongoose

const userSchema = new Schema({
    username: String,
    email: String,
    password: String,

    role: {
        type: String,
        enum: ['superAdmin', 'companyAdmin', 'customer'],
        default: 'customer'
    },
    verified: {
        type: Boolean,
        default: function () {
            return this.role === 'customer' ? false : true
        }
    },

    myenquiries: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'Enquiry'
        }],
        default: function () {
            return this.role === 'customer' ? [] : undefined
        }
    },

    myQuotations: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'Quotation'
        }],
        default: function () {
            return this.role === 'customer' ? [] : undefined
        }
    },

    myOrders: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'OrderAcceptance'
        }],
        default: function () {
            return this.role === 'customer' ? [] : undefined
        }
    },

    users: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'Company'
        }],
        default: function () {
            return this.role === 'superAdmin' ? [] : undefined
        }
    },
    customers: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'User'
        }],
        default: function () {
            return this.role === 'superAdmin' ? [] : undefined
        }
    }
}, { timestamps: true })

const User = model('User', userSchema)
module.exports = User