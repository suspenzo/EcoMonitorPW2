
const express = require('express');

const router = express.Router();

const {
    obtenerTarifas,
    obtenerTarifaPorId,
    crearTarifa,
    actualizarTarifa,
    eliminarTarifa
} = require('../controllers/TarifaController');


// Obtener todos los Tarifas
router.get('/', obtenerTarifas);

// Obtener un Tarifa específico
router.get('/:id', obtenerTarifaPorId);

// Crear un Tarifa
router.post('/', crearTarifa);

// Actualizar un Tarifa
router.put('/:id', actualizarTarifa);

// Eliminar un Tarifa
router.delete('/:id', eliminarTarifa);


module.exports = router;