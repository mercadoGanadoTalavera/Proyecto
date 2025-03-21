const categoriaRouter = require("express").Router();
const categoria = require("../controllers/categoriaController");

categoriaRouter.get("/all", categoria.getAllcategorias);
categoriaRouter.get("/:id", categoria.getUncategoria);
categoriaRouter.post("/create", categoria.createcategoria);
categoriaRouter.put("/modify/:id", categoria.updatecategoria);
categoriaRouter.delete("/delete/:id", categoria.deletecategoria);

module.exports = categoriaRouter;