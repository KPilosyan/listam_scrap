export default {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('vehicles', {
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
            model: {
                type: Sequelize.STRING,
            },
            mark: {
                type: Sequelize.STRING,
            },
            released: {
                type: Sequelize.INTEGER,
            },
            price: {
                type: Sequelize.FLOAT,
            },
            currency: {
                type: Sequelize.STRING,
            },
            publishedId: {
                type: Sequelize.INTEGER,
                field: 'published_id',
            },
            publishedDate: {
                type: Sequelize.DATE,
                field: 'published_date',
            },
            publisherPhoneNumber: {
                type: Sequelize.STRING,
                field: 'publisher_phone_number',
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
        await queryInterface.dropTable('vehicles');
    },
};
