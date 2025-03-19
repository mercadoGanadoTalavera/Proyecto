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
        fecha: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        precio_actual: {
            type: DataTypes.DECIMAL(10,2),
            allowNull: true,  // En la BD puede ser NULL
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
        },
        unidad_medida: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        id_comentario: {
            type: DataTypes.INTEGER,
            allowNull: true,  // Puede ser NULL
            references: {
                model: "comentario",
                key: "id_comentario"
            },
            onDelete: "SET NULL"
        },
        id_producto: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "producto",
                key: "id_producto"
            },
            onDelete: "CASCADE"
        }
    },
    {
        sequelize,
        modelName: 'Precio',
        tableName: 'precio', // minúscula
        timestamps: false
    }
);

module.exports = Precio;
