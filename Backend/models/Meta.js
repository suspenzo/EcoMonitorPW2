const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Meta = sequelize.define('Meta', {

    id_meta: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    id_area: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    id_recurso: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    descripcion: {
        type: DataTypes.STRING(255),
        allowNull: true
    },

    periodo_inicio: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false
    },

    periodo_fin: {
        type: DataTypes.DATE,
        allowNull: false
    },

    consumo_base: {
        type: DataTypes.DECIMAL(10, 5),
        allowNull: false
    },

    objetivo_ahorro_porcentaje: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false
    },

    activo: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    }
}, {
    tableName: 'metas',
    timestamps: false
});

module.exports = Meta;