import Job from './Job';
import VehicleGroupService from '../services/VehicleGroupService';
import Logger from '../modules/Logger';

const jobName = 'GroupVehiclesJob';

export default class GroupVehiclesJob extends Job {
    constructor(id, usdRate, vehicleSettings) {
        super(jobName);
        this.vehicleGroupService = new VehicleGroupService(usdRate, vehicleSettings);
        this.scrappingHistoryId = id;
    }

    dispatch(list) {
        this._dispatch(
            (job) => {
                Logger().info('GroupVehiclesJob:dispatch:START');

                const grouped = this.vehicleGroupService.group(list);

                return Promise.resolve(grouped);
            },
            {
                scrappingHistoryId: this.scrappingHistoryId,
            }
        );

        return this;
    }
}
