const {dataTypes} = require('sequelize');
const sequelize = require('../config/database');

const Alerta = sequelize.define('Alerta', {

    id_alerta: {
        type: dataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    }, 

    id_lectura: {
        type: dataTypes.INTEGER,
        allowNull: false
    },

    id_usuario: {
        type: dataTypes.INTEGER,
        allowNull: false
    },

    tipo: {
        type: dataTypes.STRING(50),
        allowNull: false
    },

    descripcion: {
        type: dataTypes.STRING(255),
        allowNull: false
    },

    estado : {
        type: dataTypes.ENUM('NUEVA', 'EN ATENCION', 'RESUELTA', 'DESCARTADA'),
        allowNull: false,
        defaultValue: 'NUEVA'   
    },

    nivel: {
        type: dataTypes.ENUM('BAJO', 'MEDIO', 'ALTO', 'CRITICO'),
        allowNull: false,
        defaultValue: 'MEDIO'
    },

    fecha_generacion: {
        type: dataTypes.DATE,
        allowNull: false,
        defaultValue: dataTypes.NOW
    },

    fecha_resolucion: {
        type: dataTypes.DATE,
        allowNull: true
    },
}, {
    tableName: 'alertas',
    timestamps: false
});

module.exports = Alerta;
