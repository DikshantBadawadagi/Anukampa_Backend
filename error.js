// export const createError = (status,message) => {
//     const error = new Error();
//     error.status = status || 500;
//     error.message = message || "Something went wrong";
//     return error;
// }

class ApiError extends Error {
    constructor (
        statusCode,
        message= "Something went wrong",
        errors = [],
        stack = ""
    ){
        super(message)
        this.statusCode = statusCode
        this.data = null
        this.message = message
        this.success = false
        this.errors = errors

        if(stack) {
            this.stack = stack
        }else{
            Error.captureStackTrace(this, this.constructor)
        }
    }
}

export default ApiError;