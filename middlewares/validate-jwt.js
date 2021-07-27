const { response, request } = require("express");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const messages = require("../utils/messages");

/**
 * Middleware custom para validar el token que viene en un request
 * Verifica que el token venga en los headers
 * Verifica que la firma sea válida
 * Verifica que el usuario exista en la base de datos
 * Verifica que el estado del usuario sea true en la base de datos
 * @param {*} req Request entrante desde el cliente
 * @param {*} res Response que se retornará
 * @param {*} next
 * @returns
 */
const validateJWT = async(req = request, res = response, next) => {
    // Se extrae el token desde los headers, separando el Bearer del header
    const token = req.header("Authorization") ?
        req.header("Authorization").split(" ")[1] :
        null;

    // Verifica que el token haya sido extraido
    if (!token) {
        return res.status(401).json({
            msg: messages.TOKEN_NOT_PRESENT_ERROR,
        });
    }

    try {
        // Verifica que la firma del token sea válido utilizando el método .verify de la libreria 'jsonwebtoken', usando como base la 'SECRET_KEY' definida en el archivo .env
        const { uid } = jwt.verify(token, process.env.SECRET_KEY);

        // Busca el usuario en la base de datos segun el id que se encuentra en el payload del token
        const user = await User.findById(uid);

        // Si el usuario no existe en la base de datos retorna un error 401
        if (!user) {
            return res.status(401).json({
                msg: messages.INVALID_TOKEN_USER_ERROR,
            });
        }

        // Verifica que el estado del usuario sea true en la base de datos.
        if (!user.status) {
            return res.status(401).json({
                msg: messages.INVALID_TOKEN_STATUS_ERROR,
            });
        }

        req.user = user;

        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg: messages.INVALID_TOKEN_ERROR,
        });
    }
};

module.exports = {
    validateJWT,
};