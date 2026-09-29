const Alerta = require('../models/Alerta');

const obtenerAlertas = async (req, res) => {
    try {
        const alertas = await Alerta.findAll();
        res.status(200).json(alertas);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            mensaje: 'Error al obtener las alertas',
            error: error.message
        });
    }
};

const obtenerAlertaPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const alerta = await Alerta.findByPk(id);
        if (!alerta) {
            return res.status(404).json({
                mensaje: 'Alerta no encontrada'
            });
        }
        res.status(200).json(alerta);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            mensaje: 'Error al obtener la alerta',
            error: error.message
        });
    }
};

const crearAlerta = async (req, res) => {
    try {
        const { id_lectura, id_usuario, tipo, descripcion, estado, nivel, fecha_generacion, fecha_resolucion } = req.body;

        if (!id_lectura) {
            return res.status(400).json({ mensaje: 'El id_lectura es obligatorio' });
        }
        if (!id_usuario) {
            return res.status(400).json({ mensaje: 'El id_usuario es obligatorio' });
        }
        if (!tipo) {
            return res.status(400).json({ mensaje: 'El tipo es obligatorio' });
        }
        if (!descripcion) {
            return res.status(400).json({ mensaje: 'La descripción es obligatoria' });
        }

        const alerta = await Alerta.create({
            id_lectura,
            id_usuario,
            tipo,
            descripcion,
            estado: estado || 'NUEVA',
            nivel: nivel || 'MEDIO',
            fecha_generacion: fecha_generacion || new Date(),
            fecha_resolucion
        });

        res.status(201).json({
            mensaje: 'Alerta creada correctamente',
            alerta
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            mensaje: 'Error al crear la alerta',
            error: error.message
        });
    }
};

const actualizarAlerta = async (req, res) => {
    try {
        const { id } = req.params;
        const alerta = await Alerta.findByPk(id);
        if (!alerta) {
            return res.status(404).json({ mensaje: 'Alerta no encontrada' });
        }

        const { id_lectura, id_usuario, tipo, descripcion, estado, nivel, fecha_generacion, fecha_resolucion } = req.body;

        await alerta.update({
            id_lectura,
            id_usuario,
            tipo,
            descripcion,
            estado,
            nivel,
            fecha_generacion,
            fecha_resolucion
        });

        res.status(200).json({
            mensaje: 'Alerta actualizada correctamente',
            alerta
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            mensaje: 'Error al actualizar la alerta',
            error: error.message
        });
    }
};

const eliminarAlerta = async (req, res) => {
    try {
        const { id } = req.params;
        const alerta = await Alerta.findByPk(id);
        if (!alerta) {
            return res.status(404).json({ mensaje: 'Alerta no encontrada' });
        }
        await alerta.destroy();
        res.status(200).json({ mensaje: 'Alerta eliminada correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            mensaje: 'Error al eliminar la alerta',
            error: error.message
        });
    }
};

module.exports = {
    obtenerAlertas,
    obtenerAlertaPorId,
    crearAlerta,
    actualizarAlerta,
    eliminarAlerta
};