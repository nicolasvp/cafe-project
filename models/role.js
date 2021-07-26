const { Schema, model } = require('mongoose');

/**
 * Definición del Schema de la tabla(collection) Role
 * Se define el tipo de dato y si es requerido y su mensaje en caso de no cumplirse la condición
 */
const RoleSchema = Schema({
    name: {
        type: String,
        required: [true, 'Role is mandatory']
    }
});

/**
 * Se debe declarar en singular, mongo le añade la s por lo que en la db quedaría Roles
 */
module.exports = model('Role', RoleSchema);