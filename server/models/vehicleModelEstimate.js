import { Model, DataTypes } from 'sequelize';

export default class vehicleModelEstimate extends Model {
    static init(sequelize) {
        super.init({
            scrappingHistoryId: DataTypes.INTEGER,
            seriesCode: DataTypes.STRING,
            model: DataTypes.STRING,
            mark: DataTypes.STRING,
            count: DataTypes.INTEGER,
            deviationCount: DataTypes.INTEGER,
            released: DataTypes.INTEGER,
            avgPrice: DataTypes.FLOAT,
            oldPrice: DataTypes.FLOAT,
            acceptedPrice: DataTypes.FLOAT,
            isDeviatedAvgPrice: DataTypes.BOOLEAN,
            isDeviatedOldPrice: DataTypes.BOOLEAN,
            status: DataTypes.STRING,
        }, {
            sequelize,
            modelName: 'vehicleModelEstimate',
            underscored: true,
        });
    }

    static associate(models) {
        this.belongsTo(models.scrappingHistory);
    }

    static updateSeriesCodes(id) {
        return this.sequelize
            .query(
                // eslint-disable-next-line no-multi-str
                'UPDATE vehicle_model_estimates AS vme \
                SET series_code = \
                (SELECT distinct series_code FROM vehicle_series_codes vsc \
                INNER JOIN scrapping_histories ON scrapping_history_id = vme.scrapping_history_id \
                WHERE vsc.disabled = false \
                AND trim(vsc.model) = trim(vme.model) AND trim(vsc.mark) = trim(vme.mark) ) \
                WHERE vme.scrapping_history_id = (:id)',
                {replacements: {id: id}}
            );
    }
}
