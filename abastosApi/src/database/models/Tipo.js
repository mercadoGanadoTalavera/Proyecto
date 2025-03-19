const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db');

class Tipo extends Model {}

Tipo.init(
    {
        id_tipo: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        nombre: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        descripcion: {
            type: DataTypes.TEXT,
            allowNull: true,
        }
    },
    {
        sequelize,
        modelName: 'Tipo',
        tableName: 'tipo', 
        timestamps: false
    }
);

module.exports = Tipo;
