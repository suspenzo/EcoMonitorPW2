
const express = require('express');

const router = express.Router();

const {
    obtenerRecursos,
    obtenerRecursoPorId,
    crearRecurso,
    actualizarRecurso,
    eliminarRecurso
} = require('../controllers/RecursoController');


// Obtener todos los recursos
router.get('/', obtenerRecursos);

// Obtener un recurso específico
router.get('/:id', obtenerRecursoPorId);

// Crear un recurso
router.post('/', crearRecurso);

// Actualizar un recurso
router.put('/:id', actualizarRecurso);

// Eliminar un recurso
router.delete('/:id', eliminarRecurso);

module.exports = router;