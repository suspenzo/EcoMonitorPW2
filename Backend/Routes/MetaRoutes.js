
const express = require('express');

const router = express.Router();

const {
    obtenerMetas,
    obtenerMetaPorId,
    crearMeta,
    actualizarMeta,
    eliminarMeta
} = require('../controllers/MetaController');


// Obtener todos los Metas
router.get('/', obtenerMetas);

// Obtener un Meta específica
router.get('/:id', obtenerMetaPorId);

// Crear un Meta
router.post('/', crearMeta);

// Actualizar una Meta
router.put('/:id', actualizarMeta);

// Eliminar una Meta
router.delete('/:id', eliminarMeta);


module.exports = router;