const tbl_User = require("../models/users.models");
const catchAsync = require("../outils/catch");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");

const signToken = (id, email, username) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE_IN,
  });
};
// ************************************************************************

exports.userRegistration = catchAsync(async (req, res, next) => {
  const create = await tbl_User.create({
    name: req.body.name,
    username: req.body.username,
    email: req.body.email,
    phone: req.body.phone,
    password: req.body.password,
    passwordconfirm: req.body.passwordconfirm,
  });
  const token = signToken(create._id, create.email, create.username);
  res.status(201).json({ data: create, token });
});

exports.addSocial = catchAsync(async (req, res, next) => {
  const accout = req.body.social;
  const { id } = req.params;
  const check = await tbl_User.exists({ _id: id });
  if (!check) {
    return res.status(400).json({
      message: "Utilisateur introuvable, verifier vos informations !",
    });
  }
  const social = await tbl_User.findOneAndUpdate(
    { _id: req.params.id },
    {
      $push: { social: accout },
    }
  );
  if (!social) {
    return res.status(400).json({
      message:
        "Une erreur d'enregistrement est survenue veuillez verifier vos informations !",
    });
  }
  return res.status(201).json({ data: social });
});

exports.deleteSocial = catchAsync(async (req, res, next) => {
  const accout = req.body.social;
  const { id } = req.params;
  const check = await tbl_User.exists({ _id: id });
  if (!check) {
    return res.status(400).json({
      message: "Utilisateur introuvable, verifier vos informations !",
    });
  }
  const social = await tbl_User.findOneAndUpdate(
    { _id: id },
    {
      $pull: { social: accout },
    }
  );
  if (!social) {
    return res.status(400).json({
      message:
        "Une erreur de suppression est survenue veuillez verifier vos informations !",
    });
  }
  return res.status(201).json({ message: "Suppression avec succès !" });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const check = await tbl_User.exists({ _id: id });
  if (!check) {
    return res.status(400).json({
      message: "Utilisateur introuvable, verifier vos informations !",
    });
  }
  const updateUser = await tbl_User.findOneAndUpdate({ _id: id }, req.body, {
    new: true,
    runValidators: true,
  });
  if (!updateUser) {
    return res
      .status(400)
      .json({ message: "Problème de mise à jour ! verifier vos informations" });
  }
  return res.status(200).json({ data: updateUser });
});

exports.getUserInfos = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const check = await tbl_User.exists({ _id: id });
  if (!check) {
    return res.status(400).json({
      message: "Utilisateur introuvable, verifier vos informations !",
    });
  }
  const getInfos = await tbl_User
    .findOne({ _id: id })
    .select("name username email phone social");
  if (!getInfos) {
    return res.status(200).json({
      message:
        "Problème d'accès aux informations de l'utilisateur verifier vos informations !",
    });
  }
  return res.status(200).json({ data: getInfos });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const check = await tbl_User.exists({ _id: id });
  if (!check) {
    return res.status(400).json({
      message: "Utilisateur introuvable, verifier vos informations !",
    });
  }
  await tbl_User.findOneAndDelete({ _id: id });
  return res.status(200).json({ message: "Suppression avec succès !" });
});

exports.signIn = catchAsync(async (req, res, next) => {
  const { credation, password } = req.body;
  if (!credation || !password) {
    return res
      .status(400)
      .json({ message: "Veuillez entrez vos informations de connexion !" });
  }
  const findUser = await tbl_User.findOne({ email: email }).select("+password");
  const correct = findUser.correctPassword(password, findUser.password);
  if (!correct || !findUser) {
    return res
      .status(200)
      .json({ message: "Vos données de d'authentification sont incorrect !" });
  }
  const token = signToken(findUser._id, findUser.email, findUser.username);
  return res.status(200).json(token);
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return res.status(500).json({
      message: "You are not logged in! Please log in to get access !",
    });
  }
  const decoded = promisify(jwt.verify)(token, process.env.JWT_SECRET);
  const freshUser = await tbl_User.findById(decoded.id);
  if (!freshUser) {
    return next(
      new Error("The token belonging to this user does no loger exists.")
    );
  }
  if (freshUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new Error("User recently changed password ! Please log in again")
    );
  }
  req.user = freshUser;
  next();
});

exports.restrictTo = () => {
  return async (req, res, next) => {
    const user = req.params.id;
    const check = await tbl_User.findOne({ _id: user });
    if (!check.iscreator) {
      return next(new Error("Vous n'etes pas autorisé à accéder ici !"));
    }
    next();
  };
};

exports.restrictToAuth = () => {
  return async (req, res, next) => {
    const user = req.params.id;
    const check = await tbl_User.findOne({ _id: user });
    if (!check.authentifierPhone || !check.authentifierEmail) {
      return next(
        new Error(
          "Vous n'etes pas autorisé à accéder ici Veuillez valide votre email et le numéro de telephone !"
        )
      );
    }
    next();
  };
};
