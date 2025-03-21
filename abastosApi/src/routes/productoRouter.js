const productoRouter = require("express").Router();
const producto = require("../controllers/productoController");

productoRouter.get("/all", producto.getAllproductos);
productoRouter.get("/:id", producto.getUnproducto);
productoRouter.get("/categoria/:id", producto.getProductosByCategoria);
productoRouter.post("/create", producto.createproducto);
productoRouter.put("/modify/:id", producto.updateproducto);
productoRouter.delete("/delete/:id", producto.deleteproducto);

module.exports = productoRouter;