const express = require('express');
const router = express.Router();

const {
    obtenerUmbrales,
    obtenerUmbralPorId,
    crearUmbral,
    actualizarUmbral,
    eliminarUmbral
} = require('../controllers/UmbralController');

// Obtener todos los umbrales
router.get('/', obtenerUmbrales);

// Obtener un umbral específico
router.get('/:id', obtenerUmbralPorId);

// Crear un umbral
router.post('/', crearUmbral);

// Actualizar un umbral
router.put('/:id', actualizarUmbral);

// Eliminar un umbral
router.delete('/:id', eliminarUmbral);

module.exports = router;