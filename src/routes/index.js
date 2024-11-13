const express = require('express');
const router = express.Router();
const EstudianteRepository = require('../repositories/EstudianteRepository');
const CarrerasRepository = require('../repositories/CarrerasRepository');

router.get('/', async(request, response) => {
    const lstEstudiantes = await EstudianteRepository.obtenerTodosLosEstudiantes();
    console.log("Listado: ",lstEstudiantes);
    response.send("Bienvenido al lab de IMPS");
});

module.exports = router;