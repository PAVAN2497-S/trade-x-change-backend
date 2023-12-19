const Company = require('../models/company-model')
const Enquiry = require('../models/enquiry-model')
const {validationResult} = require('express-validator')
const User = require('../models/users-model')
const Product = require('../models/product-model')

const enquiryCtlr = {}

enquiryCtlr.create = async(req,res)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    const body = req.body
    const enquiry = new Enquiry(body)
    enquiry.customerId = req.user.id
    enquiry.date = new Date()
    try{
        await enquiry.save()
        await Company.findOneAndUpdate({products:enquiry.productId},{$push:{enquiries: enquiry._id}})
        await User.findOneAndUpdate({_id:enquiry.customerId},{$push:{myenquiries: enquiry._id}})
        res.json(enquiry)
    }catch(e){
        return res.status(500).json(e)
    }
}

enquiryCtlr.list = async(req,res)=>{
    try{
        if(req.user.role === 'companyAdmin'){
            const company = await Company.findOne({userId:req.user.id})
            const enquiries = await Enquiry.find({company:company._id}).populate('company').populate('customerId').populate('productId')
            // console.log('enquiries',enquiries)
            res.json(enquiries)
        } else{
            const enquiries = await Enquiry.find({customerId:req.user.id})
            console.log('enquiry',enquiries)
            res.json(enquiries)
        }
    }
    catch(e){
        res.status(500).json(e)
    }
}

module.exports = enquiryCtlr