const { model, Schema } = require('mongoose')

const commentSchema = new Schema({
   content: String,
   userId: {
      type: Schema.Types.ObjectId,
      ref: 'User'
   },
   quotationId: {
      type: Schema.Types.ObjectId,
      ref: 'Quotation'
   }
}, { timestamps: true })

const Comment = model('Comment', commentSchema)

module.exports = Comment