const Role = require("../models/role");
const User = require("../models/user");


/**
 * Helper para centralización de validaciones custom
 * Validadores que se utilizan consultando a la base de datos para verificar si los datos de los request ya se encuentran o no en la base de datos
 */



/**
 * Verifica si el role consultado existe en la base de datos
 * @param {*} role
 */
const validRole = async(role = "") => {
    const roleExist = await Role.findOne({ role });

    // Si no existe el rol en la base de datos, lanza un error indicando que no existe
    if (!roleExist) {
        throw new Error(`Role '${role}', does not exists in database`);
    }
};

/**
 * Verifica si el correo consulta existe en la base de datos
 * @param {*} email
 */
const emailExists = async(email = "") => {
    // Verificar si el correo existe
    const emailExist = await User.findOne({ email });

    // Si existe el correo en la base de datos, lanza un error indicando que ya existe
    if (emailExist) {
        throw new Error(`Email '${email}', already exists in database`);
    }
};

/**
 * Verifica si el usuario existe en la base de datos, buscandolo por el id
 * @param {*} id
 */
const userExistById = async(id) => {
    const user = await User.findById(id);

    // Si no existe el usuario en la base de datos, lanza un error indicando que no existe
    if (!user) {
        throw new Error(`User with id '${id}', does not exists in database`);
    }
};

module.exports = {
    validRole,
    emailExists,
    userExistById,
};