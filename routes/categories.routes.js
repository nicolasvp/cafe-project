const { Router } = require("express");
const { check } = require("express-validator");

const { validateJWT, validateFields, isAdminRole } = require("../middlewares");

const {
    createCategory,
    getCategories,
    getCategory,
    updateCategory,
    deleteCategory,
} = require("../controllers/categories.controller");
const { categoryExistById } = require("../helpers/database-validators");
const messages = require("../utils/messages");

const router = Router();

/**
 * {{url}}/api/categorias
 */

//  Obtener todas las categorias - publico
router.get("/", getCategories);

// Obtener una categoria por id - publico
router.get(
    "/:id", [
        check("id", messages.INVALID_MONGO_ID).isMongoId(),
        check("id").custom(categoryExistById),
        validateFields,
    ],
    getCategory
);

// Crear categoria - privado - cualquier persona con un token válido
router.post(
    "/", [
        validateJWT,
        check("name", messages.NAME_PRESENT_VALIDATION).not().isEmpty(),
        validateFields,
    ],
    createCategory
);

// Actualizar - privado - cualquiera con token válido
router.put(
    "/:id", [
        validateJWT,
        check("name", messages.NAME_PRESENT_VALIDATION).not().isEmpty(),
        check("id").custom(categoryExistById),
        validateFields,
    ],
    updateCategory
);

// Borrar una categoria - Admin
router.delete(
    "/:id", [
        validateJWT,
        isAdminRole,
        check("id", messages.INVALID_MONGO_ID).isMongoId(),
        check("id").custom(categoryExistById),
        validateFields,
    ],
    deleteCategory
);

module.exports = router;