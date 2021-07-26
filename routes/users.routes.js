const { Router } = require('express');
const { check } = require('express-validator');

const { validateFields } = require('../middlewares/validate-fields');
const { validRole, emailExists, userExistById } = require('../helpers/database-validators');

const {
    usersGet,
    usersPut,
    usersPost,
    usersDelete,
    usersPatch,
} = require("../controllers/users.controller");

const router = Router();

router.get('/', usersGet);

/**
 * Se indica que despues del '/' se debe pasar un parametro el cual representa un id
 * Se aplican validaciones custom(antes de ir al controller) y otras de express-validator sobre los campos id y role 
 * los cuales son middlewares que se declaran en un arreglo como segundo parámetro
 * Al final de los check se verifican los errores con el middleware personalizado 'validateFields'
 */
router.put('/:id', [
    check('id', 'ID is not valid').isMongoId(),
    check('id').custom(userExistById),
    check('role').custom(validRole),
    validateFields // Middleware para verificar los errores
], usersPut);

/**
 * Se aplican validaciones custom(antes de ir al controller) y otras de express-validator sobre los campos name, password, email, role 
 * los cuales son middlewares que se declaran en un arreglo como segundo parámetro
 * Al final de los check se verifican los errores con el middleware personalizado 'validateFields'
 */
router.post('/', [
    check('name', 'Field name is mandatory').not().isEmpty(),
    check('password', 'Field password must be 6 letters or more').isLength({ min: 6 }),
    check('email', 'Field email is not valid').isEmail(),
    check('email').custom(emailExists),
    //check('role', 'Invalid role').isIn(['ADMIN_ROLE', 'USER_ROLE']), // Solo verifica contra el arreglo, no verifica contra la base de datos
    check('role').custom(validRole), // Verifica contra la base de datos
    validateFields // Middleware para verificar los errores
], usersPost);

/**
 * Se indica que despues del '/' se debe pasar un parametro el cual representa un id
 * Se aplica validacion custom(antes de ir al controller) y otras de express-validator sobre el campo id 
 * los cuales son middlewares que se declaran en un arreglo como segundo parámetro
 * Al final de los check se verifican los errores con el middleware personalizado 'validateFields'
 */
router.delete('/:id', [
    check('id', 'ID is not valid').isMongoId(),
    check('id').custom(userExistById),
    validateFields // Middleware para verificar los errores
], usersDelete);

router.patch('/', usersPatch);


module.exports = router;