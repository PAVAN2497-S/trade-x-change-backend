const paymenttypeSchema = {
    notEmpty:{
        errorMessage:'Payment type should not be empty'
    }
}

const amountSchema = {
    notEmpty:{
        errorMessage:'Amount should not be empty'
    }
}

const quotationSchema = {
    notEmpty:{
        errorMessage:'Quotation shouldn\'t be empty'
    },
    isMongoId:{
        errorMessage:'Quotation Id should be valid'
    }
}

const paymentValidation = {
    type:paymenttypeSchema,
    quotation:quotationSchema
}

module.exports = paymentValidation