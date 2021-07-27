# API REST

Proyecto de API REST sobre cafe, contiene las siguientes características:

- CRUD de usuarios.
- Autenticación y validación de tokens JWT y sistema de roles.
- Middlewares.
- Estructuración de directorios para API REST.
- Validaciones personalizadas para datos de entrada.
- Configuración y conexión a base de datos MongoDB con mongoose.
- Lectura de propiedades desde archivos .env.
- Archivo docker-compose.yml para levantar base de datos en local con docker.
- Postman collection para testear rutas.

Recordar que se debe ejecutar ```npm install``` para reconstruir los módulos de Node.

# Para ejecutar en local

```nodemon app```

* Se debe crear el archivo .env tomando como base el archivo .example.env

* Se debe crear la collection 'Roles':

- role: ADMIN_ROLE
- role: USER_ROLE
- role: SALES_ROLE


# Librerias utilizadas

- bcryptjs: encriptación de passwords de una sola via utilizando un salt.
- cors: petición cruzadas desde distintos dominios.
- dotenv: lectura de variables desde un archivo .env
- express: framework base para api.
- express-validator: validaciones para datos de entrada.
- jsonwebtoken: generación y validación de jwt para autenticación.
- mongoose: ODM(object data modeler) para mongodb.