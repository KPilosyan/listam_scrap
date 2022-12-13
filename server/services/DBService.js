import { Op } from 'sequelize';
import models from '../models';
import Logger from '../modules/Logger';
import DBServiceVehicleSettings from './DBServiceVehicleSettings';
import { isSourceAutoAm } from '../modules/helpers';

export default class DBService {
    constructor() {
        this.dbServiceVehicleSettings = new DBServiceVehicleSettings();
    }

    async createScrappingHistory(uuid, usdRate, source) {
        try {
            // Logger().info('DBService:createScrappingHistory:START');
            //
            // const settingsVersion = await this.dbServiceVehicleSettings.getVehicleSettingsLatestVersionNumber();
            //
            // const response = await models.scrappingHistory.create({
            //     uuid,
            //     usdRate,
            //     source: source.toUpperCase(),
            //     status: models.scrappingHistory.PENDING,
            //     settingsVersion,
            // });
            //
            // Logger().info({ message: 'DBService:createScrappingHistory:SUCCESS'});
            //
            // return response;
            return 0;
        } catch (e) {
            Logger().error({ message: 'DBService:createScrappingHistory:FAILED', uuid, ERROR: e.message });
        }
    }

    async saveVehicles(list, id) {
        try {
            Logger().info({ message: 'DBService:saveVehicles:START', scrapping_history_id: id });

            const vehicles = this._setScrapingHistory(list, id);

            await models.vehicle.bulkCreate(vehicles);

            Logger().info('DBService:saveVehicles:SUCCESS');
        } catch (e) {
            Logger().error({ message: 'DBService:saveVehicles:FAILED', ERROR: e.message });
        }
    }

    async saveGroupedVehicles(list, id) {
        try {
            Logger().info({ message: 'DBService:saveGroupedVehicles:START', scrapping_history_id: id });

            const vehicles = this._setScrapingHistory(list, id);

            await models.vehicleModelEstimate.bulkCreate(vehicles);

            Logger().info('DBService:saveGroupedVehicles:SUCCESS');
        } catch (e) {
            Logger().error({ message: 'DBService:saveGroupedVehicles:FAILED', ERROR: e.message });
        }
    }

    async setScrapingFinished(id) {
        try {
            Logger().info({ message: 'DBService:setScrapingFinished:START', scrapping_history_id: id });

            await models.scrappingHistory.update(
                { status: models.scrappingHistory.FINISHED },
                { where: { id } }
            );

            Logger().info('DBService:setScrapingFinished:SUCCESS');
        } catch (e) {
            Logger().error({ message: 'DBService:setScrapingFinished:FAILED', ERROR: e.message });
        }
    }

    async setScrappingFailed(id) {
        try {
            Logger().info({ message: 'DBService:setScrappingFailed:START', scrapping_history_id: id });

            await models.scrappingHistory.update(
                { status: models.scrappingHistory.FAILED },
                { where: { id } }
            );

            Logger().info('DBService:setScrappingFailed:SUCCESS');
        } catch (e) {
            Logger().error({ message: 'DBService:setScrappingFailed:FAILED', ERROR: e.message });
        }
    }

    async getPreviousEstimatedVehicles(source) {
        try {
            Logger().info('DBService:getPreviousEstimatedVehicles:START');

            const scrapingHistory = await models.scrappingHistory.findOne({
                where: {
                    approved: true,
                    status: models.scrappingHistory.FINISHED,
                    source: {
                        [Op.or]: [source.toUpperCase(), null], // source = LIST.AM or AUTO.AM or null (which is first initialed scrapped data)
                    },
                },
                order: [['updatedAt', 'DESC']],
            });

            const vehicles = await scrapingHistory.getEstimatedVehicles();

            Logger().info('DBService:getPreviousEstimatedVehicles:SUCCESS');

            return vehicles;
        } catch (e) {
            Logger().error({ message: 'DBService:getPreviousEstimatedVehicles:FAILED', ERROR: e.message });
        }
    }

    async setSeriesCodes(id) {
        try {
            Logger().info({ message: 'DBService:setSeriesCodes:START', scrapping_history_id: id });

            await models.vehicleModelEstimate.updateSeriesCodes(id);

            Logger().info('DBService:setSeriesCodes:SUCCESS');
        } catch (e) {
            Logger().error({ message: 'DBService:setSeriesCodes:FAILED', ERROR: e.message });
        }
    }

    _setScrapingHistory(list, id) {
        for (const item of list) {
            item.scrappingHistoryId = id;
        }

        return list;
    }

    async getVehicleCategories(source) {
        try {
            Logger().info('DBService:getVehicleCategories:START');

            const category = isSourceAutoAm(source) ? 'autoam_category_id' : 'listam_category_id';

            const categories = await models.vehicleSeriesCode.aggregate(
                category,
                'DISTINCT',
                {
                    plain: false,
                    where: {
                        disabled: false,
                    },
                }
            );

            const filteredCategories = categories.map(_ => _.DISTINCT);

            Logger().info({ message: 'DBService:getVehicleCategories:SUCCESS', categories: filteredCategories });

            return filteredCategories;
        } catch (e) {
            Logger().error({ message: 'DBService:getVehicleCategories:FAILED', ERROR: e.message });
        }
    }

    async getVehiclesByPublishedId(ids) {
        try {
            if (!ids.length) {
                return [];
            }

            const vehicles = await models.vehicle.getVehiclesByPublishedId(ids);

            return vehicles[0];
        } catch (e) {
            Logger().error({ message: 'DBService:getVehiclesByPublishedId:FAILED', ERROR: e.message });
        }
    }
}
