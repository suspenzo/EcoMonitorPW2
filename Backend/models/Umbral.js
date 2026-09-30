const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Umbral = sequelize.define('Umbral', {
    id_umbral: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    tipo_periodo: { type: DataTypes.ENUM('DIARIO', 'SEMANAL', 'MENSUAL'), allowNull: false },
    limite_consumo: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    activo: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    fecha_creacion: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
}, { tableName: 'umbrales', timestamps: false });

module.exports = Umbral;