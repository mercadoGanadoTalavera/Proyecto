const productoRouter = require("express").Router();
const producto = require("../controllers/productoController");

productoRouter.get("/all", producto.getAllProductos);
productoRouter.get("/:id", producto.getProductoById);
productoRouter.get("/categoria/:id/:tipo?", producto.getProductosByCategoria); // Modificado para permitir el tipo
productoRouter.post("/create", producto.createProducto);
productoRouter.put("/modify/:id", producto.updateProducto);
productoRouter.delete("/delete/:id", producto.deleteProducto);
productoRouter.get("/fecha", producto.getProductosPorFecha);

module.exports = productoRouter;
