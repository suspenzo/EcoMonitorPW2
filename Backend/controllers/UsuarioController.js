const Usuario = require('../models/Usuario');
const Rol = require('../models/Rol');

const bcrypt = require('bcrypt');

// GET /api/usuarios
const obtenerUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.findAll({
            include: {
                model: Rol
            },
            attributes: { exclude: ['password_hash'] }
        });

        res.status(200).json(usuarios);

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al obtener los usuarios',
            error: error.message
        });
    }
};


// GET /api/usuarios/:id
const obtenerUsuarioPorId = async (req, res) => {
    try {
        const { id } = req.params;

        const usuario = await Usuario.findByPk(id, {
            include: {
                model: Rol
            },
            attributes: { exclude: ['password_hash'] }
        });

        if (!usuario) {
            return res.status(404).json({
                mensaje: 'Usuario no encontrado'
            });
        }

        res.status(200).json(usuario);

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al obtener el usuario',
            error: error.message
        });
    }
};


// POST /api/usuarios
const crearUsuario = async (req, res) => {
    try {
        const {
            id_rol,
            nombre,
            apellido,
            usuario,
            correo,
            password,
            activo
        } = req.body;

        // Verificar que se haya enviado una contraseña
        if (!password) {
            return res.status(400).json({
                mensaje: 'La contraseña es obligatoria'
            });
        }

        // Generar hash de la contraseña
        const password_hash = await bcrypt.hash(password, 10);

        // Crear usuario en la base de datos
        const nuevoUsuario = await Usuario.create({
            id_rol,
            nombre,
            apellido,
            usuario,
            correo,
            password_hash,
            activo
        });

        // No devolver el password_hash
        const usuarioRespuesta = {
            id_usuario: nuevoUsuario.id_usuario,
            id_rol: nuevoUsuario.id_rol,
            nombre: nuevoUsuario.nombre,
            apellido: nuevoUsuario.apellido,
            usuario: nuevoUsuario.usuario,
            correo: nuevoUsuario.correo,
            activo: nuevoUsuario.activo,
            ultimo_acceso: nuevoUsuario.ultimo_acceso,
            fecha_creacion: nuevoUsuario.fecha_creacion,
            fecha_actualizacion: nuevoUsuario.fecha_actualizacion
        };

        res.status(201).json({
            mensaje: 'Usuario creado correctamente',
            usuario: usuarioRespuesta
        });

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al crear el usuario',
            error: error.message
        });
    }
};


// PUT /api/usuarios/:id
const actualizarUsuario = async (req, res) => {
    try {
        const { id } = req.params;

        const usuarioEncontrado = await Usuario.findByPk(id);

        if (!usuarioEncontrado) {
            return res.status(404).json({
                mensaje: 'Usuario no encontrado'
            });
        }

        const {
            id_rol,
            nombre,
            apellido,
            usuario: nombreUsuario,
            correo,
            password,
            activo
        } = req.body;

        // Datos que se actualizarán
        const datosActualizados = {
            id_rol,
            nombre,
            apellido,
            usuario: nombreUsuario,
            correo,
            activo
        };

        // Si se envía una nueva contraseña,
        // generar un nuevo hash
        if (password) {
            datosActualizados.password_hash =
                await bcrypt.hash(password, 10);
        }

        await usuarioEncontrado.update(datosActualizados);

        res.status(200).json({
            mensaje: 'Usuario actualizado correctamente',
            usuario: {
                id_usuario: usuarioEncontrado.id_usuario,
                id_rol: usuarioEncontrado.id_rol,
                nombre: usuarioEncontrado.nombre,
                apellido: usuarioEncontrado.apellido,
                usuario: usuarioEncontrado.usuario,
                correo: usuarioEncontrado.correo,
                activo: usuarioEncontrado.activo,
                ultimo_acceso: usuarioEncontrado.ultimo_acceso,
                fecha_creacion: usuarioEncontrado.fecha_creacion,
                fecha_actualizacion: usuarioEncontrado.fecha_actualizacion
            }
        });

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al actualizar el usuario',
            error: error.message
        });
    }
};


// DELETE /api/usuarios/:id
const eliminarUsuario = async (req, res) => {
    try {
        const { id } = req.params;

        const usuario = await Usuario.findByPk(id);

        if (!usuario) {
            return res.status(404).json({
                mensaje: 'Usuario no encontrado'
            });
        }

        await usuario.destroy();

        res.status(200).json({
            mensaje: 'Usuario eliminado correctamente'
        });

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al eliminar el usuario',
            error: error.message
        });
    }
};


module.exports = {
    obtenerUsuarios,
    obtenerUsuarioPorId,
    crearUsuario,
    actualizarUsuario,
    eliminarUsuario
};