export default {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('vehicle_series_codes', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            series_code: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            model: {
                type: Sequelize.STRING,
            },
            mark: {
                type: Sequelize.STRING,
            },
            is_diesel: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
            },
            disabled: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
            },
            listamCategoryId: {
                type: Sequelize.STRING,
                field: 'listam_category_id',
            },
            autoamCategoryId: {
                type: Sequelize.STRING,
                field: 'autoam_category_id',
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
        await queryInterface.dropTable('vehicle_series_codes');
    },
};
