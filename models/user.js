const { Schema, model } = require('mongoose');

/**
 * Definición del Schema de la tabla(collection) Users
 * Se definen los tipos de datos y si son requeridos y sus mensajes en caso de no cumplirse la condición
 * Se definen los roles permitidos 'ADMIN_ROLE' y 'USER_ROLE'
 */
const UserSchema = Schema({
    name: {
        type: String,
        required: [true, 'Field name is mandatory'],
    },
    email: {
        type: String,
        required: [true, 'Field email is mandatory'],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Field password is mandatory'],
    },
    img: {
        type: String,
    },
    role: {
        type: String,
        required: true,
        emun: ['ADMIN_ROLE', 'USER_ROLE'],
    },
    status: {
        type: Boolean,
        default: true,
    },
    google: {
        type: Boolean,
        default: false,
    },
});

/**
 * IMPORTANTE: Este método es especialmente importante para cuando se maneja información sensible como passwords, etc.
 * Se sobreescribe el método toJSON de mongoose
 * Se especifica los campos que se quieren remover de las respuestas que se den cuando se utiliza este modelo
 * Se quitan los campos '__v' que corresponde a la versión y 'password' para que no lo retorne al usuario
 * Se guardan el resto de los campos en 'user'(por eso se utiliza el operador '...') para finalmente retornarlos
 * @returns usuario
 */
UserSchema.methods.toJSON = function() {
    const { __v, password, ...user } = this.toObject();
    return user;
};

/**
 * Se debe declarar en singular, mongo le añade la s por lo que en la db quedaría Users
 */
module.exports = model('User', UserSchema);