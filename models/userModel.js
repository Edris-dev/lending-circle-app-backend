const sequelize = require('../config/database');
const {DataTypes} = require('sequelize');

const bcrypt = require('bcrypt')

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    username:{
        type: DataTypes.STRING(50),
        allowNull:false,
        unique: true,
    },
    password:{
        type: DataTypes.STRING,
        allowNull:false,
        set(value){
            const hashed = bcrypt.hashSync(value, bcrypt.genSaltSync());
            this.setDataValue('password',hashed)
        }
    },
    firstName:{
        type: DataTypes.STRING(50),
        allowNull:false,
    },
    email:{
        type: DataTypes.STRING,
        allowNull:false,
        unique: true,
        validate:{
            isEmail: true,
        }
    },
    displayImg:{
        type: DataTypes.STRING,
        allowNull:false,
    }
});



module.exports = User;