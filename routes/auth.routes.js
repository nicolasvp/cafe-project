const { Router } = require('express');
const { check } = require('express-validator');

const { validateFields } = require('../middlewares/validate-fields');

const { login } = require('../controllers/auth.controller');

const messages = require('../utils/messages');

const router = Router();

/**
 * Rutas relacionadas con la autenticación de usuario
 * Se aplican validaciones para el email y el password
 * Se utiliza el helper validateFields para centralizar la respuesta en caso de que una validación falle.
 */
router.post(
    '/login', [
        check('email', messages.EMAIL_IS_PRESENT_VALIDATION).isEmail(),
        check('password', messages.PASSWORD_IS_PRESENT_VALIDATION).not().isEmpty(),
        validateFields,
    ],
    login
);

module.exports = router;