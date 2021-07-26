const mongoose = require('mongoose');

/**
 * Configuración de la conexion a la base de datos utilizando el ODM para mongo 'mongoose'
 */
const dbConnection = async() => {
    try {
        await mongoose.connect(process.env.MONGODB_CNN, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        });

        console.log('Database online!');

    } catch (error) {
        console.log(error);
        throw new Error('There is an error initializing the database!');
    }
}

module.exports = {
    dbConnection
}