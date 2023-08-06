const tbl_User = require('../models/users.models')
const mongoose = require('mongoose')
const catchAsync = require('../outils/catch')
const jwt = require('jsonwebtoken')

const signToken = (id, email, username) =>{
    return jwt.sign({id}, process.env.JWT_SECRET,{ expiresIn: process.env.JWT_EXPIRE_IN})
}
// ************************************************************************

exports.userRegistration = catchAsync( async (req, res, next) =>{
    const create = await tbl_User.create({
        "name": req.body.name,
        "username": req.body.username,
        "email": req.body.email,
        "phone": req.body.phone,
        "password": req.body.password,
        "passwordconfirm": req.body.passwordconfirm
    })
    const token = signToken(create._id, create.email, create.username)
    res.status(201).json({data: create, token})
})

exports.addSocial = catchAsync(async (req, res, next)=>{
    const accout = req.body.social
    const social = await tbl_User.findOneAndUpdate({_id:req.params.id},{
        $push : {social: accout}
    })
    if (!social){
        res.status(400).json({message: "Une erreur d'enregistrement est survenue veuillez verifier vos informations !"})
    }
})

exports.deleteSocial = catchAsync(async (req, res, next)=>{
    const accout = req.body.social
    const social = await tbl_User.findOneAndUpdate({_id:req.params.id},{
        $pull : {social: accout}
    })
    if (!social){
        res.status(400).json({message: "Une erreur de suppression est survenue veuillez verifier vos informations !"})
    }
})
