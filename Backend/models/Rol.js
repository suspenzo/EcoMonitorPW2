const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Rol = sequelize.define('Rol', {

    id_rol: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    nombre: {
        type: DataTypes.STRING (100),
        allowNull: false
    },

    descripcion: {
        type: DataTypes.STRING (255),
        allowNull: true
    },

    activo: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    }

}, {
    tableName: 'roles',
    timestamps: false
});

module.exports = Rol;