import Job from './Job';
import Logger from '../modules/Logger';
const jobName = 'ScrapVehiclesJob';

export default class ScrapVehiclesJob extends Job {
    constructor(scraper, id) {
        super(jobName);
        this.scraper = scraper;
        this.scrappingHistoryId = id;
    }

    dispatch() {
        this._dispatch(
            async (job) => {
                Logger().info('ScrapVehiclesJob:dispatch:START');

                const list = await this.scraper.scrapRealEstates();

                return Promise.resolve(list);
            },
            {
                scrappingHistoryId: this.scrappingHistoryId,
            }
        );

        return this;
    }
}
