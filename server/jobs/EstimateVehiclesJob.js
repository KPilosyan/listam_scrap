import Job from './Job';
import VehicleEstimateService from '../services/VehicleEstimateService';
import Logger from '../modules/Logger';

const jobName = 'EstimateVehiclesJob';

export default class EstimateVehiclesJob extends Job {
    constructor(id) {
        super(jobName);
        this.vehicleEstimateService = new VehicleEstimateService();
        this.scrappingHistoryId = id;
    }

    dispatch(grouped, source) {
        this._dispatch(
            async (job) => {
                Logger().info('EstimateVehiclesJob:dispatch:START');

                const estimated = await this.vehicleEstimateService.estimate(grouped, source);

                return Promise.resolve(estimated);
            },
            {
                scrappingHistoryId: this.scrappingHistoryId,
            }
        );

        return this;
    }
}
