const productoRouter = require("express").Router();
const producto = require("../controllers/productoController");

productoRouter.get("/all", producto.getAllProductos);
productoRouter.get("/:id", producto.getProductoById);
productoRouter.get("/categoria/:id", producto.getProductosByCategoria);
productoRouter.post("/create", producto.createProducto);
productoRouter.put("/modify/:id", producto.updateProducto);
productoRouter.delete("/delete/:id", producto.deleteProducto);

module.exports = productoRouter;
