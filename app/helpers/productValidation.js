const { isEmpty } = require("lodash");

const productValidation = {
   productname: {
      notEmpty: {
         errorMessage: 'productname required'
      },
      isLength: {
         options: { min: 4 },
         errorMessage: 'minimum 4 characters required for product name..'
      }
   },
   description: {
      notEmpty: {
         errorMessage: 'description should not be empty'
      }
   },
   perUnitCost: {
      isNumeric: {
         errorMessage: 'enter number'
      },
      notEmpty: {
         errorMessage: 'enter cost of product'
      }
   },
   categoryId: {
      isMongoId: {
         errorMessage: 'should be a valid mongodb id'
      }
   },
   image: {
      custom: {
         options: (value, { req }) => {
            //console.log(req, 'v')
            if (isEmpty(req.files)) {
               throw new Error('image file is required');
            }
            return true;
         }
      }
   },
   productWarranty: {
      notEmpty: {
         errorMessage: 'product warrenty required'
      }
   },
   paymentTerms: {
      notEmpty: {
         errorMessage: 'mention payment terms'
      }
   }
}
module.exports = productValidation