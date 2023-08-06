const catchAsync = require("../outils/catch");

exports.tokenCheck = catchAsync(async (req, res, next) => {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(' ')[1];
      
    }
    if (!token) {
      return res.status(500).json({
        message: "You are not logged in! Please log in to get access !",
      });
    }
    const decoded = promisify(jwt.verify)(token, process.env.JWT_SECRET);
    const decodedData = await decoded;
    const { key} = decodedData;
    const freshUser = await tbl_User.findById(key);
    if (!freshUser) {
      return next(
        new Error("The token belonging to this user does no loger exists.")
      );
    }
})