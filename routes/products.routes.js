const { Router } = require("express");
const { check } = require("express-validator");

const { validateJWT, validateFields, isAdminRole } = require("../middlewares");

const {
    createProduct,
    getProducts,
    getProduct,
    updateProduct,
    deleteProduct,
} = require("../controllers/products.controller");

const {
    categoryExistById,
    productExistsById,
} = require("../helpers/database-validators");
const messages = require("../utils/messages");

const router = Router();

/**
 * {{url}}/api/categorias
 */

//  Obtener todas las categorias - publico
router.get("/", getProducts);

// Obtener una categoria por id - publico
router.get(
    "/:id", [
        check("id", messages.INVALID_MONGO_ID).isMongoId(),
        check("id").custom(productExistsById),
        validateFields,
    ],
    getProduct
);

// Crear categoria - privado - cualquier persona con un token válido
router.post(
    "/", [
        validateJWT,
        check("name", messages.NAME_PRESENT_VALIDATION).not().isEmpty(),
        check("category", messages.INVALID_MONGO_ID).isMongoId(),
        check("category").custom(categoryExistById),
        validateFields,
    ],
    createProduct
);

// Actualizar - privado - cualquiera con token válido
router.put(
    "/:id", [
        validateJWT,
        // check('category', messages.INVALID_MONGO_ID).isMongoId(),
        check("id").custom(productExistsById),
        validateFields,
    ],
    updateProduct
);

// Borrar una categoria - Admin
router.delete(
    "/:id", [
        validateJWT,
        isAdminRole,
        check("id", messages.INVALID_MONGO_ID).isMongoId(),
        check("id").custom(productExistsById),
        validateFields,
    ],
    deleteProduct
);

module.exports = router;