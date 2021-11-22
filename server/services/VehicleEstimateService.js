import DBService from './DBService';
import _ from 'lodash';
import { AVERAGE_DEVIATED_PERCENT } from '../constants';
import Logger from '../modules/Logger';

export default class VehicleEstimateService {
    async estimate(list, source) {
        const previousVehicles = await new DBService().getPreviousEstimatedVehicles(source);

        return this._estimate(list, previousVehicles);
    }

    _estimate(list, previousVehicles) {
        try {
            for (const vehicle of list) {
                const prevVehicle = _.find(previousVehicles, (o) => {
                    return o.mark === vehicle.mark && o.model === vehicle.model && +o.released === +vehicle.released;
                });

                if (prevVehicle) {
                    const minAcceptedPrice = prevVehicle.acceptedPrice * (1 - AVERAGE_DEVIATED_PERCENT / 100);
                    const maxAcceptedPrice = prevVehicle.acceptedPrice * (1 + AVERAGE_DEVIATED_PERCENT / 100);
                    const prevMinAvgPrice = prevVehicle.avgPrice * (1 - AVERAGE_DEVIATED_PERCENT / 100);
                    const prevMaxAvgPrice = vehicle.avgPrice * (1 + AVERAGE_DEVIATED_PERCENT / 100);

                    vehicle.isDeviatedOldPrice = vehicle.avgPrice < minAcceptedPrice || vehicle.avgPrice > maxAcceptedPrice;

                    if (!vehicle.isDeviatedAvgPrice && !vehicle.isDeviatedOldPrice) {
                        vehicle.acceptedPrice = vehicle.avgPrice;
                    }

                    if (vehicle.isDeviatedAvgPrice && (vehicle.avgPrice >= prevMinAvgPrice && vehicle.avgPrice <= prevMaxAvgPrice)) {
                        const minAvgPrice = Math.min(prevVehicle.avgPrice, vehicle.avgPrice);

                        vehicle.acceptedPrice = minAvgPrice;
                    }

                    vehicle.oldPrice = prevVehicle.acceptedPrice;
                }
            };

            return list;
        } catch (e) {
            Logger().error({ message: 'VehicleEstimateService:estimate:FAILED', ERROR: e.message });
        }
    }
}
// const buildings = {
//     sale: {
//         'appartment': 61,
//         'house': 56
//     },
//     rent: {
//         'appartment': 62,
//         'house': 63
//     },
// }

// Object.keys(buildings).forEach(key => {

// })