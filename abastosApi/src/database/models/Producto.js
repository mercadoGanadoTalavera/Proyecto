const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db');

class Producto extends Model {}
// DEFINICION DE ATRIBUTOS DE LA ENTIDAD
// CARACTERISTICAS Y OBSERVACIONES CAMPOS NO REQUERIDOS

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
        tipo: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        id_categoria: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "Categoria",
                key: "id_categoria"
            },
            onDelete: "CASCADE"
        },
     }, {
        sequelize,
        modelName: 'Producto',
        tableName: 'Producto',
        timestamps: false
    }
);

module.exports = Producto;