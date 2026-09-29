const {DataTypes} = require('sequelize');
const sequelize = require('../config/database');

const Alerta = sequelize.define('Alerta', {

    id_alerta: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    }, 

    id_lectura: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    id_usuario: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    tipo: {
        type: DataTypes.STRING(50),
        allowNull: false
    },

    descripcion: {
        type: DataTypes.STRING(255),
        allowNull: false
    },

    estado : {
        type: DataTypes.ENUM('NUEVA', 'EN ATENCION', 'RESUELTA', 'DESCARTADA'),
        allowNull: false,
        defaultValue: 'NUEVA'   
    },

    nivel: {
        type: DataTypes.ENUM('BAJO', 'MEDIO', 'ALTO', 'CRITICO'),
        allowNull: false,
        defaultValue: 'MEDIO'
    },

    fecha_generacion: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },

    fecha_resolucion: {
        type: DataTypes.DATE,
        allowNull: true
    },
}, {
    tableName: 'alertas',
    timestamps: false
});

module.exports = Alerta;
