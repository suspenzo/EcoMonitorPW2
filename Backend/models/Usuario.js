const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Usuario = sequelize.define('Usuario', {

    id_usuario: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    id_rol: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    nombre: {
        type: DataTypes.STRING(100),
        allowNull: false
    },

    apellido: {
        type: DataTypes.STRING(100),
        allowNull: true
    },

    usuario: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true
    },

    correo: {
        type: DataTypes.STRING(150),
        allowNull: false,
        unique: true
    },

    password_hash: {
        type: DataTypes.STRING(255),
        allowNull: false
    },

    activo: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },

    ultimo_acceso: {
        type: DataTypes.DATE,
        allowNull: true
    },

    fecha_creacion: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },

    fecha_actualizacion: {
        type: DataTypes.DATE,
        allowNull: true
    }

}, {
    tableName: 'usuarios',
    timestamps: false
});

module.exports = Usuario;