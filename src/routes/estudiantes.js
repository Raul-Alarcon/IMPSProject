const express = require('express');
const router = express.Router();
const queries = require('../repositories/EstudianteRepository');

// Endpoint para mostrar todos los estudiantes
router.get('/', async (request, response) => {
    try {
        const estudiantes = await queries.obtenerTodosLosEstudiantes();
        response.render('estudiantes/listado', { estudiantes });
    } catch (error) {
        console.error('Error al obtener estudiantes:', error);
        response.status(500).send('Error al obtener estudiantes');
    }
});

// Endpoint que permite mostrar el formulario para agregar un nuevo estudiante
router.get('/agregar', async (request, response) => {
    try {
        const carreras = await queries.obtenerTodasLasCarreras(); // Obtener todas las carreras
        console.log('Carreras disponibles:', carreras);
        response.render('estudiantes/agregar', { carreras });
    } catch (error) {
        console.error('Error al cargar el formulario de agregar estudiante:', error);
        response.status(500).send('Error al cargar el formulario de agregar estudiante');
    }
});

// Endpoint para agregar un estudiante
router.post('/agregar', async (request, response) => {
    // Falta agregar logica 
    const { idestudiante, nombre, apellido, email, idcarrera, usuario } = request.body;
    try {
        // Validar que se haya seleccionado una carrera
        if (!idcarrera || idcarrera === "0") {
            const carreras = await queries.obtenerTodasLasCarreras();
            return response.render('estudiantes/agregar', {
                carreras,
                mensaje: 'Debe seleccionar una carrera válida'
            });
        }
        const resultado = await queries.agregarEstudiante(idestudiante, nombre, apellido, email, idcarrera, usuario);
        if (resultado) {
            console.log('Estudiante agregado con éxito');
            response.redirect('/estudiantes');
        } else {
            const carreras = await queries.obtenerTodasLasCarreras();
            response.render('estudiantes/agregar', {
                carreras,
                mensaje: 'Error al agregar estudiante'
            });
        }
    } catch (error) {
        console.error('Error al agregar estudiante:', error);
        const carreras = await queries.obtenerTodasLasCarreras();
        response.render('estudiantes/agregar', {
            carreras,
            mensaje: 'Error al agregar estudiante: ' + error.message
        });
    }
});

// Endpoint para mostrar el formulario de actualización de un estudiante
router.get('/actualizar/:idestudiante', async (request, response) => {
    const { idestudiante } = request.params;
    try {
        const estudiante = await queries.obtenerEstudiantePorId(idestudiante);
        const carreras = await queries.obtenerTodasLasCarreras(); // Obtener todas las carreras

        if (estudiante) {
            const [carreraSeleccionada] = carreras.filter(carrera => carrera.idcarrera === estudiante.idcarrera);
            console.log('carreraSeleccionada', carreraSeleccionada);
            response.render('estudiantes/actualizar', { estudiante, carreras,  carreraSeleccionada}); // Asegúrate de que carreras sea un array
        } else {
            response.status(404).send('Estudiante no encontrado');
        }
    } catch (error) {
        console.error('Error al obtener estudiante para actualizar:', error);
        response.status(500).send('Error al obtener estudiante para actualizar');
    }
});


// Endpoint para actualizar un estudiante
router.post('/actualizar/:idestudiante', async (request, response) => {
    const { idestudiante } = request.params;
    const { nombre, apellido, email, idcarrera, usuario } = request.body;
    try {
        const resultado = await queries.actualizarEstudiante(idestudiante, nombre, apellido, email, idcarrera, usuario);
        if (resultado) {
            console.log('Estudiante actualizado con éxito');
            response.redirect('/estudiantes');
        } else {
            console.log('Error al actualizar estudiante');
            response.status(500).send('Error al actualizar estudiante');
        }
    } catch (error) {
        console.error('Error al actualizar estudiante:', error);
        response.status(500).send('Error al actualizar estudiante');
    }
});

// Endpoint que permite eliminar un estudiante
router.get('/eliminar/:idestudiante', async (request, response) => {
    // Desestructuramos el objeto que nos mandan en la peticion y extraemos el idestudiante
    const { idestudiante } = request.params;
    try {
        const resultado = await queries.eliminarEstudiante(idestudiante);
        if (resultado) {
            console.log('Estudiante eliminado con éxito');
        } else {
            console.log('No se pudo eliminar el estudiante');
        }
        response.redirect('/estudiantes');
    } catch (error) {
        console.error('Error al eliminar estudiante:', error);
        response.status(500).send('Error al eliminar estudiante');
    }
});
module.exports = router;