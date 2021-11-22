'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('vehicle_settings', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            seriesCode: {
                type: Sequelize.STRING,
                field: 'series_code',
            },
            mark: {
                type: Sequelize.STRING,
            },
            model: {
                type: Sequelize.STRING,
            },
            startYear: {
                type: Sequelize.STRING,
                field: 'start_year',
            },
            version: {
                type: Sequelize.INTEGER,
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
        await queryInterface.dropTable('vehicle_settings');
    },
};
