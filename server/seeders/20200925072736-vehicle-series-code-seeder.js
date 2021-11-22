import fs from 'fs';
import parse from 'csv-parse/lib/sync';
import transform from 'stream-transform';

export default {
    up: async (queryInterface, Sequelize) => {
        const input = fs.readFileSync('seeders/csv/vehicle_series.csv', { encoding: 'utf8' });
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
                        const mark = row[0].toUpperCase();
                        const model = row[1].toUpperCase();
                        const isDiesel = row[2];
                        const listamCategoryId = row[3];
                        const autoamCategoryId = row[4];
                        const seriesCode = row[5];

                        output.push({
                            mark,
                            model,
                            series_code: seriesCode,
                            is_diesel: isDiesel,
                            listam_category_id: listamCategoryId,
                            autoam_category_id: autoamCategoryId,
                        });
                    }
                })
                .on('error', (err) => {
                    reject(err);
                })
                .on('finish', () => {
                    return resolve(output);
                })
        });

        const vehicles = await getVehicles;

        queryInterface.bulkInsert('vehicle_series_codes', vehicles, {});
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('vehicle_series_codes', null, {});
    }
};
