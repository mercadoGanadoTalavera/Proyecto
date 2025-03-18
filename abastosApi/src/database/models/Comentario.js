const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db');

class Comentario extends Model {}
// DEFINICION DE ATRIBUTOS DE LA ENTIDAD
// CARACTERISTICAS Y OBSERVACIONES CAMPOS NO REQUERIDOS

Comentario.init(
    {
        id_Comentario: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        fecha: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        descripcion: {
            type: DataTypes.STRING,
            allowNull: false,
        },      
        id_precio: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "Precio",
                key: "id_precio"
            },
            onDelete: "CASCADE"
        },
     }, {
        sequelize,
        modelName: 'Comentario',
        tableName: 'Comentario',
        timestamps: false
    }
);

module.exports = Comentario;