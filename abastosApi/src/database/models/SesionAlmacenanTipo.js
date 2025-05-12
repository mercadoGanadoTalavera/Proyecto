const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db');

class SesionesAlmacenanTipo extends Model {}

SesionesAlmacenanTipo.init(
    {
        id_tipo: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        id_sesion: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        comentario: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    },
    {
        sequelize,
        modelName: 'SesionesAlmacenanTipo',
        tableName: 'sesiones_almacenan_tipo',
        timestamps: false
    }
);

module.exports = SesionesAlmacenanTipo;
