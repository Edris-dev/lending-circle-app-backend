const { Sequelize, DataTypes } = require('sequelize');


const sequelize = new Sequelize('sandooq', 'postgres', '123', {
    host: 'localhost',
    dialect: 'postgres',
});

sequelize.authenticate().then(() => {
    console.log("DB connection succesful")
  }).catch((err) => {
    console.log("Oopps an error")
  })

module.exports = sequelize;