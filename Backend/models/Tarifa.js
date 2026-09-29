const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Tarifa = sequelize.define('Tarifa', {

    id_tarifa: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    id_recurso: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    precio_unitario: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },

    cargo_fijo: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },

    fecha_inicio: {
        type: DataTypes.DATE,
        allowNull: false
    },

    fecha_fin: {
        type: DataTypes.DATE,
        allowNull: false
    },

    activo: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    }

}, {
    tableName: 'tarifas',
    timestamps: false
});

module.exports = Tarifa;