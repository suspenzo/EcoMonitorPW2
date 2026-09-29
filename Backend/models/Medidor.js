const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Medidor = sequelize.define('Medidor', {

    id_medidor: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    id_recurso: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    id_area: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    codigo: {
        type: DataTypes.STRING(100),
        allowNull: false
    },  

    nombre: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },

    fecha_instalacion: {
        type: DataTypes.DATE,
        allowNull: false, 
        defaultValue: DataTypes.NOW
    },

    activo: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    }
}, {
    tableName: 'medidores',
    timestamps: false
});

module.exports = Medidor;