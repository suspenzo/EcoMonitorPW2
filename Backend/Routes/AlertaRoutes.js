
const express = require('express');

const router = express.Router();

const {
    obtenerAlertas,
    obtenerAlertaPorId,
    crearAlerta,
    actualizarAlerta,
    eliminarAlerta
} = require('../controllers/AlertaController');


// Obtener todos los Alertas
router.get('/', obtenerAlertas);

// Obtener un Alerta específica
router.get('/:id', obtenerAlertaPorId);

// Crear un Alerta
router.post('/', crearAlerta);

// Actualizar un Alerta
router.put('/:id', actualizarAlerta);

// Eliminar un Alerta
router.delete('/:id', eliminarAlerta);


module.exports = router;