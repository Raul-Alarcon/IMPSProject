const express = require('express');
const router = express.Router();
const queries = require('../repositories/CarrerasRepository');

// Endpoint para mostrar todas las carreras
router.get('/', async (request, response) => {
    try {
        const carreras = await queries.obtenerTodasLasCarreras();
        response.render('carreras/listado', { carreras });
    } catch (error) {
        console.error('Error al obtener carreras:', error);
        response.redirect('/carreras');
    }
});


// Endpoint que permite mostrar el formulario para agregar una nueva carrera
router.get('/agregar', (request, response) => {
    try {
        response.render('carreras/agregar');
        
    } catch (error) {
        console.error('Error al cargar el formulario de agregar estudiante:', error);
        response.status(500).send('Error al cargar el formulario de agregar carrera');
    }
});

router.post('/agregar', async (request, response) => {
    const { idcarrera, carrera } = request.body;
    try {
        const resultado = await queries.agregarCarrera(idcarrera, carrera);
        if (resultado) {
            // Establecer el mensaje flash de éxito
            console.log('Mensaje flash agregado: Carrera agregada con éxito');
            // Redirigir a la página de carreras
            return response.redirect('/carreras');
        } else {
            response.render('carreras/agregar', {
                mensaje: 'Error al agregar carrera: ' + error.message
            });
        }
    } catch (error) {
        console.error('Error al agregar carrera:', error);
        response.render('carreras/agregar', {
            mensaje: 'Error al agregar carrera: ' + error.message
        });
    }
});


// Endpoint para mostrar el formulario de actualización de una carrera
router.get('/actualizar/:idcarrera', async (request, response) => {
    const { idcarrera } = request.params;
    try {
        const carrera = await queries.obtenerCarreraPorId(idcarrera);
        if (carrera) {
            response.render('carreras/actualizar', { id: carrera.idcarrera, nombre: carrera.carrera });
        } else {
            response.status(404).send('Carrera no encontrado');
        }
    } catch (error) {
        console.error('Error al obtener carrera para actualizar:', error);
        response.status(500).send('Error al obtener carrera para actualizar');
    }
});

// Endpoint para actualizar una carrera
router.post('/actualizar/:idcarrera', async (request, response) => {
    const { idcarrera } = request.body; // Ahora tomamos el nuevo ID del cuerpo
    const { carrera } = request.body; // Obtenemos el nombre de la carrera
    try {
        const resultado = await queries.actualizarCarrera(idcarrera, carrera); // Usa el nuevo ID
        if (resultado) {  
            console.log('Estudiante actualizado con éxito');
            response.redirect('/carreras');
        } else {
            console.error('Error al actualizar carrera:', error);
            response.status(500).send('Error al actualizar carrera');
        }
    } catch (error) {
        console.error('Error al actualizar carrera:', error);
        response.status(500).send('Error al actualizar carrera');
    }
});

router.get('/eliminar/:idcarrera', async (req, res) => {
    const { idcarrera } = req.params;
    try {
        const resultado = await queries.eliminarCarrera(idcarrera);
        if (resultado > 0) {
            console.log('Carrera eliminada con éxito');
        } else {
            console.log('No se pudo eliminar la carrera');
        }
        console.log('Redireccionando después de eliminar carrera');
        res.redirect('/carreras');
    } catch (error) {
        console.error('Error al eliminar carrera:', error);
        res.status(500).redirect('/carreras');
    }
});
module.exports = router;