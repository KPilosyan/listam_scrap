export default {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('scrapping_histories', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            uuid: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            usdRate: {
                allowNull: false,
                type: Sequelize.FLOAT,
                field: 'usd_rate',
            },
            source: {
                type: Sequelize.STRING,
            },
            status: {
                type: Sequelize.STRING,
            },
            approved: {
                type: Sequelize.BOOLEAN,
                field: 'approved',
                defaultValue: false,
            },
            settingsVersion: {
                type: Sequelize.STRING,
                field: 'settings_version',
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
        await queryInterface.dropTable('scrapping_histories');
    },
};
