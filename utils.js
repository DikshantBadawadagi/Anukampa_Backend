class ApiResponse {
    constructor(statusCode, message = "Success", data = null) {
        this.statusCode = statusCode;
        this.message = message;
        this.success = true;
        this.data = data;
    }

    send(res) {
        return res.status(this.statusCode).json({
            message: this.message,
            success: this.success,
            data: this.data,
        });
    }
}


const HTTP_SUCCESS = (res, data = null, message = "Success") => {
    return new ApiResponse(200, message, data).send(res);
};

const HTTP_CREATED = (res, data = null, message = "Created") => {
    return new ApiResponse(201, message, data).send(res);
};

const HTTP_NO_CONTENT = (res, message = "No Content") => {
    return res.status(204).send(); // No content response
};

export { ApiResponse, HTTP_SUCCESS, HTTP_CREATED, HTTP_NO_CONTENT };
