import { Model, DataTypes } from 'sequelize';

export default class scrappingHistory extends Model {
    static PENDING = 'PENDING';
    static FINISHED = 'FINISHED';
    static FAILED = 'FAILED';

    static init(sequelize) {
        super.init({
            uuid: DataTypes.STRING,
            usdRate: DataTypes.FLOAT,
            source: DataTypes.STRING,
            status: DataTypes.STRING,
            approved: DataTypes.BOOLEAN,
            settingsVersion: DataTypes.STRING,
        }, {
            sequelize,
            modelName: 'scrappingHistory',
            underscored: true,
        });
    }

    static associate(models) {
        this.hasMany(models.vehicle, { as: 'vehicles' });
        this.hasMany(models.vehicleModelEstimate, { as: 'estimatedVehicles' });
    }
}
