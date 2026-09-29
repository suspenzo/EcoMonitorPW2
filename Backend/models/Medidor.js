const {Datatypes} = require('sequelize');
const sequelize = require('../config/database');

const Medidor = sequelize.define('Medidor', {

    id_medidor: {
        type: Datatypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    id_recurso: {
        type: Datatypes.INTEGER,
        allowNull: false
    },

    id_area: {
        type: Datatypes.INTEGER,
        allowNull: false
    },

    codigo: {
        type: Datatypes.STRING(100),
        allowNull: false
    },  

    nombre: {
        type: Datatypes.STRING(100),
        allowNull: false,
    },

    fecha_instalacion: {
        type: Datatypes.DATE,
        allowNull: false, 
        defaultValue: Datatypes.NOW
    },

    activo: {
        type: Datatypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    }
}, {
    tableName: 'medidores',
    timestamps: false
});

module.exports = Medidor;