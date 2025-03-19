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
        id_categoria: {
            type: DataTypes.INTEGER,
            allowNull: true,  // Puede ser NULL
            references: {
                model: "categoria",
                key: "id_categoria"
            },
            onDelete: "SET NULL"
        },
        id_tipo: {
            type: DataTypes.INTEGER,
            allowNull: true,  // Puede ser NULL
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
        tableName: 'producto', // minúscula
        timestamps: false
    }
);

module.exports = Producto;
