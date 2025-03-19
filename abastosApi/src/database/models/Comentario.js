const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db');

class Comentario extends Model {}

Comentario.init(
    {
        id_comentario: {
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
        }
    },
    {
        sequelize,
        modelName: 'Comentario',
        tableName: 'comentario', // minúscula
        timestamps: false
    }
);

module.exports = Comentario;
