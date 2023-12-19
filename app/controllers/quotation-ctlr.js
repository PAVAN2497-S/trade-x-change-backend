const Quotation = require('../models/quotation-model')
const _ = require('lodash')
const { validationResult } = require('express-validator')
const User = require('../models/users-model')
const quotationCtlr = {}
const transporter = require('../config/nodemailer')
const Company = require('../models/company-model')

quotationCtlr.create = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(500).json({ errors: errors.array() })
    }
    const body = req.body
    const user = await User.findOne({ myenquiries: body.enquiry })
    body.customer = user._id
    const quotation = new Quotation(body)
    quotation.date = new Date()
    const companyId = await Company.findOne({ userId: req.user.id })
    quotation.company = companyId._id
    try {
        await quotation.save()
        await User.findOneAndUpdate({ myenquiries: quotation.enquiry }, { $push: { myQuotations: quotation._id } })
        await Company.findOneAndUpdate({ userId: req.user.id }, { $push: { quotations: quotation._id } })
        const id = quotation._id
        const verificationLink = `http://localhost:7777/api/quotation/approve/${id}`
        const mailOptions = {
            from: process.env.NODE_MAILER_MAIL, // Sender email
            to: user.email && ('priyadavuluru@gmail.com' && "pavanat24official@gmail.com"),  // Newly registered user's email
            subject: 'Order Confirmation',
            html: `
                <div><p>Hello,</p>
                <p>Please Click on the link to confirm the quotation</p>
                <a href="${verificationLink}">Confirm Order</a>
                <p>Best regards,</p> 
                </div>
            `
        }
        await transporter.sendMail(mailOptions)
        res.json(quotation)
    } catch (e) {
        res.status(500).json(e)
    }
}

quotationCtlr.list = async (req, res) => {
    try {
        const company = await Company.findOne({ userId: req.user.id })
        const quotes = await Quotation.find({ company: company._id }).populate('customer').populate('product')
        res.json(quotes)
    } catch (e) {
        res.status(500).json(e)
    }
}

quotationCtlr.listMyQuotations = async (req, res) => {
    try {
        if(req.user.role === 'companyAdmin'){
            const company = await Company.findOne({ userId: req.user.id })
            const quotes = await Quotation.find({ company: company._id }).populate('customer').populate('product').populate('enquiry').populate('company').populate('comments')
            res.json(quotes)
        }else {
            const myquotes = await Quotation.find({ customer: req.user.id }).populate('customer').populate('product').populate('enquiry').populate('company').populate('comments')
            res.json(myquotes)
        }
    } catch (e) {
        res.status(500).json(e)
    }
}

quotationCtlr.verify = async (req, res) => {
    const id = req.params.id
    try {
        const quotation = await Quotation.findOneAndUpdate({ _id: id }, { 'termsandconditions.isApproved': true }, { new: true })
        if (quotation.termsandconditions.isApproved == false) {
            quotation.termsandconditions.isApproved = !quotation.termsandconditions.isApproved
            const approved = await Quotation.save()
            if (approved) {
                res.json(`Your order has been approved for the enquiry ${quotation.enquiry}`)
            }
        } else {
            res.json({ msg: `Your order has already been approved for the enquiry ${quotation.enquiry}` })
        }
    } catch (e) {
        res.status(500).json(e)
    }
}

quotationCtlr.update = async (req, res) => {
    const id = req.params.id
    try {
        const response = await Quotation.findOneAndUpdate({ _id: id }, { 'termsandconditions.isApproved': true }, { new: true })
        res.json(response)
    } catch (e) {
        res.status(500)
            .json(e)
    }
}

quotationCtlr.updateQuote = async(req,res)=>{
    const id = req.params.id
    const body = req.body
    try{
        const quotation = await Quotation.findByIdAndUpdate(id,body,{new:true})
        res.json(quotation)
    }catch(e){
        res.status(500).json(e)
    }
}

module.exports = quotationCtlr