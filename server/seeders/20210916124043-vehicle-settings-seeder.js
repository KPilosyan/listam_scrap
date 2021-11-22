import models from '../../server/models';
import { START_YEAR_OLD_VEHICLES, VEHICLE_SETTINGS_INITIAL_VERSION } from '../constants';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await models.vehicleSettings.bulkCreate(
            [
                {
                    seriesCode: '16.03',
                    mark: 'MERCEDES-BENZ',
                    model: 'C',
                    startYear: START_YEAR_OLD_VEHICLES,
                    version: VEHICLE_SETTINGS_INITIAL_VERSION,
                },
                {
                    seriesCode: '16.08',
                    mark: 'MERCEDES-BENZ',
                    model: 'E',
                    startYear: START_YEAR_OLD_VEHICLES,
                    version: VEHICLE_SETTINGS_INITIAL_VERSION,
                },
                {
                    seriesCode: '16.09',
                    mark: 'MERCEDES-BENZ',
                    model: 'G',
                    startYear: START_YEAR_OLD_VEHICLES,
                    version: VEHICLE_SETTINGS_INITIAL_VERSION,
                },
                {
                    seriesCode: '16.16',
                    mark: 'MERCEDES-BENZ',
                    model: 'S',
                    startYear: START_YEAR_OLD_VEHICLES,
                    version: VEHICLE_SETTINGS_INITIAL_VERSION,
                },
                {
                    seriesCode: '20.01',
                    mark: 'OPEL',
                    model: 'ASTRA',
                    startYear: 1998,
                    version: VEHICLE_SETTINGS_INITIAL_VERSION,
                }
            ]);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('vehicle_settings', null, {});
    },
};
