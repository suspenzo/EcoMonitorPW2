const express = require('express');

const router = express.Router();

const {
    obtenerAreas,
    obtenerAreaPorId,
    crearArea,
    actualizarArea,
    eliminarArea
} = require('../controllers/AreaController');


// Obtener todos los Areas
router.get('/', obtenerAreas);

// Obtener un Area específica
router.get('/:id', obtenerAreaPorId);

// Crear un Area
router.post('/', crearArea);

// Actualizar un Area
router.put('/:id', actualizarArea);

// Eliminar un Area
router.delete('/:id', eliminarArea);


module.exports = router;