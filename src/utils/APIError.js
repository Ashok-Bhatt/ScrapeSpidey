class APIError extends Error{
    constructor(statusCode=404, message="", errors=[], stack=""){
        super(message);
        this.statusCode = statusCode,
        this.message = message,
        this.errors = errors;
        this.success = false;
        if (stack) this.stack = stack;
        else Error.captureStackTrace(this, this.constructor);
    }
}

export {APIError};