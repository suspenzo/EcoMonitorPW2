const Permiso = require('../models/Permiso');

const obtenerPermisos = async (req, res) => {

    try {

        const permisos = await Permiso.findAll();

        res.status(200).json(permisos);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: 'Error al obtener los permisos',
            error: error.message
        });

    }

};

const obtenerPermisoPorId = async (req, res) => {

    try {

        const { id } = req.params;

        const permiso = await Permiso.findByPk(id);

        if (!permiso) {

            return res.status(404).json({
                mensaje: 'Permiso no encontrado'
            });

        }

        res.status(200).json(permiso);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: 'Error al obtener el permiso',
            error: error.message
        });

    }

};

const crearPermiso = async (req, res) => {

    try {

        const { nombre, descripcion } = req.body;

        // Validar nombre
        if (!nombre) {

            return res.status(400).json({
                mensaje: 'El nombre del permiso es obligatorio'
            });

        }

        const permiso = await Permiso.create({
            nombre,
            descripcion
        });

        res.status(201).json({
            mensaje: 'Permiso creado correctamente',
            permiso
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: 'Error al crear el permiso',
            error: error.message
        });

    }

};

const actualizarPermiso = async (req, res) => {

    try {

        const { id } = req.params;

        const permiso = await Permiso.findByPk(id);

        if (!permiso) {

            return res.status(404).json({
                mensaje: 'Permiso no encontrado'
            });

        }

        const { nombre, descripcion} = req.body;

        await permiso.update({
            nombre,
            descripcion
        });

        res.status(200).json({
            mensaje: 'Permiso actualizado correctamente',
            permiso
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: 'Error al actualizar el permiso',
            error: error.message
        });

    }

};

const eliminarPermiso = async (req, res) => {

    try {

        const { id } = req.params;

        const permiso = await Permiso.findByPk(id);

        if (!permiso) {

            return res.status(404).json({
                mensaje: 'Permiso no encontrado'
            });

        }

        await permiso.destroy();

        res.status(200).json({
            mensaje: 'Permiso eliminado correctamente'
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: 'Error al eliminar el permiso',
            error: error.message
        });

    }

};


module.exports = {
    obtenerPermisos,
    obtenerPermisoPorId,
    crearPermiso,
    actualizarPermiso,
    eliminarPermiso
};
    