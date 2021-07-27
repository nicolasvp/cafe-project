// Se declaran response y request desde express para obtener el tipado(metodos) que están en req y res de los parámetros
const { response, request } = require('express');

// Dependencia para encriptar un string(password) utilizando bcrypt
const bcryptjs = require('bcryptjs');

const User = require('../models/user');

/**
 * Recibe las peticiones realizadas mediante el método GET
 * Se buscan todos los usuarios según los limites que se pasen por parametro
 * Por defecto el límite max es 5
 * Se declara el tipo 'res = response' para obtener los metodos asociados al tipo de dato de 'res'
 * Se declara el tipo 'req = request' para obtener los metodos asociados al tipo de dato de 'req'
 * @param {*} req Request de la petición entrante
 * @param {*} res Response de la petición
 */
const usersGet = async(req = request, res = response) => {
    /**
     * Se declaran las variables q, name, apikey, page, to para las cuales sus valores se extraen usando 'req.query' desde los parametros que se pasan por URL como query.
     * Ej de URL con query: /api/users?q=1&name=nicolas&apikey=2131&page=3&to=1
     * En la URL el signo '?' indica que todos los parametros que vienen a continuación son opcionales y se concatenan con el signo '&'.
     * En la declaración de variables, si no vienen los parametros indicados, se asigna un valor por defecto. Ej: name = 'No name' en el caso que en req.query no viniera
     * ninguna variable con ese nombre.
     */
    const { to = 5, from = 0 } = req.query;
    const query = { status: true };

    /**
     * Realiza 2 queries
     * 1. Contando todos los registros de usuarios que esten con status: true
     * 2. Busca todos los usuarios entre los rangos que se definan en 'from' y 'to'
     */
    const [total, users] = await Promise.all([
        User.countDocuments(query),
        User.find(query).skip(Number(from)).limit(Number(to)),
    ]);

    res.json({
        total,
        users,
    });
};

/**
 * Recibe las peticiones realizadas mediante el método POST, obtiene el name y age del body del request y los devuelve en la respuesta.
 * Se declara el tipo 'res = response' para obtener los metodos asociados al tipo de dato de 'res'
 * 'async' se utiliza ya que las llamadas a la base de datos son asincronas y se utiliza 'await'
 * @param {*} req Request de la petición entrante
 * @param {*} res Response de la petición
 */
const usersPost = async(req, res = response) => {
    const { name, email, password, role } = req.body;
    const user = new User({ name, email, password, role });

    // Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    user.password = bcryptjs.hashSync(password, salt);

    // Guardar en BD
    await user.save();

    res.json({
        user,
    });
};

/**
 * Recibe las peticiones realizadas mediante el método PUT.
 * Obtiene el 'id' pasado como parametro en la URL, busca el usuario mediante el id y actualiza todos los campos que se le hallan pasado por el request
 * Se declara el tipo 'res = response' para obtener los metodos asociados al tipo de dato de 'res'
 * @param {*} req Request de la petición entrante, contiene el id y los atributos a actualizar
 * @param {*} res Response de la petición, retorna el usuario actualizado
 */
const usersPut = async(req, res = response) => {
    const { id } = req.params;
    const { _id, password, google, email, ...args } = req.body;

    // Si se pasó el password como parte del request body, se actualiza encriptandola nuevamente
    if (password) {
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync(password, salt);
    }

    const user = await User.findByIdAndUpdate(id, args);

    res.json(user);
};

/**
 * Recibe las peticiones realizadas mediante el método PATCH, retorna un mensaje.
 * Se declara el tipo 'res = response' para obtener los metodos asociados al tipo de dato de 'res'
 * @param {*} req Request de la petición entrante
 * @param {*} res Response de la petición
 */
const usersPatch = (req, res = response) => {
    res.json({
        msg: 'API - PATCH method',
    });
};

/**
 * Recibe las peticiones realizadas mediante el método DELETE.
 * Busca el usuario mediante el id y lo desactiva seteando el status a false.
 * Se declara el tipo 'res = response' para obtener los metodos asociados al tipo de dato de 'res'
 * @param {*} req Request de la petición entrante, contiene el id para buscar al usuario
 * @param {*} res Response de la petición, retorna el usuario actualizado(que se desactivó)
 */
const usersDelete = async(req, res = response) => {
    const { id } = req.params;

    // Fisicamente lo borramos
    // const usuario = await Usuario.findByIdAndDelete( id );

    const user = await User.findByIdAndUpdate(id, { status: false });

    res.json(user);
};

module.exports = {
    usersGet,
    usersPost,
    usersPut,
    usersPatch,
    usersDelete,
};