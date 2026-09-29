
const express = require('express');

const router = express.Router();

const {
    obtenerIncidentes,
    obtenerIncidentePorId,
    crearIncidente,
    actualizarIncidente,
    eliminarIncidente
} = require('../controllers/IncidenteController');


// Obtener todos los Incidentes
router.get('/', obtenerIncidentes);

// Obtener un Incidente específico
router.get('/:id', obtenerIncidentePorId);

// Crear un Incidente
router.post('/', crearIncidente);

// Actualizar un Incidente
router.put('/:id', actualizarIncidente);

// Eliminar un Incidente
router.delete('/:id', eliminarIncidente);


module.exports = router;