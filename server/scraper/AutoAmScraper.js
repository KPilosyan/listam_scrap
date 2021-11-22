import cheerio from 'cheerio';
import phantom from 'phantom';
import moment from 'moment';
import axios from 'axios';
import _ from 'lodash';
import BaseScraper from './BaseScraper';
import axiosInstance from '../modules/axios';
import Logger from '../modules/Logger';
import {
    AUTO_AM,
    SCRAPER_DATE_FORMAT,
    MARKS,
    END_YEAR,
    PRICE_RANGE,
    USER_AGENT,
    AUTO_AM_SESSION,
    REQUEST_CANCELLATION_TIMEOUT,
} from '../constants';

export default class AutoAmScraper extends BaseScraper {
    constructor (categories, settingsCategories, usdRate) {
        super();
        this.instance = null;
        this.page = null;
        this.url = AUTO_AM.URL;
        this.delay = AUTO_AM.PER_PAGE_DELAY;
        this.nextPageCoordinates = null;
        this.autosessCookie = null;
        this.categories = categories;
        this.settingsCategories = settingsCategories;
        this.startYear = null;
        this.usdRate = usdRate;
    }

    async getScrapedVehicles () {
        Logger().info('AutoAmScraper:getScrapedVehicles:START');

        const list = [];

        // pahtom init and create page
        this.page = await this._initPage();

        await this._loadPage();

        await this._setAxiosHeaders();

        // getting all cars by mark
        for (const mark of this.categories) {
            this.startYear = await this.getStartYear(this.settingsCategories, mark);

            const data = await this._getCarsByMark(mark);
            list.push(...data);
        }

        if (!list.length) {
            Logger().error('AutoAmScraper:getScrapedVehicles:FAILED');

            throw new Error('AutoAm scraping failed');
        }

        Logger().info('AutoAmScraper:getScrapedVehicles:SUCCESS');

        this.instance.exit();

        return list;
    }

    async _getCarsByMark(mark) {
        const data = [];
        let page = 1;

        for (let i = 0; i < page; i++) {
            try {
                // getting page DOM, scrapped by model
                const { properties, nextPage } = await this._getCarsSinglePageProperties(page, mark);

                if (!nextPage) {
                    break;
                }

                // cars that we already have in db
                const existingCars = await this.getExistingCars(properties);
                const filteredCarsProperties = _.filter(properties, (o) => {
                    return !_.find(existingCars, _ => _.publishedId === o.id);
                });

                const carsHtmlPages = await this._getCarsSingeHtmlPage(filteredCarsProperties);

                data.push(...this._getCarsList(carsHtmlPages));
                data.push(...existingCars);

                page++;
                await this.sleep(this.delay);
            } catch (e) {
                Logger().error({ message: 'AutoAmScraper:getCarsByModel:FAILED', failed_mark: mark, ERROR: e.message });
                continue;
            }
        }

        return data;
    }

    async _loadPage () {
        try {
            await this.page.open(this.url);
            await this.sleep(2500);
        } catch (e) {
            Logger().error({ message: 'AutoAmScraper:loadPage:FAILED', ERROR: e.message });
        }
    }

    _getSearchQuery (page, mark) {
        // auto.am vehicle query
        const query = {
            category: '1',
            page: `${page + 1}`,
            sort: 'latest',
            layout: 'list',
            user: {
                dealer: '0',
                id: '',
            },
            year: {
                gt: this.startYear,
                lt: END_YEAR,
            },
            usdprice: {
                gt: PRICE_RANGE.FROM,
                lt: PRICE_RANGE.TO,
            },
            mileage: {
                gt: '10',
                lt: '1000000',
            },
            make: [mark],
        };

        return JSON.stringify(query);
    }

    async _initPage () {
        try {
            // setup browser
            this.instance = await phantom.create(['--ignore-ssl-errors=yes', '--load-images=no'], {
                logLevel: 'error',
            });

            const page = await this.instance.createPage();

            page.property('viewportSize', {
                width: 1920,
                height: 1080,
            });

            page.on('onResourceReceived', (response) => {
                if (this.autosessCookie) {
                    return;
                }

                const { url, headers } = response;

                // getting cookies from page
                if (url === 'https://auto.am/search') {
                    const cookies = _.find(headers, (o) => {
                        return o.name = 'Set-Cookie' && o.value.includes(`${AUTO_AM_SESSION}=`);
                    });

                    const autosess = cookies.value.split(`${AUTO_AM_SESSION}=`);

                    this.autosessCookie = autosess[1].split(';')[0];
                }
            });

            return page;
        } catch (e) {
            Logger().error({ message: 'AutoAmScraper:initPage:FAILED', ERROR: e.message });
        }
    }

    async _getCarsSingeHtmlPage (carsProperties) {
        try {
            const responses = await Promise.all(carsProperties.map(o => this._getPage(o.id)));

            // remove failed requests and return response data
            return _.filter(responses, (o) => !o.error).map(_ => _.data);
        } catch (e) {
            Logger().error({ message: 'AutoAmScraper:getCarsSingeHtmlPage:FAILED', ERROR: e.message });
        }
    }

    async _getPage(id) {
        const url = `${this.url}offer/${id}`;
        const source = axios.CancelToken.source();

        // we need add some logic for handling some unexpected/freeze api responses and cancel/skip that request
        let cancellationTimeout = setTimeout(() => {
            source.cancel('Request canceled for some unhandled reason');
        }, REQUEST_CANCELLATION_TIMEOUT);

        try {
            const response = await axiosInstance.get(url, { cancelToken: source.token });
            clearTimeout(cancellationTimeout);

            return {
                data: response.data,
                error: false,
            };
        } catch (e) {
            clearTimeout(cancellationTimeout);
            const error = e.message;

            Logger().error({ message: 'AutoAmScraper:getPage:FAILED', url, error });

            return {
                data: null,
                error: true,
            };
        }
    }

    _getCarsList (responsesData) {
        try {
            // getting car properties from each statement page
            const properties = [];

            for (const carHTMLData of responsesData) {
                // getting car properties from html data
                const carInfo = this._getCarProperties(carHTMLData);

                // check if the statement creation date and the car price are in their ranges
                if (carInfo.released && this.inDateRange(carInfo.publishedDate) && this.inPriceRange(carInfo.price, carInfo.currency, this.usdRate)) {
                    properties.push(carInfo);
                }
            }

            return properties;
        } catch (e) {
            Logger().error({ message: 'AutoAmScraper:getCarsList:FAILED', ERROR: e.message });
        }
    }

    _getCarProperties (carHTMLData) {
        try {
            // load page DOM
            const $ = cheerio.load(carHTMLData);

            const yearIndex = 1;

            // the "H1" div's child "a" element containa car mark car model and car released year
            const propertyList = $('h1').children('a');

            const { mark, model } = this._getMarkAndModel(propertyList);

            return {
                model,
                mark,
                released: propertyList.eq(yearIndex).text().trim(),
                price: this._getPrice($),
                currency: this._getCurrency($),
                publishedDate: this._getDates($),
                publisherPhoneNumber: this._getPublisherPhoneNumber($),
                publishedId: this._getId($),
                url: this._getUrl($),
            };
        } catch (e) {
            Logger().error({ message: 'AutoAmScraper:getCarProperties:FAILED', ERROR: e.message });
        }
    }

    _getMarkAndModel($el) {
        try {
            const modelIndex = 3;
            const markIndex = 2;

            let mark = $el.eq(markIndex).text().trim().toUpperCase();
            let model = $el.eq(modelIndex).text().trim().toUpperCase();

            if (mark === MARKS.BMW) {
                // getting first character of a string
                // model ex.1 "730", "740", "760" (we need only model series -> 7)
                // model ex.2 "i8", "i3", "z3", "K 1600 GT"
                // if the first elelement of a model is not a number we save all model string
                // otherwise we get only first character of a model (this is will be vehicle series)
                const modelType = model.slice(0, 1);

                if (!isNaN(modelType)) {
                    model = modelType;
                }
            }

            if (
                mark === MARKS.TOYOTA &&
                model.includes('LAND CRUISER') &&
                model !== 'LAND CRUISER PRADO'
            ) {
                // gruopping "LAND CRUISER" models without "LAND CRUISER PRADO"
                // models examples "LAND CRUISER PRADO", "LAND CRUISER 100", "LAND CRUISER 200"
                model = 'LAND CRUISER 100/200';
            }

            if (mark === MARKS.LEXUS) {
                // models examples
                // "ES 500", "ES 200", "GS 450 turbo", "RX 450"
                // we need oonly model name without type e.g "ES", "RX", "GS"
                // getting only 2 characters of a model string
                model = model.slice(0, 2);
            }

            if (MARKS.MERCEDES.MARKS.includes(mark)) {
                // We always using 'MERCEDES-BENZ' mark name for the all Mercedes Models
                mark = MARKS.MERCEDES.MARKS[0];

                // models examples
                // "A 200", "A 210", "B 150", "B 250", "C 200", "C 240", "CE 200", "CE 320"
                // we need only model name without type e.g "A", "B", "C", "CE", "G"
                // getting first splited element
                model = model.split(' ')[0];
            }

            if (model.split(' ').includes(MARKS.PRIORA)) {
                model = MARKS.PRIORA;
            }

            if (model.split(' ').includes(MARKS.NIVA)) {
                model = MARKS.NIVA;
            }

            return {
                mark,
                model,
            };
        } catch (e) {
            Logger().error({ message: 'AutoAmScraper:getMarkAndModel:FAILED', ERROR: e.message });
        }
    }

    _getPrice ($el) {
        return +$el('#pricedown').children('.bold').text().replace(/[֏$, ]/g, '');
    }

    _getPriceFromList ($el) {
        return +$el.children('.card-action').eq(0)
            .children('.price').eq(0)
            .children('span')
            .text()
            .replace(/[֏$, ]/g, '');
    }

    _getCurrency ($el) {
        return $el('#pricedown').children('.bold').text().includes(this.dram) ? 'AMD' : 'USD';
    }

    _getDates ($el) {
        const date = $el('.left .grey-text').text();

        return moment(date, AUTO_AM.DATE_FORMAT).format(SCRAPER_DATE_FORMAT);
    }

    _getPublisherPhoneNumber ($el) {
        // e.g tel:+093 64 17 77
        const phoneNumber = $el('#call-seller-form .contact-start div').children('a').attr('href');

        // We need to modify the string e.g tel:+093 64 17 77 => +093641777
        if (phoneNumber) {
            return phoneNumber.replace(/[^+0-9]/g, '');
        }

        return null;
    }

    _getUrl ($el) {
        const id = this._getId($el);

        return `${this.url}offer/${id}`;
    }

    _getId($el) {
        const IdText = 'ID:';
        const id = $el('.tabs a[href=#tab1]').text().replace(IdText, '').trim();

        return id;
    }

    async _getCarsSinglePageProperties (page, mark) {
        try {
            const response = await axiosInstance.post(
                this.url + 'search',
                { search: this._getSearchQuery(page, mark) }
            );

            // load the page DOM
            const $el = cheerio.load(response.data.split('-spliter-')[1]);

            const vehicles = $el('.card');

            if (!vehicles.length) {
                return {
                    properties: [],
                    nextPage: false,
                };
            }

            const properties = _.reduce(vehicles, (result, value, key) => {
                const id = +vehicles.eq(key).attr('id').replace('ad-', '');
                const released = +vehicles
                    .eq(key)
                    .children('.card-content')
                    .eq(0)
                    .children('a')
                    .children('div')
                    .children('.card-title')
                    .eq(0)
                    .children('.grey-text')
                    .text()
                    .trim();

                result.push({
                    id,
                    price: this._getPriceFromList(vehicles.eq(key)),
                    released,
                });

                return result;
            }, []);

            return {
                properties,
                nextPage: true,
            };
        } catch (e) {
            Logger().error({ message: 'AutoAmScraper:getCarsSinglePageProperties:FAILED', ERROR: e.message });
        }
    }

    async _setAxiosHeaders () {
        try {
            Logger().info('AutoAmScraper:setAxiosHeaders:START');

            const token = await this._getCSRFToken();
            Object.assign(axiosInstance.defaults, {
                headers: {
                    'X-CSRF-Token': token,
                    cookie: `${AUTO_AM_SESSION}=${this.autosessCookie}`,
                    'user-agent': USER_AGENT,
                },
            });

            Logger().info('AutoAmScraper:setAxiosHeaders:SUCCESS');
        } catch (e) {
            Logger().error({ message: 'AutoAmScraper:setAxiosHeaders:FAILED', ERROR: e.message });
        }
    }

    async _getCSRFToken() {
        try {
            Logger().info('AutoAmScraper:getCSRFToken:START');

            const token = await this.page.evaluate(function () {
                return document.querySelector('meta[name="csrf-token"]').content;
            });

            Logger().info({ message: 'AutoAmScraper:getCSRFToken:SUCCESS', token });

            return token;
        } catch (e) {
            Logger().error({ message: 'AutoAmScraper:getCSRFToken:FAILED', ERROR: e.message });
        }
    }

    async _reloadPage() {
        this.instance.exit();

        this.page = await this._initPage();

        await this._loadPage();

        await this._setAxiosHeaders();
    }
}
