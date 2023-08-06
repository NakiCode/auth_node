const { ValidationError, DuplicateKeyError, MongoServerError, CastError, Error } = require('mongoose').Error;

const errorHandlerMiddleware = (err, req, res, next) => {
    let statusCode = 500;
    let errorMessage = "Internal Server Error";
    let errors = {...err};

    switch (err.constructor) {
        case ValidationError:
            statusCode = 400;
            const errs = Object.values(errors.errors).map(el => el.message)
            errorMessage =`Invalid input data : ${errs.join('. ')}`;
            break;
        case CastError:
            statusCode = 400;
            errorMessage = `Invalid ${errors.path}: ${errors.value}.`
            break;
        case DuplicateKeyError:
            statusCode = 409;
            const value = errors.errmsg.match(/(["'])(\\?.)*?\1/)[0]
            errorMessage = `Duplicate field value: ${value}. Please use another value !`
            break;
        case Error:
            Object.keys(err.errors).forEach((key) => {
                errors[key] = errors.errors[key].message;
            });
            errorMessage = errors
            break;
        default:
            statusCode = 400;
            errorMessage = `${err}`
            break;
    }
   
    return res.status(statusCode).json({message: errorMessage});
};

module.exports = errorHandlerMiddleware;

