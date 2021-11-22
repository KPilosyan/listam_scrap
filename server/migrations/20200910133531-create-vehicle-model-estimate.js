export default {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('vehicle_model_estimates', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            scrappingHistoryId: {
                allowNull: false,
                type: Sequelize.INTEGER,
                field: 'scrapping_history_id',
            },
            seriesCode: {
                type: Sequelize.STRING,
                field: 'series_code',
            },
            model: {
                type: Sequelize.STRING,
            },
            mark: {
                type: Sequelize.STRING,
            },
            released: {
                type: Sequelize.INTEGER,
            },
            count: {
                type: Sequelize.INTEGER,
            },
            deviationCount: {
                type: Sequelize.INTEGER,
                field: 'deviation_count',
            },
            avgPrice: {
                type: Sequelize.FLOAT,
                field: 'avg_price',
            },
            oldPrice: {
                type: Sequelize.FLOAT,
                field: 'old_price',
            },
            acceptedPrice: {
                type: Sequelize.FLOAT,
                field: 'accepted_price',
            },
            isDeviatedAvgPrice: {
                type: Sequelize.BOOLEAN,
                field: 'is_deviated_avg_price',
                defaultValue: false,
            },
            isDeviatedOldPrice: {
                type: Sequelize.BOOLEAN,
                field: 'is_deviated_old_price',
                defaultValue: false,
            },
            status: {
                type: Sequelize.STRING,
            },
            createdAt: {
                type: 'TIMESTAMP',
                field: 'created_at',
            },
            updatedAt: {
                type: 'TIMESTAMP',
                field: 'updated_at',
            },
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('vehicle_model_estimates');
    },
};
