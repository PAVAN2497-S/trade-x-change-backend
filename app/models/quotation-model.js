const mongoose = require('mongoose')
const { Schema, model } = mongoose

const quotationSchema = new Schema({
   enquiry: {
      type: Schema.Types.ObjectId,
      ref: 'Enquiry'
   },
   customer:{
      type:Schema.Types.ObjectId,
      ref:'User'
   },
   quantity: Number,
   unitPrice: Number,
   totalCost: Number,
   date: Date,
   
   quotationExpiry: Date,
   termsandconditions: {
      delivery: String,
      isApproved:{ 
         type:Boolean,
         default:false
      }
   },
   // pdf: String,
   product: {
      type: Schema.Types.ObjectId,
      ref: 'Product'
   },
   comments: [{
      type: Schema.Types.ObjectId,
      ref: 'Comment'
   }],
   company:{
      type:Schema.Types.ObjectId,
      ref:'Company'
   }
}, { timestamps: true })

const Quotation = model('Quotation', quotationSchema)
module.exports = Quotation