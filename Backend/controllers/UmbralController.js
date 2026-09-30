const Umbral = require('../models/Umbral');

const obtenerUmbrales = async (req, res) => {
    try {
        const umbrales = await Umbral.findAll();
        res.status(200).json(umbrales);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            mensaje: 'Error al obtener los umbrales',
            error: error.message
        });
    }
};

const obtenerUmbralPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const umbral = await Umbral.findByPk(id);

        if (!umbral) {
            return res.status(404).json({
                mensaje: 'Umbral no encontrado'
            });
        }

        res.status(200).json(umbral);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            mensaje: 'Error al obtener el umbral',
            error: error.message
        });
    }
};

const crearUmbral = async (req, res) => {
    try {
        const { tipo_periodo, limite_consumo, activo } = req.body;

        if (!tipo_periodo) {
            return res.status(400).json({
                mensaje: 'El tipo_periodo es obligatorio'
            });
        }

        if (!['DIARIO', 'SEMANAL', 'MENSUAL'].includes(tipo_periodo)) {
            return res.status(400).json({
                mensaje: 'El tipo_periodo debe ser DIARIO, SEMANAL o MENSUAL'
            });
        }

        if (limite_consumo === undefined || limite_consumo === null) {
            return res.status(400).json({
                mensaje: 'El limite_consumo es obligatorio'
            });
        }

        if (Number(limite_consumo) <= 0) {
            return res.status(400).json({
                mensaje: 'El limite_consumo debe ser mayor a 0'
            });
        }

        const umbral = await Umbral.create({
            tipo_periodo,
            limite_consumo,
            activo: activo !== undefined ? activo : true
        });

        res.status(201).json({
            mensaje: 'Umbral creado correctamente',
            umbral
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            mensaje: 'Error al crear el umbral',
            error: error.message
        });
    }
};

const actualizarUmbral = async (req, res) => {
    try {
        const { id } = req.params;
        const umbral = await Umbral.findByPk(id);

        if (!umbral) {
            return res.status(404).json({
                mensaje: 'Umbral no encontrado'
            });
        }

        const { tipo_periodo, limite_consumo, activo } = req.body;

        if (
            tipo_periodo !== undefined &&
            !['DIARIO', 'SEMANAL', 'MENSUAL'].includes(tipo_periodo)
        ) {
            return res.status(400).json({
                mensaje: 'El tipo_periodo debe ser DIARIO, SEMANAL o MENSUAL'
            });
        }

        if (limite_consumo !== undefined && Number(limite_consumo) <= 0) {
            return res.status(400).json({
                mensaje: 'El limite_consumo debe ser mayor a 0'
            });
        }

        await umbral.update({
            tipo_periodo,
            limite_consumo,
            activo
        });

        res.status(200).json({
            mensaje: 'Umbral actualizado correctamente',
            umbral
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            mensaje: 'Error al actualizar el umbral',
            error: error.message
        });
    }
};

const eliminarUmbral = async (req, res) => {
    try {
        const { id } = req.params;
        const umbral = await Umbral.findByPk(id);

        if (!umbral) {
            return res.status(404).json({
                mensaje: 'Umbral no encontrado'
            });
        }

        await umbral.destroy();

        res.status(200).json({
            mensaje: 'Umbral eliminado correctamente'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            mensaje: 'Error al eliminar el umbral',
            error: error.message
        });
    }
};

module.exports = {
    obtenerUmbrales,
    obtenerUmbralPorId,
    crearUmbral,
    actualizarUmbral,
    eliminarUmbral
};