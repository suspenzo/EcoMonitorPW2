const Rol_Permiso = require('../models/Rol_Permiso');

const obtenerRolPermisos = async (req, res) => {
    try {
        const rolPermisos = await Rol_Permiso.findAll();
        res.status(200).json(rolPermisos);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            mensaje: 'Error al obtener los rol_permisos',
            error: error.message
        });
    }
};

const obtenerRolPermisoPorId = async (req, res) => {
    try {
        const { id_rol, id_permiso } = req.params;
        const rolPermiso = await Rol_Permiso.findOne({
            where: { id_rol, id_permiso }
        });
        if (!rolPermiso) {
            return res.status(404).json({ mensaje: 'Rol_Permiso no encontrado' });
        }
        res.status(200).json(rolPermiso);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            mensaje: 'Error al obtener el rol_permiso',
            error: error.message
        });
    }
};

const crearRolPermiso = async (req, res) => {
    try {
        const { id_rol, id_permiso } = req.body;

        if (!id_rol) {
            return res.status(400).json({ mensaje: 'El id_rol es obligatorio' });
        }
        if (!id_permiso) {
            return res.status(400).json({ mensaje: 'El id_permiso es obligatorio' });
        }

        const rolPermiso = await Rol_Permiso.create({
            id_rol,
            id_permiso
        });

        res.status(201).json({
            mensaje: 'Rol_Permiso creado correctamente',
            rolPermiso
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            mensaje: 'Error al crear el rol_permiso',
            error: error.message
        });
    }
};

const eliminarRolPermiso = async (req, res) => {
    try {
        const { id_rol, id_permiso } = req.params;
        const rolPermiso = await Rol_Permiso.findOne({
            where: { id_rol, id_permiso }
        });
        if (!rolPermiso) {
            return res.status(404).json({ mensaje: 'Rol_Permiso no encontrado' });
        }
        await rolPermiso.destroy();
        res.status(200).json({ mensaje: 'Rol_Permiso eliminado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            mensaje: 'Error al eliminar el rol_permiso',
            error: error.message
        });
    }
};

module.exports = {
    obtenerRolPermisos,
    obtenerRolPermisoPorId,
    crearRolPermiso,
    eliminarRolPermiso
};