import cheerio from 'cheerio';
import moment from 'moment';
import _ from 'lodash';
import BaseScraper from './BaseScraper';
import axios from '../modules/axios';
import Logger from '../modules/Logger';
import {
    AMD,
    LIST_AM,
    MARKS,
    PHONE_NUMBER_CODE,
    PRICE_RANGE,
    SCRAPER_DATE_FORMAT,
    USD,
    USER_AGENT,
} from '../constants';

export default class ListAmScraper extends BaseScraper {
    constructor(categories, settingsCategories, usdRate) {
        super();
        this.url = LIST_AM.URL;
        this.carCategory = LIST_AM.CAR_CATEGORY;
        this.delay = LIST_AM.PER_PAGE_DELAY;
        this.nextPage = 'Next >';
        this.categories = categories;
        this.settingsCategories = settingsCategories;
        this.usdRate = usdRate;
        this.startYear = null;
    }

    async getScrapedVehicles() {
        Logger().info('ListAmScraper:getScrapedVehicles:START');

        const list = [];

        // getting all cars by models
        // list.am models started from id =1 to id=81
        for (const model of this.categories) {
            this.startYear = await this.getStartYear(this.settingsCategories, model);

            const data = await this._getCarsByModel(model);
            list.push(...data);
        }

        if (!list.length) {
            Logger().error('ListAmScraper:getScrapedVehicles:FAILED');

            throw new Error('ListAm scraping failed');
        }

        Logger().info('ListAmScraper:getScrapedVehicles:SUCCESS');

        return list;
    }

    async _getCarsByModel(model) {
        const data = [];
        let page = 1;

        for (let i = 0; i < page; i++) {
            try {
                // getting page DOM, scrapped by model
                const $ = await this._loadPageByModel(page, 1, model);

                const { properties, nextPage } = await this._getCarsSinglePageProperties($);

                if (nextPage) {
                    page++;
                }

                // cars that we already have in db
                const existingCars = await this.getExistingCars(properties);

                const filteredCarProperties = _.filter(properties, (o) => {
                    return !_.find(existingCars, _ => _.publishedId === o.id);
                });

                const carsHtmlPages = await this._getCarsSingleHtmlPage(filteredCarProperties);
                const carsList = this._getCarsList(carsHtmlPages);
                // we need to get phone numbers by per page for performance optimization
                const carsListWithPhoneNumber = await Promise.all(carsList.map(async v => {
                    return {
                        ...v,
                        publisherPhoneNumber: await v.publisherPhoneNumber,
                    };
                }));

                data.push(...carsListWithPhoneNumber);
                data.push(...existingCars);

                // we need to "sleep" to avoid blocking
                await this.sleep(this.delay);
            } catch (e) {
                Logger().error({ message: 'ListAmScraper:getCarsByModel:FAILED', failed_model: model, ERROR: e.message });
                continue;
            }
        }

        return data;
    }

    async _loadPageByModel(page = 1, type = 1, model) {
        try {
            const data = await this._getCarsHtmlPage(page, type, model);

            // load page DOM
            return cheerio.load(data);
        } catch (e) {
            Logger().error({ message: 'ListAmScraper:loadPageByModel:FAILED', ERROR: e.message });
        }
    }

    async _getCarsHtmlPage(page = 1, type = 1, model = '') {
        try {
            this._setAxiosHeader();
            const query = [
                `type=${type}`,
                `bid=${model}`,
                `_a2_1=${this.startYear}`,
                `price1=${PRICE_RANGE.FROM}`,
                `price2=${PRICE_RANGE.TO}`,
                `crc=1`,
                `_a17=${LIST_AM.CLEARED_CUSTOMS}`
            ];

            const url = `${this.url}/en/${this.carCategory}${page}?${query.join('&')}`;
            const response = await axios.get(url);

            return response.data;
        } catch (e) {
            Logger().error({ message: 'ListAmScraper:getCarsHtmlPage:FAILED', ERROR: e.message });
        }
    }

    async _getCarsSinglePageProperties($el) {
        try {
            // remove all top vehicles (don't need it)
            // and remove all adds
            $el('#star').remove();
            $el('#tp').remove();

            // getting all vehicles 'a' tags in 1 page
            const arr = $el('.gl').eq(0).children('a');

            const properties = _.reduce(arr, (result, value, key) => {
                const url = arr.eq(key).attr('href');

                result.push({
                    url,
                    id: this._getIdFromUrl(url),
                    price: this._getPriceFromList(arr.eq(key)),
                    released: this._getReleasedFromList(arr.eq(key)),
                });

                return result;
            }, []);

            return {
                properties,
                nextPage: this._checkNexPage($el),
            };
        } catch (e) {
            Logger().error({ message: 'ListAmScraper:getCarsSinglePageProperties:FAILED', ERROR: e.message });
        }
    }

    async _getCarsSingleHtmlPage(carProperties) {
        try {
            const responses = await Promise.all(carProperties.map(o => this._getPage(o.url)));

            // remove failed requests
            return _.filter(responses, (o) => !o.error).map(_ => _.data);
        } catch (e) {
            Logger().error({ message: 'ListAmScraper:getCarsSingleHtmlPage:FAILED', ERROR: e.message });
        }
    }

    async _getPage(id) {
        const url = `${this.url}${id}`;

        try {
            const response = await axios.get(url);

            return {
                data: response.data,
                error: false,
            };
        } catch (e) {
            Logger().error({ message: 'ListAmScraper:getPage:FAILED', url });

            return {
                data: null,
                error: true,
            };
        }
    }

    _checkNexPage($el) {
        try {
            let nextPage = false;

            $el('.dlf').eq(0).children('span').remove();

            const text = $el('.dlf').eq(0).children('a').text();

            // check the next page exist
            if (text && text.includes(this.nextPage)) {
                nextPage = true;
            }

            return nextPage;
        } catch (e) {
            Logger().error({ message: 'ListAmScraper:checkNexPage:FAILED', ERROR: e.message });
        }
    }

    _getPrice($el) {
        return +$el('.price').text().replace(/[֏$,]/g, '').trim();
    }

    _getPriceFromList($el) {
        return +$el.children('.p').text().replace(/[֏$,]/g, '').trim();
    }

    _getReleasedFromList($el) {
        // 259,000 km, 1997 y, Gasoline
        // getting second split element
        return +$el.children('.at').text().trim().split(',')[1].substring(0, 5);
    }

    _getCurrency($el) {
        // getting currency from DOM element id "pricedown", e.g. 5000$
        return $el('.price').text().includes('$') ? USD : AMD;
    }

    _getDates($el) {
        try {
            const dateText = 'Date:';
            const referenceText = 'Ad reference:';

            const dates = {
                created: null,
                url: null,
                id: null,
            };

            // the footer child "span" elements contain statement Created Date and statement ID
            const items = $el('.footer').children('span');

            for (let i = 0; i < items.length; i++) {
                const item = items.eq(i);

                // getting creation date
                // e.g. <span>Date: 19.06.2020</span>
                if (item.text().includes(dateText)) {
                    const date = item.text().replace(dateText, '').trim();

                    dates.created = moment(date, LIST_AM.DATE_FORMAT).format(SCRAPER_DATE_FORMAT);

                    continue;
                }

                // getting id and making statement url
                // e.g. <span>Ad reference: 14225781</span>
                // url example https://www.list.am/item/14225781
                if (item.text().includes(referenceText)) {
                    // Ad reference: 11942887
                    const id = +item.text().replace(referenceText, '').trim();

                    dates.url = `${this.url}/en/item/${id}`;
                    dates.id = id;

                    continue;
                }
            }

            return dates;
        } catch (e) {
            Logger().error({ message: 'ListAmScraper:getDates:FAILED', ERROR: e.message });
        }
    }

    _getCarsList(carsHtmlPages) {
        try {
            // getting car properties from each statement page
            const properties = [];

            for (const carHTMLData of carsHtmlPages) {
                const carInfo = this._getCarProperties(carHTMLData);

                // check if the statement creation date and the car price are in their ranges
                if (carInfo.released && this.inDateRange(carInfo.publishedDate) && this.inPriceRange(carInfo.price, carInfo.currency, this.usdRate)) {
                    properties.push(carInfo);
                }
            }

            return properties;
        } catch (e) {
            Logger().error({ message: 'ListAmScraper:getCarsList:FAILED', ERROR: e.message });
        }
    }

    _getCarProperties(carHTMLData) {
        try {
            // make DOM for request data
            const $ = cheerio.load(carHTMLData);

            // the "attr" div child "div" elements contain car mark car model and car released year
            const propertyList = $('#attr').children('.c');

            const properties = {};

            const carInfo = {
                make: null,
                model: null,
                year: null,
            };

            for (let i = 0; i < propertyList.length; i++) {
                const item = propertyList.eq(i);

                // e.g. make, model, year
                const propertyKey = item.children('.t').text().trim().toLowerCase();

                // getting car mark, model, year from div class i
                // e.g. <div class="i">Mercedes</div> - car mark
                // e.g. <div class="i">E</div> - car model
                // e.g. <div class="i">2020</div> - car released date
                const propertyValue = item.children('.i').text().trim().toUpperCase();

                carInfo[propertyKey] = propertyValue;

                if (propertyKey === 'make') {
                    if (MARKS.MERCEDES.MARKS.includes(propertyValue)) {
                        // We always using 'MERCEDES-BENZ' mark name for the all Mercedes Models
                        carInfo.make = MARKS.MERCEDES.MARKS[0];
                    }
                }

                if (propertyKey === 'model') {
                    // in this case Niva can be "2121 Niva", "3131 Niva" and so on, we are getting only "Niva" name
                    if (propertyValue.split(' ').includes(MARKS.NIVA)) {
                        carInfo.model = MARKS.NIVA;
                    }

                    // in the case of the 'MERCEDES-BENZ' marks, as model names we are getting 'C-CLASS', 'E-CLASS', 'G-CLASS'
                    // so we are splitting it and getting only first element 'C-CLASS' => 'C', 'E-CLASS' => 'E'
                    const splitedPropertyValue = propertyValue.split('-');

                    if (MARKS.MERCEDES.MODELS.includes(splitedPropertyValue[0]) && splitedPropertyValue[1] === 'CLASS') {
                        carInfo.model = splitedPropertyValue[0];
                    }
                }

                // if we have car mark, model and year
                if (carInfo.make && carInfo.model && carInfo.year) {
                    break;
                }
            }

            properties.mark = carInfo.make;
            properties.model = carInfo.model;
            properties.released = +carInfo.year;
            properties.price = this._getPrice($);
            properties.currency = this._getCurrency($);

            const { created, url, id } = this._getDates($);

            properties.publisherPhoneNumber = this._getPublisherPhoneNumber(id);
            properties.publishedDate = created;
            properties.publishedId = id;
            properties.url = url;

            return properties;
        } catch (e) {
            Logger().error({ message: 'ListAmScraper:getCarProperties:FAILED', ERROR: e.message });
        }
    }

    async _getPublisherPhoneNumber(publisherId) {
        const response = await axios.get(`${this.url}/?w=12&&i=${publisherId}`);

        const $ = cheerio.load(response.data);
        // e.g tel:093641777, viber://chat?number=+37496692977
        const phoneNumber = $('#callPhoneInfo').find('.phones').children('a').attr('href');

        // We need to modify the string e.g tel:093641777 => +37493641777
        if (phoneNumber) {
            return PHONE_NUMBER_CODE + phoneNumber.slice(-8);
        }

        return null;
    }

    _getIdFromUrl(url) {
        // url - https://www.list.am/item/13334699
        // getting last splited element
        return +url.split('/').pop();
    }

    _setAxiosHeader() {
        Object.assign(axios.defaults, {
            headers: {
                'user-agent': USER_AGENT,
            },
        });
    }
}
