const { Router } = require("express");
const { check } = require("express-validator");

const {
    validateFields,
    validateJWT,
    hasRole,
    isAdminRole,
} = require("../middlewares");

const {
    validRole,
    emailExists,
    userExistById,
} = require("../helpers/database-validators");

const {
    usersGet,
    usersPut,
    usersPost,
    usersDelete,
    usersPatch,
} = require("../controllers/users.controller");
const messages = require("../utils/messages");

const router = Router();

router.get("/", [validateJWT], usersGet);

/**
 * Se indica que despues del '/' se debe pasar un parametro el cual representa un id
 * Se aplican validaciones custom(antes de ir al controller) y otras de express-validator sobre los campos id y role
 * los cuales son middlewares que se declaran en un arreglo como segundo parámetro
 * Al final de los check se verifican los errores con el middleware personalizado 'validateFields'
 */
router.put(
    "/:id", [
        validateJWT,
        check("id", messages.ID_VALIDATION).isMongoId(),
        check("id").custom(userExistById),
        check("role").custom(validRole),
        validateFields, // Middleware para verificar los errores
    ],
    usersPut
);

/**
 * Se aplican validaciones custom(antes de ir al controller) y otras de express-validator sobre los campos name, password, email, role
 * los cuales son middlewares que se declaran en un arreglo como segundo parámetro
 * Al final de los check se verifican los errores con el middleware personalizado 'validateFields'
 */
router.post(
    "/", [
        validateJWT,
        check("name", messages.NAME_PRESENT_VALIDATION).not().isEmpty(),
        check("password", messages.PASSWORD_LENGTH_VALIDATION).isLength({ min: 6 }),
        check("email", messages.EMAIL_FORMAT_VALIDATION).isEmail(),
        check("email").custom(emailExists),
        //check('role', 'Invalid role').isIn(['ADMIN_ROLE', 'USER_ROLE']), // Solo verifica contra el arreglo, no verifica contra la base de datos
        check("role").custom(validRole), // Verifica el rol contra la base de datos
        validateFields, // Middleware para verificar los errores
    ],
    usersPost
);

/**
 * Se indica que despues del '/' se debe pasar un parametro el cual representa un id
 * Se aplica validacion custom(antes de ir al controller) y otras de express-validator sobre el campo id
 * los cuales son middlewares que se declaran en un arreglo como segundo parámetro
 * Al final de los check se verifican los errores con el middleware personalizado 'validateFields'
 */
router.delete(
    "/:id", [
        validateJWT,
        //isAdminRole,
        hasRole("ADMIN_ROLE", "SALES_ROLE", "USER_ROLE"),
        check("id", messages.ID_VALIDATION).isMongoId(),
        check("id").custom(userExistById),
        validateFields, // Middleware para verificar los errores
    ],
    usersDelete
);

router.patch("/", usersPatch);

module.exports = router;