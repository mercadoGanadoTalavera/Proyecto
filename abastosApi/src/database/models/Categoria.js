const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db');

class Categoria extends Model {}
// DEFINICION DE ATRIBUTOS DE LA ENTIDAD
// CARACTERISTICAS Y OBSERVACIONES CAMPOS NO REQUERIDOS

Categoria.init(
    {
        id_categoria: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        nombre: {
            type: DataTypes.STRING,
            allowNull: false,
        },
     }, {
        sequelize,
        modelName: 'Categoria',
        tableName: 'categoria',
        timestamps: false
    }
);

module.exports = Categoria;