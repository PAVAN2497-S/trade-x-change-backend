const Category = require('../models/category-model')
const { validationResult } = require('express-validator')
const _ = require('lodash')
const Company = require('../models/company-model')
const categoryCltr = {}

categoryCltr.create = async (req, res) => {
   const errors = validationResult(req)
   if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
   }
   const body = req.body
   const data = await Company.findOne({userId:req.user.id})
   body.companyId = data._id
   const category = new Category(body)
   try {
      await category.save()
      await Company.findOneAndUpdate({userId:req.user.id},{$push:{categories:category._id}})
      res.json(category)
   } catch (e) {
      res.status(500).json(e)
   }
}

categoryCltr.list = async (req, res) => {
   try {
      const catergory = await Category.find()
      res.json(catergory)
   } catch (e) {
      res.status(500).json(e)
   }
}


module.exports = categoryCltr