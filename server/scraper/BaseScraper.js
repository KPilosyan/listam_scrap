import moment from 'moment';
import _ from 'lodash';
import DBService from '../services/DBService';
import DBServiceVehicleSettings from '../services/DBServiceVehicleSettings';
import {
    SCRAPER_DATE_FORMAT,
    CERATED_DATE_RANGE,
    PRICE_RANGE,
    AMD,
    START_YEAR,
} from '../constants';
import Logger from '../modules/Logger';

export default class BaseScraper {
    constructor () {
        this.dram = '֏';
        this.dollar = '$';
        this.dates = {};
        this.dbService = new DBService();
        this.dbServiceVehicleSettings = new DBServiceVehicleSettings();
    }

    inDateRange (date) {
        const { FROM, TO } = CERATED_DATE_RANGE;
        const fromDate = moment().utc().subtract(FROM, 'days').format(SCRAPER_DATE_FORMAT);
        const toDate = moment().utc().subtract(TO, 'days').format(SCRAPER_DATE_FORMAT);

        return moment(date).isBetween(toDate, fromDate);
    }

    inPriceRange (price, currency, usdRate) {
        const usdPrice = currency === AMD ? price / usdRate : price;

        return usdPrice >= PRICE_RANGE.FROM && price <= PRICE_RANGE.TO;
    }

    async getExistingCars(properties) {
        try {
            const vehicles = await this.dbService.getVehiclesByPublishedId(properties.map(_ => _.id));

            const cars = _.reduce(vehicles, (result, vehicle) => {
                const { price, released } = _.find(properties, { id: vehicle.publishedId });

                result.push({
                    model: vehicle.model,
                    mark: vehicle.mark,
                    released,
                    price,
                    currency: vehicle.currency,
                    publishedId: vehicle.publishedId,
                    publishedDate: vehicle.publishedDate,
                    publisherPhoneNumber: vehicle.publisherPhoneNumber,
                });

                return result;
            }, []);

            return cars;
        } catch (e) {
            Logger().error({ message: 'BaseScraper:getExistingCars:FAILED', ERROR: e.message });
        }
    }

    async getStartYear(settingsCategories, modelCategory) {
        try {
            const existedCategory = _.find(settingsCategories, (el) => el.category_id === modelCategory);

            if (existedCategory) {
                const startYear = await this.dbServiceVehicleSettings.getVehicleSettingsCategoryLowestYearByMark(existedCategory.mark);

                return startYear;
            }

            return START_YEAR;
        } catch (e) {
            Logger().error({ message: 'BaseScraper:getStartYear:FAILED', ERROR: e.message });
        }
    }

    sleep (ms) {
        return new Promise((resolve) => {
            setTimeout(resolve, ms);
        });
    }
}
