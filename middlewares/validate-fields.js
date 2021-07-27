const { validationResult } = require('express-validator');

/**
 * Middleware personalizado
 * Centraliza la respuesta de las validaciones con status de respuesta 400
 * Se utiliza esto para no tener el mismo código en todos los métodos del controller
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
const validateFields = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json(errors);
    }

    // El request continua con el siguiente middleware
    next();
};

module.exports = {
    validateFields,
};