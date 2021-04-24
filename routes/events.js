
const { Router } = require('express');
const { check } = require('express-validator');
const { getEventos, crearEvento, actualizarEvento, eliminarEvento } = require('../controllers/events');
const { isDate } = require('../helpers/isDate');
const { validarCampos } = require('../middlewares/validar-campos');
const router = Router()
const { validarJWT } = require('../middlewares/validar-jwt')

router.use( validarJWT )

router.get('/', getEventos ) 

router.post('/', 
            [
                check('title', 'El título es obligatorio').not().isEmpty(),
                check('start', 'Fecha de inicio es obligaotia').custom(isDate),
                check('end', 'Fecha de finalizacion es obligatoria').custom(isDate),
                validarCampos
            ],
            crearEvento )

router.put('/:id', [
    check('title', 'El título es obligatorio').not().isEmpty(),
    check('start', 'Fecha de inicio es obligaotia').custom(isDate),
    check('end', 'Fecha de finalizacion es obligatoria').custom(isDate),
    validarCampos
],actualizarEvento )

router.delete('/:id', eliminarEvento) 

module.exports = router;