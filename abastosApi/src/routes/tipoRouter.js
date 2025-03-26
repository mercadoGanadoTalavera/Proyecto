const tipoRouter = require("express").Router();
const tipo = require("../controllers/tipoController");

tipoRouter.get("/all", tipo.getAllTipos);
tipoRouter.get("/:id", tipo.getTipoById);
tipoRouter.get("/categoria/:id", tipo.getTiposByCategoria);
tipoRouter.get("/producto/:id", tipo.getTiposByProducto);
tipoRouter.post("/create", tipo.createTipo);
tipoRouter.put("/modify/:id", tipo.updateTipo);
tipoRouter.delete("/delete/:id", tipo.deleteTipo);

module.exports = tipoRouter;
