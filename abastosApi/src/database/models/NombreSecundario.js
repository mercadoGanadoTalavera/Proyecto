// models/NombreSecundario.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db');

class NombreSecundario extends Model {}

NombreSecundario.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  id_producto: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  nombre_1: {
    type: DataTypes.STRING,
  },
  nombre_2: {
    type: DataTypes.STRING,
  },
  nombre_3: {
    type: DataTypes.STRING,
  },
}, {
  sequelize,
  modelName: 'NombreSecundario',
  tableName: 'nombre_secundario',
  timestamps: false,
});

module.exports = NombreSecundario;
