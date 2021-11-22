import { Model, DataTypes } from 'sequelize';

export default class vehicleSettings extends Model {
    static init(sequelize) {
        super.init({
            seriesCode: DataTypes.STRING,
            mark: DataTypes.STRING,
            model: DataTypes.STRING,
            startYear: DataTypes.STRING,
            version: DataTypes.INTEGER,
        }, {
            sequelize,
            modelName: 'vehicleSettings',
            underscored: true,
        });
    }
}
