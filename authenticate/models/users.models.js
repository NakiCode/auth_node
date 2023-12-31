const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: [true, "Le nom d'utilisateur est requis !"],
    minlength: [2, "Le nom d'utilisateur n'est pas valide !"],
    maxlength: [55, "Le nom d'utilisateur est trop long"],
    validate: {
      validator: function (value) {
        return this.constructor
          .findOne({ name: value })
          .exec()
          .then((name) => !name);
      },
      message: "Le nom d'utilisateur existe déjà !",
    },
  },
  username: {
    type: String,
    trim: true,
    required: [true, "Le nom d'utilisateur est requis !"],
    minlength: [2, "Le nom d'utilisateur n'est pas valide !"],
    maxlength: [55, "Le nom d'utilisateur est trop long"],
    validate: {
      validator: function (value) {
        return this.constructor
          .findOne({ username: value })
          .exec()
          .then((username) => !username);
      },
      message: "Le nom d'utilisateur existe déjà !",
    },
  },
  email: {
    type: String,
    required: [true, "Un email est hautement réquis"],
    trim: true,
    validate: {
      validator: function (value) {
        return this.constructor
        .findOne({ email: value })
        .exec()
        .then((email) => !email);
      },
      message: "Un utilisateur avec cette email existe déjà !",
    },
    validate: [validator.isEmail, "Veuillez renseigner un email valide !"],
    lowercase: true,
  },
  phone: {
    type: String,
    required: true,
    match: [
      /^(\+|00)?(\d{12,20})$/,
      "Le format du numéro de téléphone est invalide Exemple : 0033 xxx xxx xxx pour FR",
    ],
    validate: {
      validator: function (value) {
        return this.constructor
          .findOne({ phone: value })
          .exec()
          .then((phone) => !phone);
      },
      message: "Un utilisateur avec le meme numèro existe déjà !",
    },
  },
  image: {
    type: String,
    validate: {
      validator: function (value) {
        return this.constructor
          .findOne({ image: value })
          .exec()
          .then((image) => !image);
      },
      message: "Cette photo de profile existe déjà !",
    },
  },
  couverture: {
    type: String,
    validate: {
      validator: function (value) {
        return this.constructor
          .findOne({ couverture: value })
          .exec()
          .then((couverture) => !couverture);
      },
      message: "Cette photo de couverture existe déjà !",
    },
  },
  social:[{
    type:String
  }],
  password: {
    type: String,
    required: [true, "Le mot de passe est réquis !"],
    trim: true,
    minlength: [8, "Un mot de passe doit comporter au moins 8 caractères"],
    maxlength: [16, "Le mot de passe est trop long !"],
    select: false,
  },
  passwordconfirm: {
    type: String,
    required: [true, "Le mot de passe de confirmation est requis !"],
    trim: true,
    minlength: [8, "Un mot de passe doit comporter au moins 8 caractères"],
    maxlength: [16, "Le mot de passe est trop long !"],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "Le mot de passe n'est pas conforme !",
    },
  },
  termes: {
    type: Boolean,
    default: true,
  },
  authentifierPhone: {
    type: Boolean,
    default: false,
  },
  authentifierEmail: {
    type: Boolean,
    default: false,
  },
  isCreator:{
    type: Boolean,
    default:false
  },
  passwordChangedAt: Date
});

// LES HOOKS
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  this.passwordconfirm = undefined;
  next();
});

UserSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

UserSchema.methods.changedPasswordAfter = function(JWTTimestamp){
  if (this.passwordChangedAt){
    const changeTimestamp = parseInt(
      this.changedPasswordAfter.getTime()/ 1000, 10
    );
    return JWTTimestamp < changeTimestamp;
  }
  return false
}

const tbl_User = mongoose.model("tbl_User", UserSchema);
module.exports = tbl_User;
