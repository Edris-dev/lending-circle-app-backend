const sequelize = require('../config/database')
const {DataTypes} = require('sequelize')
const zlib = require('zlib')

const Circle = sequelize.define('Circle', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    title:{
        type: DataTypes.STRING(50),
        allowNull:false,
    },
    description:{
        type: DataTypes.STRING,
        allowNull:false,
        set(val){
            const compressed = zlib.deflateSync(val).toString('base64');
            this.setDataValue('description', compressed)
        },
        get(){
            const val = this.getDataValue('description')
            const decompressed = zlib.inflateSync(Buffer.from(val,'base64'));
            return decompressed.toString();
        }
    },
    monthlyContribution:{
        type: DataTypes.INTEGER,
        allowNull:false,
    },
    status:{
        type: DataTypes.STRING,
        defaultValue: "pending",
    },
    nextPayout:{
        type: DataTypes.DATE,
        allowNull: false,
    },
    minMembers:{
        type: DataTypes.INTEGER,
    },
    maxMembers:{
        type: DataTypes.INTEGER,
    },
    isPrivate:{
        type: DataTypes.BOOLEAN,
    },


});


module.exports = Circle;