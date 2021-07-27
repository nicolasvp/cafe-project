const mongoose = require('mongoose');
const messages = require('../utils/messages');

/**
 * Configuración de la conexion a la base de datos utilizando el ODM(Object data modeler) para mongo 'mongoose'
 */
const dbConnection = async() => {
    try {
        await mongoose.connect(process.env.MONGODB_CNN, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false,
        });

        console.log(messages.DATABASE_INIT_SUCCESS);
    } catch (error) {
        console.log(error);
        throw new Error(messages.DATABASE_INIT_ERROR);
    }
};

module.exports = {
    dbConnection,
};