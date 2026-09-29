const {dataTypes} = require('sequelize');
const sequelize = require('../config/database');

const Meta = sequelize.define('Meta', {

    id_meta: {
        type: dataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    id_area: {
        type: dataTypes.INTEGER,
        allowNull: false
    },

    id_recurso: {
        type: dataTypes.INTEGER,
        allowNull: false
    },

    descripcion: {
        type: dataTypes.STRING(255),
        allowNull: true
    },

    periodo_inicio: {
        type: dataTypes.DATE,
        defaultValue: dataTypes.NOW,
        allowNull: false
    },

    periodo_fin: {
        type: dataTypes.DATE,
        allowNull: false
    },

    consumo_base: {
        type: dataTypes.DECIMAL(10, 5),
        allowNull: false
    },

    objetivo_ahorro_porcentaje: {
        type: dataTypes.DECIMAL(5, 2),
        allowNull: false
    },

    activo: {
        type: dataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    }
}, {
    tableName: 'metas',
    timestamps: false
});

module.exports = Meta;