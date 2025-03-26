const categoriaRouter = require("express").Router();
const categoria = require("../controllers/categoriaController");

categoriaRouter.get("/all", categoria.getAllCategorias);
categoriaRouter.get("/:id", categoria.getCategoriaById);
categoriaRouter.post("/create", categoria.createCategoria);
categoriaRouter.put("/modify/:id", categoria.updateCategoria);
categoriaRouter.delete("/delete/:id", categoria.deleteCategoria);

module.exports = categoriaRouter;
