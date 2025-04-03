
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db');

class Producto extends Model {}

Producto.init(
    {
        id_producto: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        nombre: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        unidad_medida: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        tipo_precio: {
            type: DataTypes.TINYINT,
            allowNull: false,
            validate: {
                isIn: [[0, 1]]
            }
        },
        id_categoria: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: "categoria",
                key: "id_categoria"
            },
            onDelete: "SET NULL"
        },
        id_tipo: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: "tipo",
                key: "id_tipo"
            },
            onDelete: "SET NULL"
        }
    },
    {
        sequelize,
        modelName: 'Producto',
        tableName: 'producto',
        timestamps: false
    }
);

module.exports = Producto;
