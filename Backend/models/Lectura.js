const {dataTypes} = require('sequelize');
const sequelize = require('../config/database');

const Lectura = sequelize.define('Lectura', {
    id_lectura: {
        type: dataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    id_medidor: {
        type: dataTypes.INTEGER,
        allowNull: false
    },

    id_usuario: {
        type: dataTypes.INTEGER,
        allowNull: false
    },

    fecha_lectura: {
        type: dataTypes.DATE,
        defaultValue: dataTypes.NOW,
        allowNull: false
    },

    valor_lectura: { //el valor total marcado
        type: dataTypes.DECIMAL(10, 2),
        allowNull: false
    },

    consumo: { //el calculo del consumo del mes
        type: dataTypes.DECIMAL(10, 2),
        allowNull: false
    },

    observacion: {
        type: dataTypes.STRING(255),
        allowNull: true
    },

    foto_evidencia: {
        type: dataTypes.STRING(255),
        allowNull: true
    },

    fecha_registro: {
        type: dataTypes.DATE,
        defaultValue: dataTypes.NOW,
        allowNull: false
    }
}, {
    tableName: 'lecturas',
    timestamps: false
});

module.exports = Lectura;