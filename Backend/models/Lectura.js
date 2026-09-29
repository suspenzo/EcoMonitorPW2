const {DataTypes} = require('sequelize');
const sequelize = require('../config/database');

const Lectura = sequelize.define('Lectura', {
    id_lectura: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    id_medidor: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    id_usuario: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    fecha_lectura: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false
    },

    valor_lectura: { //el valor total marcado
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },

    consumo: { //el calculo del consumo del mes
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },

    observacion: {
        type: DataTypes.STRING(255),
        allowNull: true
    },

    foto_evidencia: {
        type: DataTypes.STRING(255),
        allowNull: true
    },

    fecha_registro: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false
    }
}, {
    tableName: 'lecturas',
    timestamps: false
});

module.exports = Lectura;