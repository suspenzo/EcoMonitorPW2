const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Rol_Permiso = sequelize.define('Rol_Permiso', {
    id_rol: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    },

    id_permiso: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    }
}, {
    tableName: 'rol_permiso',
    timestamps: false
});

module.exports = Rol_Permiso;