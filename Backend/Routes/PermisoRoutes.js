
const express = require('express');

const router = express.Router();

const {
    obtenerPermisos,
    obtenerPermisoPorId,
    crearPermiso,
    actualizarPermiso,
    eliminarPermiso
} = require('../controllers/PermisoController');


// Obtener todos los permisos
router.get('/', obtenerPermisos);

// Obtener un permiso específico
router.get('/:id', obtenerPermisoPorId);

// Crear un permiso
router.post('/', crearPermiso);

// Actualizar un permiso
router.put('/:id', actualizarPermiso);

// Eliminar un permiso
router.delete('/:id', eliminarPermiso);


module.exports = router;