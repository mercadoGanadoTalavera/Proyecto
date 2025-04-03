
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db');

class Registro extends Model {}

Registro.init(
    {
        id_registro: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        fecha: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        comentario: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        id_producto: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'producto',
                key: 'id_producto'
            }
        },
        id_precio: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'precio',
                key: 'id_precio'
            }
        }
    },
    {
        sequelize,
        modelName: 'Registro',
        tableName: 'registro',
        timestamps: false
    }
);

module.exports = Registro;
