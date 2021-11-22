import { INTERNAL_SERVER_ERROR } from '../constants/errorCodes';

class HttpException extends Error {
    constructor(message = '', statusCode = INTERNAL_SERVER_ERROR) {
        super(message);
        this.message = message;
        this._statusCode = statusCode;
    }

    getStatusCode() {
        return this._statusCode;
    }
}
export {
    HttpException,
};
