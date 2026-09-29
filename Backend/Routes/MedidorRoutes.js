
const express = require('express');

const router = express.Router();

const {
    obtenerMedidores,
    obtenerMedidorPorId,
    crearMedidor,
    actualizarMedidor,
    eliminarMedidor
} = require('../controllers/MedidorController');


// Obtener todos los Medidors
router.get('/', obtenerMedidores);

// Obtener un Medidor específico
router.get('/:id', obtenerMedidorPorId);

// Crear un Medidor
router.post('/', crearMedidor);

// Actualizar un Medidor
router.put('/:id', actualizarMedidor);

// Eliminar un Medidor
router.delete('/:id', eliminarMedidor);


module.exports = router;