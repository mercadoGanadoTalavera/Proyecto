
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db');

class Precio extends Model {}

Precio.init(
    {
        id_precio: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        precio_actual: {
            type: DataTypes.DECIMAL(10,2),
            allowNull: true,
        },
        precio_actual_min: {
            type: DataTypes.DECIMAL(10,2),
            allowNull: true,
        },
        precio_actual_max: {
            type: DataTypes.DECIMAL(10,2),
            allowNull: true,
        },
        precio_anterior: {
            type: DataTypes.DECIMAL(10,2),
            allowNull: true,
        },
        precio_anterior_min: {
            type: DataTypes.DECIMAL(10,2),
            allowNull: true,
        },
        precio_anterior_max: {
            type: DataTypes.DECIMAL(10,2),
            allowNull: true,
        }
    },
    {
        sequelize,
        modelName: 'Precio',
        tableName: 'precio',
        timestamps: false
    }
);

module.exports = Precio;
