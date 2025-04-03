const Sequelize = require("sequelize");

const sequelize = new Sequelize("mercado_abastos", "root", "", {
    host: "localhost",
    port: 3306,
    dialect: "mysql",
  });

module.exports = sequelize;