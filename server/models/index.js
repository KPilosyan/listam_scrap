import Sequelize from 'sequelize';
import fs from 'fs';
import path from 'path';
import _ from 'lodash';
import config from '../config/config.json';

const env = process.env.APP_ENV || 'development';
const basename = path.basename(__filename);

// Create connection
const sequelize = new Sequelize(
    config[env].database, config[env].username, config[env].password, config[env]
);

// Load all models
fs
    .readdirSync('models')
    .filter(file => {
        return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
    })
    .forEach(file => {
        const model = require('./' + file);
        model.default.init(sequelize);
    });

// Associate
const models = sequelize.models;
_.map(Object.keys(models), n => models[n])
    .filter(m => m.associate !== undefined)
    .forEach(m => m.associate(models));

export default models;
