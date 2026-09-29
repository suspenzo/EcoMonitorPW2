const Recurso = require('../models/Recurso');

const obtenerRecursos = async (req, res) => {

    try {

        const recursos = await Recurso.findAll();

        res.status(200).json(recursos);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: 'Error al obtener los recursos',
            error: error.message
        });

    }

};

const obtenerRecursoPorId = async (req, res) => {

    try {

        const { id } = req.params;

        const recurso = await Recurso.findByPk(id);

        if (!recurso) {

            return res.status(404).json({
                mensaje: 'Recurso no encontrado'
            });

        }

        res.status(200).json(recurso);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: 'Error al obtener el recurso',
            error: error.message
        });

    }

};

const crearRecurso = async (req, res) => {

    try {

        const { nombre, unidad_medida, descripcion, activo} = req.body;

        // Validar nombre
        if (!nombre) {

            return res.status(400).json({
                mensaje: 'El nombre del recurso es obligatorio'
            });

        }

        if (!unidad_medida) {

            return res.status(400).json({
                mensaje: 'La unidad de medida es obligatoria'
            });

        }

        if (!descripcion) {

            return res.status(400).json({
                mensaje: 'La descripción del recurso es obligatoria'
            });

        }

        const recurso = await Recurso.create({
            nombre,
            unidad_medida,
            descripcion,
            activo: activo !== undefined ? activo : true
        });

        res.status(201).json({
            mensaje: 'Recurso creado correctamente',
            recurso
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: 'Error al crear el recurso',
            error: error.message
        });

    }

};

const actualizarRecurso = async (req, res) => {

    try {

        const { id } = req.params;

        const recurso = await Recurso.findByPk(id);

        if (!recurso) {

            return res.status(404).json({
                mensaje: 'Recurso no encontrado'
            });

        }

        const { nombre, unidad_medida, descripcion, activo } = req.body;

        await recurso.update({
            nombre,
            unidad_medida,
            descripcion,
            activo
        });

        res.status(200).json({
            mensaje: 'Recurso actualizado correctamente',
            recurso
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: 'Error al actualizar el recurso',
            error: error.message
        });

    }

};

const eliminarRecurso = async (req, res) => {

    try {

        const { id } = req.params;

        const recurso = await Recurso.findByPk(id);

        if (!recurso) {

            return res.status(404).json({
                mensaje: 'Recurso no encontrado'
            });

        }

        await recurso.destroy();

        res.status(200).json({
            mensaje: 'Recurso eliminado correctamente'
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: 'Error al eliminar el recurso',
            error: error.message
        });

    }

};


module.exports = {
    obtenerRecursos,
    obtenerRecursoPorId,
    crearRecurso,
    actualizarRecurso,
    eliminarRecurso
};