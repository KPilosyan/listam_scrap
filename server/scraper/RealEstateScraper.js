import cheerio from 'cheerio';
import moment from 'moment';
import BaseScraper from './BaseScraper';
import axios from '../modules/axios';
import _ from 'lodash';
import Logger from '../modules/Logger';
import {
    AMD,
    LIST_AM,
    PHONE_NUMBER_CODE,
    SCRAPER_DATE_FORMAT,
    USD,
    USER_AGENT,
} from '../constants';
const XLSX = require('xlsx');

export default class RealEstateScraper extends BaseScraper {
    constructor() {
        super();
        this.url = LIST_AM.URL;
        this.realEstateCategory = LIST_AM.REALESTATE_CATEGORY;
        this.delay = LIST_AM.PER_PAGE_DELAY;
    }

    async scrapRealEstates() {
        Logger().info('RealEstateScraper:scrapRealEstates:START');
        try {
            let pageNumber = 1;
            let scrappedRealEstates = [];

            for (let i = 1; i <= pageNumber; i++) {
                const $ = await this._loadPage(pageNumber);

                // remove all top real estates (don't need it)
                // and remove all adds, in every page
                $('#star').remove();
                $('#tp').remove();

                if (this._checkNextPage($)) {
                    pageNumber++;
                }

                const perPageRealEstatesData = await this._getPerPageRealEstatesList($);
                const data = await Promise.all(perPageRealEstatesData.map(async v => {
                    return { ...v };
                }));
                scrappedRealEstates.push(...data);

                // we need to "sleep" to avoid blocking
                await this.sleep(this.delay);
            }

            if (!scrappedRealEstates) {
                Logger().error('RealEstateScraper:scrapRealEstates:FAILED');

                throw new Error('ListAm scraping failed');
            }

            this.convertJsonToExcel(scrappedRealEstates);

            Logger().info('RealEstateScraper:scrapRealEstates:SUCCESS');

            return scrappedRealEstates;
        } catch (e) {
            Logger().error({ message: 'RealEstateScraper:scrapRealEstates:FAILED', ERROR: e.message });
        }
    }

    async convertJsonToExcel(data) {
        try {
            const scrapedRealEstate = 'scrapedRealEstate.xlsx';

            const workBook = XLSX.utils.book_new();
            const workSheet = XLSX.utils.json_to_sheet(data);
            XLSX.utils.book_append_sheet(workBook, workSheet, 'RealEstates');
            XLSX.writeFile(workBook, scrapedRealEstate);
        } catch (e) {
            Logger().error({ message: 'RealEstateScraper:convertJsonToExcel:FAILED', ERROR: e.message });
        }
    }

    async _getPerPageRealEstatesList($el) {
        try {
            let data = [];
            let urls = [];
            let aTags = $el('.dl').children('a');

            // pages with 1 column listing are <dl><gl> 'a' tags </gl></dl>
            // pages with 3 column listings are <gl> 'a' tags </gl>
            // if 'dl' tag has 'gl' tag before 'a' tags
            if (aTags.length === 0) {
                aTags = $el('.gl').children('a');
            }

            let currentPageRSCount = aTags.length;

            for (let i = 0; i < currentPageRSCount; i++) {
                urls.push(await this._getUrlsById(aTags, i));
            }
            const singleRSHtmls = await this._getSingleRSHtmlPage(urls);
            const allRSProperties = await Promise.all(singleRSHtmls.map(async rsHtml => this._getRealEstateProperties(rsHtml)));
            // We don't need the ads of type 'wanted'
            const filteredAllRSProperties = allRSProperties.filter(rsProperties => !rsProperties.hasOwnProperty('wanted'));

            data.push(filteredAllRSProperties);
            // data is list of list of objects. We need list of objects
            return data[0];
        } catch (e) {
            Logger().error({ message: 'RealEstateScraper:getPerPageRealEstatesList:FAILED', ERROR: e.message });
        }
    }

    async _getUrlsById(aTags, rsId) {
        const url = aTags.eq(rsId).attr('href');
        return `${this.url}${url}`;
    }

    async _loadPage(page) {
        try {
            const data = await this._getRealEstatesHtmlPage(page);

            // load page DOM
            return cheerio.load(data);
        } catch (e) {
            Logger().error({ message: 'RealEstateScraper:_loadPage:FAILED', ERROR: e.message });
        }
    }

    async _getRealEstatesHtmlPage(page) {
        try {
            this._setAxiosHeader();

            const url = `${this.url}/en/${this.realEstateCategory}${page}`;
            const response = await axios.get(url);

            return response.data;
        } catch (e) {
            Logger().error({ message: 'RealEstateScraper:_getRealEstatesHtmlPage:FAILED', ERROR: e.message });
        }
    }

    async _getSingleRSHtmlPage(urls) {
        try {
            const responses = await Promise.all(urls.map(url => this._getPageData(url)));

            return _.filter(responses, (o) => !o.error).map(_ => _.data);
        } catch (e) {
            Logger().error({ message: 'RealEstateScraper:_getSingleRSHtmlPage:FAILED', ERROR: e.message });
        }
    }

    async _getPageData(url) {
        try {
            const response = await axios.get(url);

            return {
                data: response.data,
                error: false,
            };
        } catch (e) {
            Logger().error({ message: 'RealEstateScraper:_getPageData:FAILED', url });

            return {
                data: null,
                error: true,
            };
        }
    }

    _checkNextPage($el) {
        try {
            let text = $el('.dlf').children('.pp').next().text();
            // check the next page exist
            if (text && text === 'Next >') {
                this.nextPage = true;
            } else {
                this.nextPage = false;
            }

            return this.nextPage;
        } catch (e) {
            Logger().error({ message: 'RealEstateScraper:checkNextPage:FAILED', ERROR: e.message });
        }
    }

    _getTitle($el) {
        return $el('.vih').children('h1').text();
    }

    _getPrice($el) {
        let paymentFrequency = null;
        let priceText = $el('.price').text().replace(/[֏$,]|monthly|daily/g, '').trim();
        if ($el('.price').text().toLowerCase().includes('monthly')) {
            paymentFrequency = 'monthly';
        }
        if ($el('.price').text().toLowerCase().includes('daily')) {
            paymentFrequency = 'daily';
        }
        if (priceText) {
            return { priceText, paymentFrequency };
        }
    }

    _getAdditionalInfo($el) {
        try {
            const additionalInfo = {};
            const additionalInfoTags = $el('.vih').find('span');
            let i = 0;
            // if price is provided, additional info is 2nd span tag
            if (this._getPrice($el)) {
                i = 1;
            }
            for (i; i < additionalInfoTags.length; i++) {
                let additionalInfoName = additionalInfoTags.eq(i).text().toLowerCase();

                if (additionalInfoName.substring(0, 4) === 'code') {
                    let additionalInfoKey = 'code';
                    const additionalInfoValue = additionalInfoName.substring(5, additionalInfoName.length);
                    additionalInfo[additionalInfoKey] = additionalInfoValue;
                } else {
                    additionalInfo[additionalInfoName] = true;
                }
            }

            return additionalInfo;
        } catch (e) {
            Logger().error({ message: 'RealEstateScraper:getRealEstatesSinglePageProperties:FAILED', ERROR: e.message });
        }
    }

    _getLocation($el) {
        return $el('.loc').text();
    }

    _getDescription($el) {
        return $el("*[itemprop = 'description']").text();
    }

    _getPriceFromList($el) {
        return +$el.children('.p').text().replace(/[֏$,]/g, '').trim();
    }

    _getCurrency($el) {
        // getting currency from DOM element id "pricedown", e.g. 5000$
        return $el('.price').text().includes('$') ? USD : AMD;
    }

    _getAttributes($el) {
        const propertyList = $el('#attr').children('.c');
        const ApartmentInfo = {};

        for (let i = 0; i < propertyList.length; i++) {
            const item = propertyList.eq(i);

            const propertyKey = item.children('.t').text().trim().toLowerCase();
            const propertyValue = item.children('.i').text().trim().toUpperCase();

            ApartmentInfo[propertyKey] = propertyValue;
        }
        return ApartmentInfo;
    }

    _getFooterInfo($el) {
        try {
            const dateText = 'Date:';
            const referenceIdText = 'Ad reference:';
            const renewedText = 'Renewed:';

            const footer = {
                created: null,
                id: null,
                renewed: null,
            };

            // the footer child "span" elements contain statement Created Date and statement ID
            const items = $el('.footer').children('span');

            for (let i = 0; i < items.length; i++) {
                const item = items.eq(i);

                // getting creation date
                // e.g. <span>Date: 19.06.2020</span>
                if (item.text().includes(dateText)) {
                    const date = item.text().replace(dateText, '').trim();

                    footer.created = moment(date, LIST_AM.DATE_FORMAT).format(SCRAPER_DATE_FORMAT);

                    continue;
                }

                // getting id and making statement url
                // e.g. <span>Ad reference: 14225781</span>
                // url example https://www.list.am/item/14225781
                if (item.text().includes(referenceIdText)) {
                    // Ad reference: 11942887
                    const id = +item.text().replace(referenceIdText, '').trim();

                    footer.id = id;

                    continue;
                }

                if (item.text().includes(renewedText)) {
                    const renewedDate = item.text().substring(8, 26).trim();
                    // LL format example -> November 19, 2020
                    footer.renewed = moment(renewedDate, 'LL').format(SCRAPER_DATE_FORMAT);

                    continue;
                }
            }

            return footer;
        } catch (e) {
            Logger().error({ message: 'RealEstateScraper:getDates:FAILED', ERROR: e.message });
        }
    }

    _getAdUrl(id) {
        return `${this.url}/en/item/${id}`;
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

    async _getRealEstateProperties(realEstateHTMLData) {
        try {
            // make DOM for request data
            const $ = cheerio.load(realEstateHTMLData);

            const properties = {};
            properties.title = this._getTitle($);
            if (this._getPrice($)) {
                const { priceText, paymentFrequency } = this._getPrice($);
                properties.price = priceText;
                if (paymentFrequency) {
                    properties.paymentFrequency = paymentFrequency;
                }
            }
            properties.currency = this._getCurrency($);

            let additionalInfo = this._getAdditionalInfo($);
            Object.keys(additionalInfo).map((key) => {
                properties[key] = additionalInfo[key];
            });
            properties.location = this._getLocation($);
            properties.description = this._getDescription($);
            let attributes = this._getAttributes($);
            Object.keys(attributes).map((key) => {
                properties[key] = attributes[key];
            });
            const { created, id, renewed } = this._getFooterInfo($);
            properties.publishedId = id;
            properties.publisherPhoneNumber = await this._getPublisherPhoneNumber(id);

            properties.publishedDate = created;
            properties.renewed = renewed;

            properties.url = this._getAdUrl(id);

            return properties;
        } catch (e) {
            Logger().error({ message: 'RealEstateScraper:getRealEstateProperties:FAILED', ERROR: e.message });
        }
    }

    _setAxiosHeader() {
        Object.assign(axios.defaults, {
            headers: {
                'user-agent': USER_AGENT,
            },
        });
    }
}
