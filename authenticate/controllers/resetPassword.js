const crypto = require('crypto')
const catchAsync = require("../outils/catch");
const tbl_User = require("../models/users.models");
const usersController = require('../controllers/users.controller')
const sendMail = require('../outils/sendEmail')

exports.forgotPassword = catchAsync(async (req, res, next) =>{
    const user = await tbl_User.findOne({email:req.body.email})
    if (!user){
        return next(new Error("There is no user with email address ..."));
    }
    const resetToken = await user.createPaswordResetToken()
    user.save({validateBeforeSave:false})
    const resetURL = `${req.protocol}://${req.get('host)}/api/v1/users/resetPassword/${resetToken}`;
})





exports.resetPassword = catchAsync(async (req, res, next) =>{
    const hashToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await tbl_User.findOne({passwordResetToken: hashToken, passwordResetExpires: {$gt:Date.now()}});
    if (!user){
        return new Error('Token is invalid or has expired')
    }
    user.password = req.body.password
    user.passwordConfirm = req.body.passwordConfirm
    user.passwordResetToken = undefined
    user.passwordResetExpires = undefined
    await user.save()
    const token = usersController.signToken(user._id, user.email)
    res.status(200).json({
        status:'success',
        token
    })
})
