import moment from 'moment';

export const LIST_AM_PAGE_COUNT = 250; // 1 page = 90 cars

export const LIST_AM = {
    NAME: 'list.am',
    URL: 'https://www.list.am',
    REALESTATE_CATEGORY: 'category/56/',
    PER_PAGE_DELAY: 1000, // 1 second,
    DATE_FORMAT: 'DD-MM-YYYY',
    CLEARED_CUSTOMS: 1, // 0 - all, 1 - yes 2 - no
};

export const AUTO_AM = {
    NAME: 'auto.am',
    URL: 'https://auto.am/',
    PER_PAGE_DELAY: 1000, // 1 second
    DATE_FORMAT: 'DD-MM-YYYY',
};

export const AUTO_AM_SESSION = 'autoam_session';

export const MARKS = {
    BMW: 'BMW',
    TOYOTA: 'TOYOTA',
    LEXUS: 'LEXUS',
    MERCEDES: {
        MARKS: ['MERCEDES-BENZ', 'MERCEDES'],
        MODELS: ['A', 'B', 'C', 'E', 'G', 'GL', 'GLE', 'GLK', 'CLS', 'ML', 'S', 'R'],
    },
    PRIORA: 'PRIORA',
    NIVA: 'NIVA',
    VAZ_LADA: 'VAZ (LADA)',
};

export const YEAR_COUNT = 20;

export const YEAR_COUNT_OLD_VEHICLES = 27;

export const START_YEAR = +moment().utc().subtract(YEAR_COUNT, 'years').format('YYYY');

export const START_YEAR_OLD_VEHICLES = +moment().utc().subtract(YEAR_COUNT_OLD_VEHICLES, 'years').format('YYYY');

export const END_YEAR = moment().utc().format('YYYY');

export const USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.122 Safari/537.36';

export const CERATED_DATE_RANGE = {
    FROM: 10, // days
    TO: 90, // days
};

export const PRICE_RANGE = {
    FROM: 1000, // dollars
    TO: 99999, // dollars
};

export const SCRAPER_DATE_FORMAT = 'YYYY-MM-DD';

export const LOGGER_DATE_FORMAT = 'DD-MM-YYYY HH:mm:ss';

export const LOGGER_FILE_DATE_FORMAT = 'DD-MM-YYYY';

export const MORGAN_TYPE = 'dev';

export const DEVIATED_PERCENT = 20;

export const AVERAGE_DEVIATED_PERCENT = 10;

export const AMD = 'AMD';

export const USD = 'USD';

export const RUSSIAN_CARS_RELEASED_YEAR = 2016;

export const COUNTABLE_VEHICLES = 5;

export const PHONE_NUMBER_CODE = '+374';

export const FILTER_RANGE = {
    MAX: {
        count: 100,
        percent: 30,
    },
    MIDDLE: {
        count: 50,
        percent: 25,
    },
    MIN: {
        count: 10,
        percent: 20,
    },
};

export const REQUEST_TIMEOUT = 1000 * 30; // 30 seconds

export const REQUEST_TRIES = 3;

export const REQUEST_RETRY_DELAY = 2000; // 2 seconds

export const REQUEST_CANCELLATION_TIMEOUT = 1000 * 60; // 1 minute

export const VEHICLE_SETTINGS_INITIAL_VERSION = 1;
