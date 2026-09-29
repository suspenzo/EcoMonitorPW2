const Incidente = require('../models/Incidente');

const obtenerIncidentes = async (req, res) => {
    try {
        const incidentes = await Incidente.findAll();
        res.status(200).json(incidentes);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            mensaje: 'Error al obtener los incidentes',
            error: error.message
        });
    }
};

const obtenerIncidentePorId = async (req, res) => {
    try {
        const { id } = req.params;
        const incidente = await Incidente.findByPk(id);
        if (!incidente) {
            return res.status(404).json({ mensaje: 'Incidente no encontrado' });
        }
        res.status(200).json(incidente);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            mensaje: 'Error al obtener el incidente',
            error: error.message
        });
    }
};

const crearIncidente = async (req, res) => {
    try {
        const { id_usuario, id_area, tipo, descripcion, fecha_incidente, estado, fecha_resolucion } = req.body;

        if (!id_usuario) {
            return res.status(400).json({ mensaje: 'El id_usuario es obligatorio' });
        }
        if (!id_area) {
            return res.status(400).json({ mensaje: 'El id_area es obligatorio' });
        }
        if (!tipo) {
            return res.status(400).json({ mensaje: 'El tipo es obligatorio' });
        }
        if (!fecha_incidente) {
            return res.status(400).json({ mensaje: 'La fecha_incidente es obligatoria' });
        }

        const incidente = await Incidente.create({
            id_usuario,
            id_area,
            tipo,
            descripcion,
            fecha_incidente,
            estado: estado || 'REPORTADO',
            fecha_resolucion
        });

        res.status(201).json({
            mensaje: 'Incidente creado correctamente',
            incidente
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            mensaje: 'Error al crear el incidente',
            error: error.message
        });
    }
};

const actualizarIncidente = async (req, res) => {
    try {
        const { id } = req.params;
        const incidente = await Incidente.findByPk(id);
        if (!incidente) {
            return res.status(404).json({ mensaje: 'Incidente no encontrado' });
        }

        const { id_usuario, id_area, tipo, descripcion, fecha_incidente, estado, fecha_resolucion } = req.body;

        await incidente.update({
            id_usuario,
            id_area,
            tipo,
            descripcion,
            fecha_incidente,
            estado,
            fecha_resolucion
        });

        res.status(200).json({
            mensaje: 'Incidente actualizado correctamente',
            incidente
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            mensaje: 'Error al actualizar el incidente',
            error: error.message
        });
    }
};

const eliminarIncidente = async (req, res) => {
    try {
        const { id } = req.params;
        const incidente = await Incidente.findByPk(id);
        if (!incidente) {
            return res.status(404).json({ mensaje: 'Incidente no encontrado' });
        }
        await incidente.destroy();
        res.status(200).json({ mensaje: 'Incidente eliminado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            mensaje: 'Error al eliminar el incidente',
            error: error.message
        });
    }
};

module.exports = {
    obtenerIncidentes,
    obtenerIncidentePorId,
    crearIncidente,
    actualizarIncidente,
    eliminarIncidente
};