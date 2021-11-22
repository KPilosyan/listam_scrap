import _ from 'lodash';
import DBServiceVehicleSettings from './DBServiceVehicleSettings';
import {
    DEVIATED_PERCENT,
    USD,
    FILTER_RANGE,
    MARKS,
    RUSSIAN_CARS_RELEASED_YEAR,
    COUNTABLE_VEHICLES,
    START_YEAR,
} from '../constants';
import Logger from '../modules/Logger';

export default class VehicleGroupService {
    constructor(usdRate, vehicleSettings) {
        this.usdRate = usdRate;
        this.dbServiceVehicleSettings = new DBServiceVehicleSettings();
        this.vehicleSettings = vehicleSettings;
    }

    async group(list) {
        try {
            const grouped = this._groupByModel(list);

            const result = this._composeGroupedCars(grouped);

            return result;
        } catch (e) {
            Logger().error({ message: 'VehicleGroupService:group:FAILED', ERROR: e.message });
        }
    }

    _groupByModel(cars) {
        try {
            const filteredCars = _.filter(cars, o => o.price > 0);

            const grouped = _.groupBy(filteredCars, (o) => o.mark + '__' + o.model);

            return grouped;
        } catch (e) {
            Logger().error({ message: 'VehicleGroupService:groupByModel:FAILED', ERROR: e.message });
        }
    }

    _composeGroupedCars(cars) {
        try {
            return _.reduce(cars, (result, value, key) => {
                const grouppedByYear = _.groupBy(value, (o) => o.released);
                const cars = this._combineGroupedCars(grouppedByYear);

                result.push(...cars);

                return result;
            }, []);
        } catch (e) {
            Logger().error({ message: 'VehicleGroupService:composeGroupedCars:FAILED', ERROR: e.message });
        }
    }

    _combineGroupedCars (cars) {
        try {
            const data = [];

            for (const carGroup of Object.values(cars)) {
                const { mark, model, released } = carGroup[0];

                // checking if in the vehicle_settings table exists the current car
                // then we must check by founded vehicle start_year setting before grouping
                const existingVehicleSettingsCarByMarkModel = this._getExistingVehicleSettingsCarByMarkModel(mark, model);

                if ((existingVehicleSettingsCarByMarkModel && released < existingVehicleSettingsCarByMarkModel.startYear) ||
                    (!existingVehicleSettingsCarByMarkModel && released < START_YEAR)) {
                    continue;
                }

                // filtering russian cars, released year should be start from 2016y
                if (mark === MARKS.VAZ_LADA && released < RUSSIAN_CARS_RELEASED_YEAR) {
                    continue;
                }

                const carsCount = carGroup.length;
                const average = this._calculateCarsAveragePrice(carGroup);

                const filteredCars = this._filterByAveragePriceRange(carGroup, average);

                const filteredCarsCount = filteredCars.length;
                const filteredAverage = this._calculateCarsAveragePrice(filteredCars);

                data.push({
                    mark,
                    model,
                    avgPrice: filteredAverage || average,
                    isDeviatedAvgPrice: carsCount >= COUNTABLE_VEHICLES && this._calculateDeviated(carsCount, filteredCarsCount),
                    released,
                    count: carsCount,
                    deviationCount: carsCount - filteredCarsCount,
                });
            }

            return data;
        } catch (e) {
            Logger().error({ message: 'VehicleGroupService:combineGroupedCars:FAILED', ERROR: e.message });
        }
    }

    _calculateCarsAveragePrice(cars) {
        try {
            if (!cars.length) {
                return null;
            }

            const carsSum = _.sumBy(cars, (o) => {
                return this._getPriceByCurrency(o.price, o.currency);
            });

            const average = carsSum / cars.length;

            return +average.toFixed(0);
        } catch (e) {
            Logger().error({ message: 'VehicleGroupService:calculateCarsAveragePrice:FAILED', ERROR: e.message });
        }
    }

    _filterByAveragePriceRange(cars, average) {
        try {
            const minAverage = average * (1 - DEVIATED_PERCENT / 100);
            const maxAverage = average * (1 + DEVIATED_PERCENT / 100);

            const filtered = _.filter(cars, (o) => {
                const carPrice = this._getPriceByCurrency(o.price, o.currency);

                return carPrice >= minAverage && carPrice <= maxAverage;
            });

            return filtered;
        } catch (e) {
            Logger().error({ message: 'VehicleGroupService:filterByAveragePriceRange:FAILED', ERROR: e.message });
        }
    }

    _calculateDeviated(allCars, filteredCars) {
        try {
            const deviated = allCars - filteredCars;
            let isDeviated = true;

            for (const data of Object.values(FILTER_RANGE)) {
                const { count, percent } = data;

                if (allCars < count) {
                    continue;
                }

                const maxDeviated = allCars * percent / 100;
                if (deviated <= maxDeviated) {
                    isDeviated = false;
                }

                break;
            }

            return isDeviated;
        } catch (e) {
            Logger().error({ message: 'VehicleGroupService:calculateDeviated:FAILED', ERROR: e.message });
        }
    }

    _getPriceByCurrency(price, currency) {
        return currency === USD ? price * this.usdRate : price;
    }

    _getExistingVehicleSettingsCarByMarkModel(mark, model) {
        return this.vehicleSettings.find((settingsCar) => {
            return settingsCar.mark === mark && settingsCar.model === model;
        });
    }
}
