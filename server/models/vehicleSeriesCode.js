import { Model, DataTypes } from 'sequelize';

export default class vehicleSeriesCode extends Model {
    static init(sequelize) {
        super.init({
            series_code: DataTypes.STRING,
            model: DataTypes.STRING,
            mark: DataTypes.STRING,
            is_diesel: DataTypes.BOOLEAN,
            listam_category_id: DataTypes.STRING,
            autoam_category_id: DataTypes.STRING,
            disabled: DataTypes.BOOLEAN,
        }, {
            sequelize,
            modelName: 'vehicleSeriesCode',
            underscored: true,
        });
    }
}
