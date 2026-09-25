const Rol = require('../models/Rol');

// ========================================
// OBTENER TODOS LOS ROLES
// ========================================

const obtenerRoles = async (req, res) => {

    try {

        const roles = await Rol.findAll();

        res.status(200).json(roles);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: 'Error al obtener los roles',
            error: error.message
        });

    }

};


// ========================================
// OBTENER UN ROL POR ID
// ========================================

const obtenerRolPorId = async (req, res) => {

    try {

        const { id } = req.params;

        const rol = await Rol.findByPk(id);

        if (!rol) {

            return res.status(404).json({
                mensaje: 'Rol no encontrado'
            });

        }

        res.status(200).json(rol);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: 'Error al obtener el rol',
            error: error.message
        });

    }

};


// ========================================
// CREAR ROL
// ========================================

const crearRol = async (req, res) => {

    try {

        const { nombre, descripcion, activo } = req.body;

        // Validar nombre
        if (!nombre) {

            return res.status(400).json({
                mensaje: 'El nombre del rol es obligatorio'
            });

        }

        const rol = await Rol.create({
            nombre,
            descripcion,
            activo: activo !== undefined ? activo : true
        });

        res.status(201).json({
            mensaje: 'Rol creado correctamente',
            rol
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: 'Error al crear el rol',
            error: error.message
        });

    }

};


// ========================================
// ACTUALIZAR ROL
// ========================================

const actualizarRol = async (req, res) => {

    try {

        const { id } = req.params;

        const rol = await Rol.findByPk(id);

        if (!rol) {

            return res.status(404).json({
                mensaje: 'Rol no encontrado'
            });

        }

        const { nombre, descripcion, activo } = req.body;

        await rol.update({
            nombre,
            descripcion,
            activo
        });

        res.status(200).json({
            mensaje: 'Rol actualizado correctamente',
            rol
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: 'Error al actualizar el rol',
            error: error.message
        });

    }

};


// ========================================
// ELIMINAR ROL
// ========================================

const eliminarRol = async (req, res) => {

    try {

        const { id } = req.params;

        const rol = await Rol.findByPk(id);

        if (!rol) {

            return res.status(404).json({
                mensaje: 'Rol no encontrado'
            });

        }

        await rol.destroy();

        res.status(200).json({
            mensaje: 'Rol eliminado correctamente'
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: 'Error al eliminar el rol',
            error: error.message
        });

    }

};


// ========================================
// EXPORTAR FUNCIONES
// ========================================

module.exports = {
    obtenerRoles,
    obtenerRolPorId,
    crearRol,
    actualizarRol,
    eliminarRol
};