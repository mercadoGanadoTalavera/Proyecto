const categoriaService = require("../services/categoriaService");

// Obtener todas las categorías
const getAllCategorias = async (req, res) => {
    try {
        const categorias = await categoriaService.getAllCategorias();
        res.status(200).json(categorias);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener una categoría por ID
const getCategoriaById = async (req, res) => {
    try {
        const categoria = await categoriaService.getCategoriaById(req.params.id);
        categoria
            ? res.status(200).json(categoria)
            : res.status(404).json({ message: "Categoría no encontrada" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Crear una nueva categoría
const createCategoria = async (req, res) => {
    try {
        const categoria = await categoriaService.createCategoria(req.body);
        res.status(201).json(categoria);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Actualizar una categoría
const updateCategoria = async (req, res) => {
    try {
        const result = await categoriaService.updateCategoria(req.params.id, req.body);
        res.status(200).json({ message: result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Eliminar una categoría
const deleteCategoria = async (req, res) => {
    try {
        const result = await categoriaService.deleteCategoria(req.params.id);
        res.status(200).json({ message: result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Exportar funciones
module.exports = {
    getAllCategorias,
    getCategoriaById,
    createCategoria,
    updateCategoria,
    deleteCategoria
};
