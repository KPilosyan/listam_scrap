import fs from 'fs';
import parse from 'csv-parse/lib/sync';
import transform from 'stream-transform';
import { v4 as uuidv4 } from 'uuid';
import models from '../../server/models';
import { START_YEAR, YEAR_COUNT, VEHICLE_SETTINGS_INITIAL_VERSION } from '../constants';

export default {
    up: async (queryInterface, Sequelize) => {
        const USD_RATE = 500;

        const { id } = await models.scrappingHistory.create({
            uuid: uuidv4(),
            usdRate: USD_RATE,
            source: null,
            status: 'FINISHED',
            approved: true,
            settingsVersion: VEHICLE_SETTINGS_INITIAL_VERSION,
        });

        const input = fs.readFileSync('seeders/csv/vehicle_models.csv', { encoding: 'utf8' });
        const parsed = parse(input, {delimiter: ','});

        const getVehicles = new Promise((resolve, reject) => {
            const output = [];

            transform(parsed, (data) => {
                data.push(data.shift());
                return data;
            })
                .on('readable', function () {
                    let row;
                    while (row = this.read()) {
                        // Seed vehicles released from current year - 20 year
                        let i = 0;
                        while (i <= YEAR_COUNT) {
                            output.push({
                                scrapping_history_id: id,
                                series_code: row[23],
                                mark: row[0].toUpperCase(),
                                model: row[1].toUpperCase(),
                                released: START_YEAR + i,
                                accepted_price: row[2 + i],
                                old_price: row[2 + i],
                            });
                            ++i;
                        }
                    }
                })
                .on('error', (err) => {
                    reject(err);
                })
                .on('finish', () => {
                    resolve(output);
                });
        });

        const vehicles = await getVehicles;

        queryInterface.bulkInsert('vehicle_model_estimates', vehicles, {});
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('vehicle_model_estimates', null, {});
    },
};
