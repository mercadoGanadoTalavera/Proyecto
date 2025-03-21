const tipoRouter = require("express").Router();
const tipo = require("../controllers/tipoController");

tipoRouter.get("/all", tipo.getAlltipos);
tipoRouter.get("/:id", tipo.getUntipo);
tipoRouter.get("/categoria/:id", tipo.gettiposByCategoria);
tipoRouter.get("/producto/:id", tipo.gettiposByProducto);
tipoRouter.post("/create", tipo.createtipo);
tipoRouter.put("/modify/:id", tipo.updatetipo);
tipoRouter.delete("/delete/:id", tipo.deletetipo);

module.exports = tipoRouter;