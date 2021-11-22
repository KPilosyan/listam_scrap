import { HttpException } from './Exceptions';
import { NOT_FOUND } from '../constants/errorCodes';

export default class NotFoundHttpException extends HttpException {
    constructor(message) {
        super(message, NOT_FOUND);
    }
};