
const tipoRouter = require("express").Router();
const tipo = require("../controllers/tipoController");

tipoRouter.get("/all", tipo.getAllTipos);
tipoRouter.get("/:id", tipo.getTipoById);
tipoRouter.post("/create", tipo.createTipo);
tipoRouter.put("/modify/:id", tipo.updateTipo);
tipoRouter.delete("/delete/:id", tipo.deleteTipo);

module.exports = tipoRouter;
