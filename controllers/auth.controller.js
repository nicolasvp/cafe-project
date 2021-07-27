// Se declara response desde express para obtener el tipado(metodos) que está en res de los parámetros
const { response } = require('express');
const bcryptjs = require('bcryptjs');

const User = require('../models/user');

// Se importa el helper de jwt para la generación de los tokens
const { generateJWT } = require('../helpers/generate-jwt');

const messages = require('../utils/messages');

/**
 * Método que verifica la autenticación utilizando el email y password en la base de datos.
 * Una vez que la valida genera un token con el id del usuario en el payload y luego retorna el usuario y el token.
 * @param {*} req
 * @param {*} res
 * @returns
 */
const login = async(req, res = response) => {
    const { email, password } = req.body;

    try {
        // Verifica si el email existe
        const user = await User.findOne({ email });

        // Si no existe el email retorna un mensaje con status 400
        if (!user) {
            return res.status(400).json({
                msg: messages.AUTH_USER_ERROR,
            });
        }

        // Verificación del estado del usuario, debe ser status = true para ser un usuario válido
        if (!user.status) {
            return res.status(400).json({
                msg: messages.AUTH_USER_STATUS_ERROR,
            });
        }

        // Verifica la contraseña ingresada contra la guardada en la base de datos
        const isPasswordValid = bcryptjs.compareSync(password, user.password);

        // Verifica si la respuesta es true o false
        if (!isPasswordValid) {
            return res.status(400).json({
                msg: messages.AUTH_USER_PASSWORD_ERROR,
            });
        }

        // Genera el token
        const token = await generateJWT(user.id);

        res.json({
            user,
            token,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: messages.ADMIN_ERROR,
        });
    }
};

module.exports = {
    login,
};