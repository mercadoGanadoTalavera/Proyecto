
const { DataTypes } = require("sequelize");
const sequelize = require("../db");
const Categoria = require("./Categoria");

const Sesion = sequelize.define("Sesion", {
  id_sesion: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  fecha: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  id_categoria: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
}, {
  tableName: "sesion",
  timestamps: false,
});

// Asociación: Sesion pertenece a Categoria
Sesion.belongsTo(Categoria, { foreignKey: "id_categoria" });

module.exports = Sesion;
