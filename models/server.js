const express = require("express");
const cors = require("cors");

// Se importa la configuración realizada en el archivo config en el directorio database
const { dbConnection } = require("../database/config");


/**
 * Definición del servidor del API en cual se indican las configuraciones que tendrá
 * framework, puerto, rutas, middlewares
 */
class Server {
    /**
     * Definición de las propiedades del servidor
     * 1. Se define el uso de express
     * 2. Se define el puerto que utilizará, el cual se configura a través del archivo .env
     * 3. Se define la ruta base del API
     * 4. Realiza la conección a la base de datos
     * 5. Setea los middlewares que se aplicarán
     * 6. Setea las rutas del servidor
     */
    constructor() {
        this.app = express();
        this.PORT = process.env.PORT;
        this.BASE_PATH = "/api/users";

        // Conectar a base de datos
        this.connectDB();

        // Middlewares
        this.middlewares();

        // Rutas de mi aplicación
        this.routes();
    }

    async connectDB() {
        await dbConnection();
    }

    /**
     * Se definen los middlewares que se utilizarán para todas las peticiones al API
     */
    middlewares() {
        // CORS para peticiones cross domain
        this.app.use(cors());

        // Lectura y parseo del body, esto permite que cualquier información que llegue al API se parsee a json
        this.app.use(express.json());

        // Directorio Público, se indica el directorio que servirá un html
        this.app.use(express.static("public"));
    }

    /**
     * Se indica en las rutas que se utilizará como base del API la ruta definida en la variable 'BASE_PATH' y las rutas que están definidas en el archivo 'users.routes'
     */
    routes() {
        this.app.use(this.BASE_PATH, require("../routes/users.routes"));
    }

    /**
     * Se define el puerto en el cual el servidor estará escuchando las peticiones al API
     */
    listen() {
        this.app.listen(this.PORT, () => {
            console.log("Server running on port:", this.PORT);
        });
    }
}

module.exports = Server;