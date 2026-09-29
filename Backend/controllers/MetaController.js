const Meta = require('../models/Meta');

const obtenerMetas = async (req, res) => {
    try {
        const metas = await Meta.findAll();
        res.status(200).json(metas);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            mensaje: 'Error al obtener las metas',
            error: error.message
        });
    }
};

const obtenerMetaPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const meta = await Meta.findByPk(id);
        if (!meta) {
            return res.status(404).json({ mensaje: 'Meta no encontrada' });
        }
        res.status(200).json(meta);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            mensaje: 'Error al obtener la meta',
            error: error.message
        });
    }
};

const crearMeta = async (req, res) => {
    try {
        const { id_area, id_recurso, descripcion, periodo_inicio, periodo_fin, consumo_base, objetivo_ahorro_porcentaje, activo } = req.body;

        if (!id_area) {
            return res.status(400).json({ mensaje: 'El id_area es obligatorio' });
        }
        if (!id_recurso) {
            return res.status(400).json({ mensaje: 'El id_recurso es obligatorio' });
        }
        if (!periodo_fin) {
            return res.status(400).json({ mensaje: 'El periodo_fin es obligatorio' });
        }
        if (!consumo_base) {
            return res.status(400).json({ mensaje: 'El consumo_base es obligatorio' });
        }
        if (!objetivo_ahorro_porcentaje) {
            return res.status(400).json({ mensaje: 'El objetivo_ahorro_porcentaje es obligatorio' });
        }

        const meta = await Meta.create({
            id_area,
            id_recurso,
            descripcion,
            periodo_inicio: periodo_inicio || new Date(),
            periodo_fin,
            consumo_base,
            objetivo_ahorro_porcentaje,
            activo: activo !== undefined ? activo : true
        });

        res.status(201).json({
            mensaje: 'Meta creada correctamente',
            meta
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            mensaje: 'Error al crear la meta',
            error: error.message
        });
    }
};

const actualizarMeta = async (req, res) => {
    try {
        const { id } = req.params;
        const meta = await Meta.findByPk(id);
        if (!meta) {
            return res.status(404).json({ mensaje: 'Meta no encontrada' });
        }

        const { id_area, id_recurso, descripcion, periodo_inicio, periodo_fin, consumo_base, objetivo_ahorro_porcentaje, activo } = req.body;

        await meta.update({
            id_area,
            id_recurso,
            descripcion,
            periodo_inicio,
            periodo_fin,
            consumo_base,
            objetivo_ahorro_porcentaje,
            activo
        });

        res.status(200).json({
            mensaje: 'Meta actualizada correctamente',
            meta
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            mensaje: 'Error al actualizar la meta',
            error: error.message
        });
    }
};

const eliminarMeta = async (req, res) => {
    try {
        const { id } = req.params;
        const meta = await Meta.findByPk(id);
        if (!meta) {
            return res.status(404).json({ mensaje: 'Meta no encontrada' });
        }
        await meta.destroy();
        res.status(200).json({ mensaje: 'Meta eliminada correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            mensaje: 'Error al eliminar la meta',
            error: error.message
        });
    }
};

module.exports = {
    obtenerMetas,
    obtenerMetaPorId,
    crearMeta,
    actualizarMeta,
    eliminarMeta
};