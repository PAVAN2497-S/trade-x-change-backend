const productSchema = {
    notEmpty: {
        errorMessage: 'Product shouldn\'t be empty'
    },
    isMongoId: {
        errorMessage: 'Valid mongo id should be given'
    }
}

const quantitySchema = {
    notEmpty: {
        errorMessage: 'Quantity shouldn\'t be empty'
    },
    isNumeric: {
        errorMessage: 'Quantity should be numeric'
    },
    custom:{
        options:(value)=>{
            if(value <=0){
                throw new Error('quantity should be greater than zero')
            }
            else{
                return true
            }
        }
    }
}

const enquiryValidationSchema = {
    productId: productSchema,
    quantity: quantitySchema
}

module.exports = enquiryValidationSchema