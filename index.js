require('dotenv').config()
const express = require('express')
const cors = require('cors')
const app = express()
app.use(express.json())
app.use(cors())
const configDB = require('./app/config/db')
const userCtlr = require('./app/controllers/users-ctlr')
const multer = require('multer')
configDB()
const { checkSchema } = require('express-validator')



//helpers
const { userRegisterSchema, companyRegisterSchema, loginValidationSchema } = require('./app/helpers/userValidationSchema')
const quotationValidationSchema = require('./app/helpers/quotationValidationSchema')
const categoryValidationSchema = require('./app/helpers/categoryValidation')
const enquiryValidationSchema = require('./app/helpers/enquiryValidationSchema')
const productValidation = require('./app/helpers/productValidation')
const { authenticateUser, authorizeUser } = require('./app/middlewares/authenticate')
const orderValidation = require('./app/helpers/orderAcceptanceValidation')

//controllers
const categoryCltr = require('./app/controllers/category-ctlr')
const productCltr = require('./app/controllers/product-ctlr')
const enquiryCtlr = require('./app/controllers/enquiry-ctlr')
const quotationCtlr = require('./app/controllers/quotation-ctlr')
const orderAcceptanceCtlr = require('./app/controllers/orderAcceptance-ctlr')
const paymentValidation = require('./app/helpers/paymentValidation')
const paymentCtlr = require('./app/controllers/payment-ctlr')
const commentsCtlr = require('./app/controllers/comments-ctlr')
const upload = multer()

const port = process.env.PORT || 3030

//users & company
app.post('/api/user/register', checkSchema(userRegisterSchema), userCtlr.userRegister)
app.get('/api/users/verify/:token', userCtlr.verify)
app.post('/api/company/register', checkSchema(companyRegisterSchema), userCtlr.companyRegister)
app.post('/api/login', checkSchema(loginValidationSchema), userCtlr.login)
app.put('/api/user/update', authenticateUser, userCtlr.findUser)
app.put('/api/company/update', authenticateUser, userCtlr.updateCompany)
app.get('/api/users/list', authenticateUser, authorizeUser(['superAdmin']), userCtlr.list)
app.get('/api/companies/list', userCtlr.listCompanies)
app.get('/api/getprofile', authenticateUser, userCtlr.getProfile)
app.get('/api/company/:id', userCtlr.getCompanyDetails)

//category
app.post('/api/categories', authenticateUser, authorizeUser(['companyAdmin']), checkSchema(categoryValidationSchema), categoryCltr.create)
app.get('/api/categories/list', categoryCltr.list)

// product
app.post('/api/products', upload.array('image'), authenticateUser, authorizeUser(['companyAdmin']), checkSchema(productValidation), productCltr.create)
app.get('/api/products/list', productCltr.list)
app.get('/api/:id/products', productCltr.category)
app.get('/api/productdetails/:id', productCltr.find)
app.delete('/api/products/:id', authenticateUser, authorizeUser(['companyAdmin']), productCltr.delete)
// app.put('/api/products/update/:id', upload.array('image'), authenticateUser, productCltr.update)

//enquiry model
app.post('/api/enquiry/create', authenticateUser, authorizeUser(['customer']), checkSchema(enquiryValidationSchema), enquiryCtlr.create)
app.get('/api/enquiries/list', authenticateUser, authorizeUser(['customer', 'companyAdmin']), enquiryCtlr.list)

//quotation
app.post('/api/quotation/create', authenticateUser, authorizeUser(['companyAdmin']), checkSchema(quotationValidationSchema), quotationCtlr.create)
// app.get('/api/quotations/list', authenticateUser, authorizeUser(['companyAdmin']), quotationCtlr.list)
app.get('/api/quotations/list', authenticateUser, authorizeUser(['companyAdmin', 'customer']), quotationCtlr.listMyQuotations)
app.get('/api/quotation/approve/:id', quotationCtlr.verify)
app.put('/api/quotation/isapproved/:id', quotationCtlr.update)
app.put('/api/quotation/:id', authenticateUser, authorizeUser(['companyAdmin']), quotationCtlr.updateQuote)

//order-acceptance
app.post('/api/orders/create', authenticateUser, authorizeUser(['companyAdmin']), checkSchema(orderValidation), orderAcceptanceCtlr.create)
app.get('/api/orders/list', authenticateUser, authorizeUser(['customer', 'companyAdmin']), orderAcceptanceCtlr.list)
app.put('/api/order/:id', authenticateUser, authorizeUser(['companyAdmin']), orderAcceptanceCtlr.update)
//app.get('/api/notify', orderAcceptanceCtlr.notify)

//payment
app.post('/api/payment', authenticateUser, authorizeUser(['customer']), checkSchema(paymentValidation), paymentCtlr.create)
app.get('/api/payment/update/:id', authenticateUser, authorizeUser(['customer']), paymentCtlr.update)
app.delete('/api/payment/:id', authenticateUser, authorizeUser(['customer']), paymentCtlr.delete)

//comments
app.post('/api/quotation/comments', authenticateUser, authorizeUser(['customer', 'companyAdmin']), commentsCtlr.create)
app.get('/api/quotation/comments/:id', authenticateUser, authorizeUser(['customer', 'companyAdmin']), commentsCtlr.list)

app.listen(port, () => {
    console.log('connected to port', port)
})