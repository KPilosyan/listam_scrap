import { HttpException } from './Exceptions';
import { BAD_REQUEST } from '../constants/errorCodes';

export default class BadRequestHttpException extends HttpException {
    constructor(message) {
        super(message, BAD_REQUEST);
    }
};