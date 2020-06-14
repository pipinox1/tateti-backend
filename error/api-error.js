class ApiError extends Error {
    constructor(message, code) {
      super(message);
     // Ensure the name of this error is the same as the class name
      this.name = this.constructor.name;
      this.code = code;
     // This clips the constructor invocation from the stack trace.
     // It's not absolutely essential, but it does make the stack trace a little nicer.
     //  @see Node.js reference (bottom)
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  class NotFoundError extends ApiError {
    constructor(message) {
      super(message, 404);
    }
  }
  
  // I do something like this to wrap errors from other frameworks.
  // Correction thanks to @vamsee on Twitter:
  // https://twitter.com/lakamsani/status/1035042907890376707
  class InternalError extends ApiError {
    constructor(message){
        super(message, 400)
    }
  }

  class BadRequestError extends ApiError {
      constructor(message){
          super(message, 500)
      }
  }
  
module.exports = {
    NotFoundError, InternalError, BadRequestError, ApiError
}