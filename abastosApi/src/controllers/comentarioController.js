const comentarioService = require("../services/comentarioService");

// Obtener todos los comentarios
const getAllComentarios = async (req, res) => {
    try {
        const comentarios = await comentarioService.getAllComentarios();
        res.status(200).json(comentarios);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener un comentario por ID
const getComentarioById = async (req, res) => {
    try {
        const comentario = await comentarioService.getComentarioById(req.params.id);
        comentario
            ? res.status(200).json(comentario)
            : res.status(404).json({ message: "Comentario no encontrado" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Crear un nuevo comentario
const createComentario = async (req, res) => {
    try {
        const comentario = await comentarioService.createComentario(req.body);
        res.status(201).json(comentario);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Actualizar un comentario
const updateComentario = async (req, res) => {
    try {
        const result = await comentarioService.updateComentario(req.params.id, req.body);
        res.status(200).json({ message: result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Eliminar un comentario
const deleteComentario = async (req, res) => {
    try {
        const result = await comentarioService.deleteComentario(req.params.id);
        res.status(200).json({ message: result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Exportar funciones
module.exports = {
    getAllComentarios,
    getComentarioById,
    createComentario,
    updateComentario,
    deleteComentario
};
