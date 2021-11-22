import { HttpException } from '../exceptions/Exceptions';
import { INTERNAL_SERVER_ERROR } from '../constants/errorCodes';

export default function handleErrors(err, req, res, next) {
    if (err instanceof HttpException) {
        return res.status(err.getStatusCode()).json({
            data: null,
            error: {
                status: 'error',
                message: err.message,
            },
            success: false,
        });
    }

    return res.status(INTERNAL_SERVER_ERROR).json({
        data: null,
        error: {
            status: 'error',
            message: err.message,
        },
        success: false,
    });
};
