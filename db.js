const Sequelize = require('sequelize');

const sequelize = new Sequelize('postgres://postgres:14b9c4a2e2ce45508f4991456a37ae47@localhost:5432/workout-log');

module.exports = sequelize;