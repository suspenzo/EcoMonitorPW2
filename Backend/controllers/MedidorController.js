const Medidor = require('../models/Medidor');

const obtenerMedidores = async (req, res) => {
    try {
        const medidores = await Medidor.findAll();
        res.status(200).json(medidores);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            mensaje: 'Error al obtener los medidores',
            error: error.message
        });
    }
};

const obtenerMedidorPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const medidor = await Medidor.findByPk(id);
        if (!medidor) {
            return res.status(404).json({ mensaje: 'Medidor no encontrado' });
        }
        res.status(200).json(medidor);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            mensaje: 'Error al obtener el medidor',
            error: error.message
        });
    }
};

const crearMedidor = async (req, res) => {
    try {
        const { id_recurso, id_area, codigo, nombre, fecha_instalacion, activo } = req.body;

        if (!id_recurso) {
            return res.status(400).json({ mensaje: 'El id_recurso es obligatorio' });
        }
        if (!id_area) {
            return res.status(400).json({ mensaje: 'El id_area es obligatorio' });
        }
        if (!codigo) {
            return res.status(400).json({ mensaje: 'El código es obligatorio' });
        }
        if (!nombre) {
            return res.status(400).json({ mensaje: 'El nombre es obligatorio' });
        }

        const medidor = await Medidor.create({
            id_recurso,
            id_area,
            codigo,
            nombre,
            fecha_instalacion: fecha_instalacion || new Date(),
            activo: activo !== undefined ? activo : true
        });

        res.status(201).json({
            mensaje: 'Medidor creado correctamente',
            medidor
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            mensaje: 'Error al crear el medidor',
            error: error.message
        });
    }
};

const actualizarMedidor = async (req, res) => {
    try {
        const { id } = req.params;
        const medidor = await Medidor.findByPk(id);
        if (!medidor) {
            return res.status(404).json({ mensaje: 'Medidor no encontrado' });
        }

        const { id_recurso, id_area, codigo, nombre, fecha_instalacion, activo } = req.body;

        await medidor.update({
            id_recurso,
            id_area,
            codigo,
            nombre,
            fecha_instalacion,
            activo
        });

        res.status(200).json({
            mensaje: 'Medidor actualizado correctamente',
            medidor
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            mensaje: 'Error al actualizar el medidor',
            error: error.message
        });
    }
};

const eliminarMedidor = async (req, res) => {
    try {
        const { id } = req.params;
        const medidor = await Medidor.findByPk(id);
        if (!medidor) {
            return res.status(404).json({ mensaje: 'Medidor no encontrado' });
        }
        await medidor.destroy();
        res.status(200).json({ mensaje: 'Medidor eliminado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            mensaje: 'Error al eliminar el medidor',
            error: error.message
        });
    }
};

module.exports = {
    obtenerMedidores,
    obtenerMedidorPorId,
    crearMedidor,
    actualizarMedidor,
    eliminarMedidor
};