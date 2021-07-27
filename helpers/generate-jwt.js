const jwt = require('jsonwebtoken');
const messages = require('../utils/messages');

/**
 * Helper para la generación de un token válido.
 * @param {*} uid identificador del usuario en la base de datos
 * @returns token válido o mensaje de error de que falló algo
 */
const generateJWT = (uid = '') => {
    return new Promise((resolve, reject) => {
        const payload = { uid };

        /**
         * Se utiliza el método .sign de la libreria 'jsonwebtoken' donde se le pasa el payload creado anteriormente
         * Se le pasa el 'SECRET_KEY' indicado en el .env para firmar el token
         * Setea el payload(uid)
         * Se define una expiración de 4 horas(exp)
         * Genera por defecto la fecha de creación(iat)
         */
        jwt.sign(
            payload,
            process.env.SECRET_KEY, {
                expiresIn: '4h',
            },
            (err, token) => {
                if (err) {
                    console.log(err);
                    reject(messages.GENERATE_TOKEN_ERROR);
                } else {
                    resolve(token);
                }
            }
        );
    });
};

module.exports = {
    generateJWT,
};