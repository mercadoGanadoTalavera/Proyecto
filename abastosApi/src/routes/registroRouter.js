
const registroRouter = require("express").Router();
const registro = require("../controllers/registroController");

registroRouter.get("/all", registro.getAllRegistros);
registroRouter.get("/:id", registro.getRegistroById);
registroRouter.get("/producto/:id", registro.getRegistrosByProducto);
registroRouter.post("/create", registro.createRegistro);
registroRouter.delete("/delete/:id", registro.deleteRegistro);

module.exports = registroRouter;
