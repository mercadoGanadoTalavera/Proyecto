const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db');

class Precio extends Model {}
// DEFINICION DE ATRIBUTOS DE LA ENTIDAD
// CARACTERISTICAS Y OBSERVACIONES CAMPOS NO REQUERIDOS

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
            allowNull: false,
        },
        precio_actual_min: {
            type: DataTypes.DECIMAL(10,2),
            allowNull: false,
        },
        precio_actual_max: {
            type: DataTypes.DECIMAL(10,2),
            allowNull: false,
        },
        precio_anterior: {
            type: DataTypes.DECIMAL(10,2),
            allowNull: false,
        },
        precio_anterior_min: {
            type: DataTypes.DECIMAL(10,2),
            allowNull: false,
        },
        precio_anterior_max: {
            type: DataTypes.DECIMAL(10,2),
            allowNull: false,
        },
        unidad_medida: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        id_comentario: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "Comentario",
                key: "id_comentario"
            },
            onDelete: "CASCADE"
        },
        id_producto: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "Producto",
                key: "id_producto"
            },
            onDelete: "CASCADE"
     },
     }, {
        sequelize,
        modelName: 'Precio',
        tableName: 'Precio',
        timestamps: false
    }
);

module.exports = Precio;