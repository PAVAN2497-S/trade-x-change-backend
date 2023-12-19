const User = require('../models/users-model')
const Company = require('../models/company-model')
const { validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const axios = require('axios')
const _ = require('lodash')
const uuid = require('uuid')
const jwt = require('jsonwebtoken')
const transporter = require('../config/nodemailer')
const userCtlr = {}

userCtlr.userRegister = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    const body = req.body
    try {
        const user = new User(body)
        const salt = await bcrypt.genSalt()
        user.password = await bcrypt.hash(user.password, salt)
        const totalDocuments = await User.countDocuments()
        if (totalDocuments == 0) {
            user.role = 'superAdmin'
        }
        const usr = await user.save()
        if (usr.role !== 'superAdmin') {
            await User.findOneAndUpdate({ role: 'superAdmin' }, { $push: { customers: user._id } })
        }
        if (usr) {
            const token = jwt.sign({ id: usr._id }, process.env.JWT_SECRET, { expiresIn: '7d' })
            //console.log(token)
            const verificationLink = `http://localhost:7777/api/users/verify/${token}`

            const mailOptions = {
                from: process.env.NODE_MAILER_MAIL, // Sender email
                to: user.email || 'priyadavuluru@gmail.com' && "pavanat24official@gmail.com",  // Newly registered user's email
                subject: 'Email Verification',
                html: `
                    <p>Hello,</p>
                    <p>Thank you for registering! Please click the following link to verify your email:</p>
                    <a href="${verificationLink}">Verify Email</a>
                    <p>Best regards,</p>
                `
            }
            await transporter.sendMail(mailOptions)
            res.json({
                usr: usr,
                msg: `${usr.username}, Please Verify your email send to your email address to access your account`
            })
        }

    } catch (e) {
        res.status(500).json(e)
    }
}

userCtlr.verify = async (req, res) => {
    const token = req.params.token
    try {
        const verifyToken = jwt.verify(token, process.env.JWT_SECRET)

        //checking if token user present
        const user = await User.findOne({ _id: verifyToken.id })
        if (user.verified == false) {
            user.verified = !user.verified
            const verified = await user.save()
            if (verified) {
                res.json("Thankyou for registering with us.... Your account has been successfully verified.Please login to continue")
            }
        } else {
            res.json({ msg: "Your account has already been verified....Please login to continue" })
        }
    } catch (e) {
        res.status(500).json(e)
    }
}

userCtlr.companyRegister = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    try {
        const body = req.body
        const user = new User(body)
        const body1 = req.body
        //const address = await 

        const salt = await bcrypt.genSalt()
        user.password = await bcrypt.hash(user.password, salt)
        const totalDocuments = await User.countDocuments()
        if (totalDocuments == 0) {
            user.role = 'superAdmin'
        }
        await user.save()
        const company = new Company(body1)
        if (user.role == 'superAdmin') {
            company.isApproval = true
        }
        company.userId = user._id
        const response = await axios.get(`https://api.geoapify.com/v1/geocode/search?text=${body1.contactdetails.address.name}&format=json&apiKey=ded62e99b09540618a5035ea72fa33ec`)
        company.contactdetails.address.lattitude = response.data.results[0].lat
        company.contactdetails.address.longitude = response.data.results[0].lon
        if (user.role !== 'superAdmin') {
            await User.findOneAndUpdate({ role: 'superAdmin' }, { $push: { users: user._id } })
        }
        await company.save()
        res.json({ user, company })
    } catch (e) {
        res.status(500).json(e)
    }
}


userCtlr.login = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    const body = _.pick(req.body, ['email', 'password'])
    try {
        const user = await User.findOne({ email: body.email })
        if (!user) {
            return res.status(404).json({ errors: [{ msg: 'Invalid email/Password' }] })
        }
        const result = await bcrypt.compare(body.password, user.password)
        if (!result) {
            return res.status(404).json({ errors: [{ msg: 'Invalid Email/Password' }] })
        }
        const tokenData = {
            id: user._id,
            role: user.role
        }
        const token = jwt.sign(
            tokenData,
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        )
        res.json({ token: token })
    } catch (e) {
        res.status(500).json(e)
    }
}

userCtlr.getProfile = async (req, res) => {
    try {
        if (req.user.role == 'companyAdmin') {
            const user = await User.findById(req.user.id)
            const company = await Company.findOne({ userId: req.user.id }).populate({
                path: 'enquiries',
                populate: [
                    { path: 'customerId', select: 'username email' },
                    { path: 'productId', select: ['productname', 'perUnitCost'] },
                ],
            }).populate({
                path: 'orders',
                populate: [
                    { path: 'customerId', select: 'username' },
                    { path: 'quotationId' }
                ],
            }).exec()
            res.json({ user, company })
        } else {
            const customer = await User.findOne({ _id: req.user.id })
                .populate({
                    path: 'myQuotations',
                    populate: {
                        path: 'enquiry',
                        populate: [
                            { path: 'company' },
                            { path: 'productId' }
                        ]
                    }
                })
                .populate({
                    path: 'myenquiries',
                    populate: [
                        { path: 'company' },
                        { path: 'productId' }
                    ]
                })
                .populate({
                    path: 'myOrders',
                    populate: [
                        { path: 'company' },
                        { path: 'quotationId' },
                        { path: 'productId' }
                    ]
                })
            res.json(customer)
        }
    } catch (e) {
        res.status(500).json(e)
    }
}

userCtlr.list = async (req, res) => {
    try {
        const users = await User.find()
        res.json(users)
    } catch (e) {
        res.status(500).json(e)
    }
}

userCtlr.listCompanies = async (req, res) => {
    try {
        const companies = await Company.find().populate('userId', ['username', 'email']).populate('products')
        res.json(companies)
    } catch (e) {
        res.status(500).json(e)
    }
}

userCtlr.findUser = async (req, res) => {
    const body = req.body
    try {
        const user = await User.findByIdAndUpdate({ _id: req.user.id }, body, { new: true })
        res.json(user)
    } catch (e) {
        res.status(500).json(e)
    }
}

userCtlr.getCompanyDetails = async (req, res) => {
    const id = req.params.id
    try {
        const company = await Company.findById({ _id: id }).populate('products', ['productname']).populate('categories', ['name'])
        res.json(company)
    } catch (e) {
        res.status(500).json(e)
    }
}

userCtlr.updateCompany = async (req, res) => {
    const body = req.body
    try {
        const company = await Company.findOneAndUpdate({ userId: req.user.id }, body, { new: true })
        res.json(company)
    } catch (e) {
        res.status(500).json(e)
    }
}

module.exports = userCtlr