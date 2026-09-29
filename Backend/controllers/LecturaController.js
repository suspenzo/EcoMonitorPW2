const Lectura = require('../models/Lectura');

const obtenerLecturas = async (req, res) => {
    try {
        const lecturas = await Lectura.findAll();
        res.status(200).json(lecturas);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            mensaje: 'Error al obtener las lecturas',
            error: error.message
        });
    }
};

const obtenerLecturaPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const lectura = await Lectura.findByPk(id);
        if (!lectura) {
            return res.status(404).json({ mensaje: 'Lectura no encontrada' });
        }
        res.status(200).json(lectura);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            mensaje: 'Error al obtener la lectura',
            error: error.message
        });
    }
};

const crearLectura = async (req, res) => {
    try {
        const { id_medidor, id_usuario, fecha_lectura, valor_lectura, consumo, observacion, foto_evidencia, fecha_registro } = req.body;

        if (!id_medidor) {
            return res.status(400).json({ mensaje: 'El id_medidor es obligatorio' });
        }
        if (!id_usuario) {
            return res.status(400).json({ mensaje: 'El id_usuario es obligatorio' });
        }
        if (!valor_lectura) {
            return res.status(400).json({ mensaje: 'El valor_lectura es obligatorio' });
        }
        if (!consumo) {
            return res.status(400).json({ mensaje: 'El consumo es obligatorio' });
        }

        const lectura = await Lectura.create({
            id_medidor,
            id_usuario,
            fecha_lectura: fecha_lectura || new Date(),
            valor_lectura,
            consumo,
            observacion,
            foto_evidencia,
            fecha_registro: fecha_registro || new Date()
        });

        res.status(201).json({
            mensaje: 'Lectura creada correctamente',
            lectura
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            mensaje: 'Error al crear la lectura',
            error: error.message
        });
    }
};

const actualizarLectura = async (req, res) => {
    try {
        const { id } = req.params;
        const lectura = await Lectura.findByPk(id);
        if (!lectura) {
            return res.status(404).json({ mensaje: 'Lectura no encontrada' });
        }

        const { id_medidor, id_usuario, fecha_lectura, valor_lectura, consumo, observacion, foto_evidencia, fecha_registro } = req.body;

        await lectura.update({
            id_medidor,
            id_usuario,
            fecha_lectura,
            valor_lectura,
            consumo,
            observacion,
            foto_evidencia,
            fecha_registro
        });

        res.status(200).json({
            mensaje: 'Lectura actualizada correctamente',
            lectura
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            mensaje: 'Error al actualizar la lectura',
            error: error.message
        });
    }
};

const eliminarLectura = async (req, res) => {
    try {
        const { id } = req.params;
        const lectura = await Lectura.findByPk(id);
        if (!lectura) {
            return res.status(404).json({ mensaje: 'Lectura no encontrada' });
        }
        await lectura.destroy();
        res.status(200).json({ mensaje: 'Lectura eliminada correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            mensaje: 'Error al eliminar la lectura',
            error: error.message
        });
    }
};

module.exports = {
    obtenerLecturas,
    obtenerLecturaPorId,
    crearLectura,
    actualizarLectura,
    eliminarLectura
};