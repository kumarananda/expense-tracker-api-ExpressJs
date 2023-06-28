

// express error handlerr
const errorHandler = (error, req, res, next) => {
    console.log(error);
    const errorStatus = error.status || 500;
    const errorMessage = error.message || "Unknown Error" ;


    return res.status(errorStatus).json({
        message : errorMessage,
        status : errorStatus ,
        stack : error.stack
    })
}

module.exports =  errorHandler;
