import { col, fn } from 'sequelize';
import models from '../models';
import Logger from '../modules/Logger';
import { isSourceAutoAm } from '../modules/helpers';

export default class DBServiceVehicleSettings {
    async createVehicleSettings(settingsFormData) {
        try {
            Logger().info({ message: 'DBServiceVehicleSettings:createVehicleSettings:START', settings_form_data: settingsFormData });

            let newVersionNumber = await this.getVehicleSettingsLatestVersionNumber() + 1;

            const enhancedSettingsFormData = settingsFormData.map((el) => {
                return {
                    ...el,
                    version: newVersionNumber,
                };
            });

            await models.vehicleSettings.bulkCreate(enhancedSettingsFormData);

            Logger().info({ message: 'DBServiceVehicleSettings:createVehicleSettings:SUCCESS', settings_version: newVersionNumber });
        } catch (e) {
            Logger().error('DBServiceVehicleSettings:createVehicleSettings:FAILED');
        }
    }

    async getVehicleSettingsLatestVersionNumber() {
        try {
            // Logger().info({ message: 'DBServiceVehicleSettings:getVehicleSettingsLatestVersionNumber:START' });
            //
            // const currentVersionNumber = await models.vehicleSettings.max('version');
            //
            // Logger().info({ message: 'DBServiceVehicleSettings:getVehicleSettingsLatestVersionNumber:SUCCESS', current_version_number: currentVersionNumber });
            //
            // return currentVersionNumber;
            return 0;
        } catch (e) {
            Logger().error('DBServiceVehicleSettings:getVehicleSettingsLatestVersionNumber:FAILED');
        }
    }

    async getVehicleSettings() {
        try {
            // Logger().info({ message: 'DBServiceVehicleSettings:getVehicleLatestSettings:START' });
            //
            // const settingsVersion = await this.getVehicleSettingsLatestVersionNumber();
            //
            // const vehicleSettings = await models.vehicleSettings.findAll({
            //     where: {
            //         version: settingsVersion,
            //     },
            // });
            //
            // Logger().info({ message: 'DBServiceVehicleSettings:getVehicleLatestSettings:SUCCESS' });
            //
            // return vehicleSettings;
            return {};
        } catch (e) {
            Logger().error('DBServiceVehicleSettings:getVehicleLatestSettings:FAILED');
        }
    }

    async getVehicleSettingsCategoryLowestYearByMark(mark) {
        try {
            Logger().info({ message: 'DBServiceVehicleSettings:getVehicleSettingsBySeriesCode:START' });

            const settingsVersion = await this.getVehicleSettingsLatestVersionNumber();

            // Because we are scrapping by vehicle category_id (no matter what model it is),
            // which is always equal with mark eg: 25 category id === BMW, so we can get it by Marks too
            // so we need to get lowest start year from the all same vehicleSettings table marks
            const vehicleSettingsMarks = await models.vehicleSettings.findOne({
                attributes: [[fn('min', col('start_year')), 'lowestStartYear']],
                where: {
                    version: settingsVersion,
                    mark,
                },
            });

            Logger().info({ message: 'DBServiceVehicleSettings:getVehicleSettingsBySeriesCode:SUCCESS' });

            return vehicleSettingsMarks.get('lowestStartYear');
        } catch (e) {
            Logger().error('DBServiceVehicleSettings:getVehicleSettingsBySeriesCode:FAILED');
        }
    }

    async getVehicleSettingsCategoriesBySource(source) {
        try {
            Logger().info('DBServiceVehicleSettings:getVehicleSettingsCategories:START');

            const vehicleSettings = await this.getVehicleSettings();

            const seriesCodes = [...new Set(vehicleSettings.map(item => item.seriesCode))];

            const category = isSourceAutoAm(source) ? 'autoam_category_id' : 'listam_category_id';

            const categories = await models.vehicleSeriesCode.findAll({
                attributes: ['series_code', 'mark', category],
                where: {
                    series_code: [...seriesCodes],
                },
            });

            Logger().info({ message: 'DBServiceVehicleSettings:getVehicleSettingsCategories:SUCCESS' });

            return categories.map(item => {
                return {
                    seriesCode: item.series_code,
                    mark: item.mark,
                    category_id: item[category],
                };
            });
        } catch (e) {
            Logger().error({ message: 'DBService:getVehicleCategories:FAILED', ERROR: e.message });
        }
    }
}
