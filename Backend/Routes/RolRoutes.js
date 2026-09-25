
const express = require('express');

const router = express.Router();

const {
    obtenerRoles,
    obtenerRolPorId,
    crearRol,
    actualizarRol,
    eliminarRol
} = require('../controllers/RolController');


// Obtener todos los roles
router.get('/', obtenerRoles);

// Obtener un rol específico
router.get('/:id', obtenerRolPorId);

// Crear un rol
router.post('/', crearRol);

// Actualizar un rol
router.put('/:id', actualizarRol);

// Eliminar un rol
router.delete('/:id', eliminarRol);


module.exports = router;