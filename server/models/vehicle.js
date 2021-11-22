import { Model, DataTypes } from 'sequelize';

export default class vehicle extends Model {
    static init(sequelize) {
        super.init({
            scrappingHistoryId: DataTypes.INTEGER,
            model: DataTypes.STRING,
            mark: DataTypes.STRING,
            released: DataTypes.INTEGER,
            price: DataTypes.FLOAT,
            currency: DataTypes.STRING,
            publishedId: DataTypes.INTEGER,
            publishedDate: DataTypes.DATE,
            publisherPhoneNumber: DataTypes.STRING,
        }, {
            sequelize,
            modelName: 'vehicle',
            underscored: true,
        });
    }

    static associate(models) {
        this.belongsTo(models.scrappingHistory);
    }

    static getVehiclesByPublishedId(ids) {
        return this.sequelize.query(
            // eslint-disable-next-line no-multi-str
            'select mark, model, currency, vehicles.published_id as "publishedId", published_date as "publishedDate", publisher_phone_number as "publisherPhoneNumber" from vehicles \
            inner join (select distinct published_id, max(id) as vehicle_ids from vehicles where vehicles.published_id  in (:ids) \
            group by published_id) as grouped \
            on grouped.vehicle_ids = vehicles.id',
            { replacements: { ids } }
        );
    }
}
