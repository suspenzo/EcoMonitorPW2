
const express = require('express');

const router = express.Router();

const {
    obtenerRolPermisos,
    obtenerRolPermisoPorId,
    crearRolPermiso,
    eliminarRolPermiso
} = require('../controllers/Rol_PermisoController');


// Obtener todos los Rol_Permisos
router.get('/', obtenerRolPermisos);

// Obtener un Rol_Permiso específico
router.get('/:id', obtenerRolPermisoPorId);

// Crear un Rol_Permiso
router.post('/', crearRolPermiso);


// Eliminar un Rol_Permiso
router.delete('/:id', eliminarRolPermiso);


module.exports = router;