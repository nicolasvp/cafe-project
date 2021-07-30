const { response } = require("express");
const { Product } = require("../models");
const messages = require("../utils/messages");

const getProducts = async(req, res = response) => {
    const { to = 5, from = 0 } = req.query;
    const query = { status: true };

    const [total, products] = await Promise.all([
        Product.countDocuments(query),
        Product.find(query)
        .populate("user", "name")
        .populate("category", "name")
        .skip(Number(from))
        .limit(Number(to)),
    ]);

    res.json({
        total,
        products,
    });
};

const getProduct = async(req, res = response) => {
    const { id } = req.params;
    const product = await Product.findById(id)
        .populate("user", "name")
        .populate("category", "name");

    res.json(product);
};

const createProduct = async(req, res = response) => {
    const { status, user, ...body } = req.body;

    const product = await Product.findOne({ name: body.name });

    if (product) {
        return res.status(400).json({
            msg: messages.PRODUCT_EXISTS.productoDB.name,
        });
    }

    // Generar la data a guardar
    const data = {
        ...body,
        name: body.name.toUpperCase(),
        user: req.user._id,
    };

    const newProduct = new Product(data);

    // Guardar DB
    await newProduct.save();

    res.status(201).json(newProduct);
};

const updateProduct = async(req, res = response) => {
    const { id } = req.params;
    const { status, user, ...data } = req.body;

    if (data.name) {
        data.name = data.name.toUpperCase();
    }

    data.user = req.user._id;

    const product = await Product.findByIdAndUpdate(id, data, { new: true });

    res.json(product);
};

const deleteProduct = async(req, res = response) => {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(
        id, { status: false }, { new: true }
    );

    res.json(product);
};

module.exports = {
    createProduct,
    getProducts,
    getProduct,
    updateProduct,
    deleteProduct,
};