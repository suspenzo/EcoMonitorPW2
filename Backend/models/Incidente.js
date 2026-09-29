const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Incidente = sequelize.define('Incidente', {

    id_incidente: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    id_usuario: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    id_area: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    tipo: {
        type: DataTypes.STRING (100),
        allowNull: false
    },

    descripcion: {
        type: DataTypes.STRING (255),
        allowNull: true
    },

    fecha_incidente: {
        type: DataTypes.DATE,
        allowNull: false
    },

    estado: {
        type: DataTypes.ENUM('REPORTADO', 'EN_ATENCION', 'RESUELTO') ,
        defaultValue: 'REPORTADO',
        allowNull: false
    },

    fecha_resolucion: {
        type: DataTypes.DATE,
        allowNull: true
    }

}, {
    tableName: 'incidentes',
    timestamps: false
});

module.exports = Incidente;