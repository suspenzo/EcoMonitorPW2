
const express = require('express');

const router = express.Router();

const {
    obtenerLecturas,
    obtenerLecturaPorId,
    crearLectura,
    actualizarLectura,
    eliminarLectura
} = require('../controllers/LecturaController');


// Obtener todos los Lecturas
router.get('/', obtenerLecturas);

// Obtener un Lectura específico
router.get('/:id', obtenerLecturaPorId);

// Crear un Lectura
router.post('/', crearLectura);

// Actualizar un Lectura
router.put('/:id', actualizarLectura);

// Eliminar un Lectura
router.delete('/:id', eliminarLectura);


module.exports = router;