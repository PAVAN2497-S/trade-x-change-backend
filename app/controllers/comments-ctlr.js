const Comment = require('../models/comment-model')
const Quotation = require('../models/quotation-model')

const commentsCtlr = {}

commentsCtlr.create = async(req,res)=>{
    const body = req.body
    const comment = new Comment(body)
    comment.userId = req.user.id
    try{
        await comment.save()
        await Quotation.findOneAndUpdate({_id:comment.quotationId},{$push:{comments:comment._id}})
        res.json(comment)
    }catch(e){
        res.status(500).json(e)
    }
}

commentsCtlr.list = async(req,res)=>{
    const id = req.params.id
    try{
        const comments = await Comment.find({quotationId:id}).populate('userId',['username'])
        res.json(comments)
    }catch(e){
        res.status(500).json(e)
    }
}

module.exports = commentsCtlr