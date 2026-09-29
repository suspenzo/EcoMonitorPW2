const Tarifa = require('../models/Tarifa');

const obtenerTarifas = async (req, res) => {
    try {
        const tarifas = await Tarifa.findAll();
        res.status(200).json(tarifas);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            mensaje: 'Error al obtener las tarifas',
            error: error.message
        });
    }
};

const obtenerTarifaPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const tarifa = await Tarifa.findByPk(id);
        if (!tarifa) {
            return res.status(404).json({ mensaje: 'Tarifa no encontrada' });
        }
        res.status(200).json(tarifa);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            mensaje: 'Error al obtener la tarifa',
            error: error.message
        });
    }
};

const crearTarifa = async (req, res) => {
    try {
        const { id_recurso, precio_unitario, cargo_fijo, fecha_inicio, fecha_fin, activo } = req.body;

        if (!id_recurso) {
            return res.status(400).json({ mensaje: 'El id_recurso es obligatorio' });
        }
        if (!precio_unitario) {
            return res.status(400).json({ mensaje: 'El precio_unitario es obligatorio' });
        }
        if (!cargo_fijo) {
            return res.status(400).json({ mensaje: 'El cargo_fijo es obligatorio' });
        }
        if (!fecha_inicio) {
            return res.status(400).json({ mensaje: 'La fecha_inicio es obligatoria' });
        }
        if (!fecha_fin) {
            return res.status(400).json({ mensaje: 'La fecha_fin es obligatoria' });
        }

        const tarifa = await Tarifa.create({
            id_recurso,
            precio_unitario,
            cargo_fijo,
            fecha_inicio,
            fecha_fin,
            activo: activo !== undefined ? activo : true
        });

        res.status(201).json({
            mensaje: 'Tarifa creada correctamente',
            tarifa
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            mensaje: 'Error al crear la tarifa',
            error: error.message
        });
    }
};

const actualizarTarifa = async (req, res) => {
    try {
        const { id } = req.params;
        const tarifa = await Tarifa.findByPk(id);
        if (!tarifa) {
            return res.status(404).json({ mensaje: 'Tarifa no encontrada' });
        }

        const { id_recurso, precio_unitario, cargo_fijo, fecha_inicio, fecha_fin, activo } = req.body;

        await tarifa.update({
            id_recurso,
            precio_unitario,
            cargo_fijo,
            fecha_inicio,
            fecha_fin,
            activo
        });

        res.status(200).json({
            mensaje: 'Tarifa actualizada correctamente',
            tarifa
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            mensaje: 'Error al actualizar la tarifa',
            error: error.message
        });
    }
};

const eliminarTarifa = async (req, res) => {
    try {
        const { id } = req.params;
        const tarifa = await Tarifa.findByPk(id);
        if (!tarifa) {
            return res.status(404).json({ mensaje: 'Tarifa no encontrada' });
        }
        await tarifa.destroy();
        res.status(200).json({ mensaje: 'Tarifa eliminada correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            mensaje: 'Error al eliminar la tarifa',
            error: error.message
        });
    }
};

module.exports = {
    obtenerTarifas,
    obtenerTarifaPorId,
    crearTarifa,
    actualizarTarifa,
    eliminarTarifa
};