import { transports, createLogger, format } from 'winston';
import moment from 'moment';
import { LOGGER_DATE_FORMAT, LOGGER_FILE_DATE_FORMAT } from '../constants';

const Logger = () => {
    const logFileDate = moment().format(LOGGER_FILE_DATE_FORMAT);
    const logDate = moment().format(LOGGER_DATE_FORMAT);

    return createLogger({
        format: format.combine(
            format.timestamp({
                format: logDate,
            }),
            format.printf((info) => {
                const {
                    timestamp, level, message, ...args
                } = info;

                return `${timestamp} [${level}]: ${message} ${Object.keys(args).length ? JSON.stringify(args) : ''}`;
            })
        ),
        transports: [
            new (transports.Console)(),
            new transports.File({
                filename: `./logs/log-${logFileDate}.log`,
                handleExceptions: true,
                tailable: true,
            })
        ],
    });
};

export default Logger;
