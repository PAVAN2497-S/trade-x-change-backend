const Category = require('../models/category-model')
const categoryValidationSchema = {
   name: {
      notEmpty: {
         errorMessage: 'category should not be empty'
      },
      custom: {
         options: async (value) => {
            const catergory = await Category.findOne({ name: { '$regex': value, $options: 'i' } })
            if (catergory) {
               throw new Error('category already exists..!')
            } else {
               return true
            }
         }
      }
   }
}
module.exports = categoryValidationSchema