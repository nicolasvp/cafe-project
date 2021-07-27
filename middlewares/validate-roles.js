const { response } = require('express');
const messages = require('../utils/messages');

/**
 * Verifica si el rol del usuario es de tipo admin 'ADMIN_ROLE'
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
const isAdminRole = (req, res = response, next) => {
    // Verifica que el usuario venga en el request
    if (!req.user) {
        return res.status(500).json({
            msg: messages.USER_NOT_PRESENT,
        });
    }

    const { role, name } = req.user;

    if (role !== 'ADMIN_ROLE') {
        return res.status(401).json({
            msg: messages.FORBIDDEN_ROLE,
        });
    }

    next();
};

/**
 * Verifica que el usuario tenga un rol asociado y esté dentro de los roles pasados en el argumento
 * @param  {...any} roles lista de roles del usuario
 * @returns
 */
const hasRole = (...roles) => {
    return (req, res = response, next) => {
        if (!req.user) {
            return res.status(500).json({
                msg: messages.USER_NOT_PRESENT,
            });
        }

        // Verifica que el rol del usuario se encuentre dentro de los roles permitidos
        if (!roles.includes(req.user.role)) {
            return res.status(401).json({
                msg: messages.INVALID_ROLE.roles,
            });
        }

        next();
    };
};

module.exports = {
    isAdminRole,
    hasRole,
};