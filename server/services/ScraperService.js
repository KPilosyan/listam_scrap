import DBService from './DBService';
import DBServiceVehicleSettings from './DBServiceVehicleSettings';
import AutoAmScraper from '../scraper/AutoAmScraper';
import RealEstateScraper from '../scraper/RealEstateScraper';
import ScrapVehiclesJob from '../jobs/ScrapVehiclesJob';
import GroupVehiclesJob from '../jobs/GroupVehiclesJob';
import EstimateVehiclesJob from '../jobs/EstimateVehiclesJob';
import Logger from '../modules/Logger';
import { isArraysEqual, isSourceAutoAm } from '../modules/helpers';

export default class ScraperService {
    constructor(source) {
        this.source = source;
        this.dbService = new DBService();
        this.dbServiceVehicleSettings = new DBServiceVehicleSettings();
        this.vehicleSettings = [];
    }

    async start(uuid, usdRate, settingsFormData) {
        Logger().info({ message: '------------ScraperService:start:START---------------', uuid, source: this.source, usdRate });

        await this.createVehicleSettings(settingsFormData);

        const { id } = await this.dbService.createScrappingHistory(uuid, usdRate, this.source);

        const sourceCategories = await this.dbService.getVehicleCategories(this.source);

        const settingsCategories = await this.dbServiceVehicleSettings.getVehicleSettingsCategoriesBySource(this.source);

        const scraper = isSourceAutoAm(this.source)
            ? new AutoAmScraper(sourceCategories, settingsCategories, usdRate)
            : new RealEstateScraper();

        const scrapVehiclesJob = new ScrapVehiclesJob(scraper, id);
        const groupVehiclesJob = new GroupVehiclesJob(id, usdRate, this.vehicleSettings);
        const estimateVehiclesJob = new EstimateVehiclesJob(id);

        scrapVehiclesJob
            .dispatch()
            .completed(async (job, list) => {
                const { scrappingHistoryId } = job.data;

                await this.dbService.saveVehicles(list, scrappingHistoryId);

                Logger().info({ message: 'ScraperService:scrapVehiclesJob:SUCCESS', scrapped_vehicles_count: list.length });

                groupVehiclesJob.dispatch(list);
            })
            .failed(async (job, err) => {
                Logger().error({ message: 'ScraperService:scrapVehiclesJob:FAILED', ERROR: err.message });

                const { scrappingHistoryId } = job.data;

                await this.dbService.setScrappingFailed(scrappingHistoryId);
            });

        groupVehiclesJob
            .completed((job, grouped) => {
                Logger().info({ message: 'ScraperService:groupVehiclesJob:SUCCESS', grouped_vehicles_count: grouped.length });

                estimateVehiclesJob.dispatch(grouped, this.source);
            })
            .failed(async (job, err) => {
                Logger().error({ message: 'ScraperService:groupVehiclesJob:FAILED', ERROR: err.message });

                const { scrappingHistoryId } = job.data;

                await this.dbService.setScrappingFailed(scrappingHistoryId);
            });

        estimateVehiclesJob
            .completed(async (job, estimated) => {
                Logger().info({ message: 'ScraperService:estimateVehiclesJob:SUCCESS', estimated_vehicles_count: estimated.length });

                const { scrappingHistoryId } = job.data;

                await this.dbService.saveGroupedVehicles(estimated, scrappingHistoryId);
                await this.dbService.setSeriesCodes(scrappingHistoryId);
                await this.dbService.setScrapingFinished(scrappingHistoryId);

                Logger().info('------------ScraperService:start:SUCCESS---------------');
            })
            .failed(async (job, err) => {
                Logger().error({ message: 'ScraperService:estimateVehiclesJob:FAILED', ERROR: err.message });

                const { scrappingHistoryId } = job.data;

                await this.dbService.setScrappingFailed(scrappingHistoryId);
            });
    }

    async createVehicleSettings(settingsFormData) {
        this.vehicleSettings = await this.dbServiceVehicleSettings.getVehicleSettings();

        if (!settingsFormData.length || this.isExistsVehicleSettings(settingsFormData, this.vehicleSettings)) {
            Logger().info('ScraperService:createVehicleSettings:SKIPPED');
            return;
        }

        await this.dbServiceVehicleSettings.createVehicleSettings(settingsFormData);
    }

    isExistsVehicleSettings(settingsFormData, existingVehicleSettings) {
        // we must change structure because from DB we are don't getting wrong structured data for correctly comparing
        const modifiedVehicleSettings = existingVehicleSettings.map((el) => {
            return {
                mark: el.mark,
                model: el.model,
                seriesCode: el.seriesCode,
                startYear: el.startYear,
            };
        });

        if (settingsFormData.length !== modifiedVehicleSettings.length) {
            return false;
        }

        return isArraysEqual(
            settingsFormData,
            modifiedVehicleSettings
        );
    }
}
