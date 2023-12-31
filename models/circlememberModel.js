const sequelize = require('../config/database')
const {DataTypes} = require('sequelize');
const User = require('./userModel');
const Circle = require('./circleModel');

const CircleMember = sequelize.define('CircleMember', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    status:{
        type: DataTypes.STRING(50),
        defaultValue: "Invited",
    },
});

module.exports = CircleMember;