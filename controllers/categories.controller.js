const { response } = require("express");
const { Category } = require("../models");
const messages = require("../utils/messages");

const getCategories = async(req, res = response) => {
    const { to = 5, from = 0 } = req.query;
    const query = { status: true };

    const [total, categories] = await Promise.all([
        Category.countDocuments(query),
        Category.find(query)
        .populate("user", "name")
        .skip(Number(from))
        .limit(Number(to)),
    ]);

    res.json({
        total,
        categories,
    });
};

const getCategory = async(req, res = response) => {
    const { id } = req.params;
    const category = await Category.findById(id).populate("user", "name");

    res.json(category);
};

const createCategory = async(req, res = response) => {
    const name = req.body.name.toUpperCase();

    const category = await Category.findOne({ name });

    if (category) {
        return res.status(400).json({
            msg: messages.CATEGORY_EXISTS.category.name,
        });
    }

    // Generar la data a guardar
    const data = {
        name,
        user: req.user._id,
    };

    const newCategory = new Category(data);

    // Guardar DB
    await newCategory.save();

    res.status(201).json(newCategory);
};

const updateCategory = async(req, res = response) => {
    const { id } = req.params;
    const { status, user, ...data } = req.body;

    data.name = data.name.toUpperCase();
    data.user = req.user._id;

    const category = await Category.findByIdAndUpdate(id, data, { new: true });

    res.json(category);
};

const deleteCategory = async(req, res = response) => {
    const { id } = req.params;
    const category = await Category.findByIdAndUpdate(
        id, { status: false }, { new: true }
    );

    res.json(category);
};

module.exports = {
    createCategory,
    getCategories,
    getCategory,
    updateCategory,
    deleteCategory,
};