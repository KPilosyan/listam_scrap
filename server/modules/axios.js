import axios from 'axios';
import axiosRetry from 'axios-retry';
import {
    REQUEST_TIMEOUT,
    REQUEST_TRIES,
    REQUEST_RETRY_DELAY,
} from '../constants';

const axiosInstance = axios.create({
    timeout: REQUEST_TIMEOUT,
});

axiosRetry(axiosInstance, {
    retries: REQUEST_TRIES,
    retryCondition: () => {
        // retry for every error and every method
        return true;
    },
    retryDelay: () => {
        return REQUEST_RETRY_DELAY;
    },
    shouldResetTimeout: true,
});

export default axiosInstance;
