const Area = require('../models/Area');

const obtenerAreas = async (req, res) => {
    try {
        const areas = await Area.findAll();
        res.status(200).json(areas);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            mensaje: 'Error al obtener las áreas',
            error: error.message
        });
    }
};

const obtenerAreaPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const area = await Area.findByPk(id);
        if (!area) {
            return res.status(404).json({ mensaje: 'Área no encontrada' });
        }
        res.status(200).json(area);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            mensaje: 'Error al obtener el área',
            error: error.message
        });
    }
};

const crearArea = async (req, res) => {
    try {
        const { nombre, descripcion, activo, fecha_creacion } = req.body;

        if (!nombre) {
            return res.status(400).json({ mensaje: 'El nombre del área es obligatorio' });
        }

        const area = await Area.create({
            nombre,
            descripcion,
            activo: activo !== undefined ? activo : true,
            fecha_creacion: fecha_creacion || new Date()
        });

        res.status(201).json({
            mensaje: 'Área creada correctamente',
            area
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            mensaje: 'Error al crear el área',
            error: error.message
        });
    }
};

const actualizarArea = async (req, res) => {
    try {
        const { id } = req.params;
        const area = await Area.findByPk(id);
        if (!area) {
            return res.status(404).json({ mensaje: 'Área no encontrada' });
        }

        const { nombre, descripcion, activo, fecha_creacion } = req.body;

        await area.update({
            nombre,
            descripcion,
            activo,
            fecha_creacion
        });

        res.status(200).json({
            mensaje: 'Área actualizada correctamente',
            area
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            mensaje: 'Error al actualizar el área',
            error: error.message
        });
    }
};

const eliminarArea = async (req, res) => {
    try {
        const { id } = req.params;
        const area = await Area.findByPk(id);
        if (!area) {
            return res.status(404).json({ mensaje: 'Área no encontrada' });
        }
        await area.destroy();
        res.status(200).json({ mensaje: 'Área eliminada correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            mensaje: 'Error al eliminar el área',
            error: error.message
        });
    }
};

module.exports = {
    obtenerAreas,
    obtenerAreaPorId,
    crearArea,
    actualizarArea,
    eliminarArea
};