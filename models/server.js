const express = require("express");
const cors = require("cors");

// Se importa la configuración realizada en el archivo config en el directorio database
const { dbConnection } = require("../database/config");

const messages = require("../utils/messages");

/**
 * Definición del servidor del API en cual se indican las configuraciones que tendrá
 * framework, puerto, rutas, middlewares
 */
class Server {
    /**
     * Definición de las propiedades del servidor
     * 1. Se define el uso de express
     * 2. Se define el puerto que utilizará, el cual se configura a través del archivo .env
     * 3. Se define la ruta base del API para usuarios, autenticación, productos y categorias
     * 4. Realiza la conección a la base de datos
     * 5. Setea los middlewares que se aplicarán
     * 6. Setea las rutas del servidor
     */
    constructor() {
        this.app = express();
        this.PORT = process.env.PORT;
        this.USERS_BASE_PATH = "/api/users";
        this.AUTH_BASE_PATH = "/api/auth";
        this.CATEGORIES_BASE_PATH = "/api/categories";
        this.PRODUCTS_BASE_PATH = "/api/products";

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
     * Se indica en las rutas que se utilizarán como base del API, se importan desde los archivos .routes
     * La ruta definida en la variable 'USER_BASE_PATH' para los usuarios
     * La ruta definida en la variable 'AUTH_BASE_PATH' para la autenticación
     */
    routes() {
        this.app.use(this.AUTH_BASE_PATH, require("../routes/auth.routes"));
        this.app.use(this.USERS_BASE_PATH, require("../routes/users.routes"));
        this.app.use(
            this.CATEGORIES_BASE_PATH,
            require("../routes/categories.routes")
        );
        this.app.use(this.PRODUCTS_BASE_PATH, require("../routes/products.routes"));
    }

    /**
     * Se define el puerto en el cual el servidor estará escuchando las peticiones al API
     */
    listen() {
        this.app.listen(this.PORT, () => {
            console.log(messages.SERVER_UP, this.PORT);
        });
    }
}

module.exports = Server;