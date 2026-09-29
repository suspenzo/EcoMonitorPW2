const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Recurso = sequelize.define('Recurso', {

    id_recurso: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    nombre: {
        type: DataTypes.STRING(50),
        allowNull: false
    },

    unidad_medida: {
        type: DataTypes.STRING(10),
        allowNull: false
    },

    descripcion: {
        type: DataTypes.STRING(255),
        allowNull: false
    },

    activo: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    }

}, {
    tableName: 'recursos',
    timestamps: false
});

module.exports = Recurso;