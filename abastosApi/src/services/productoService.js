const Producto = require("../database/models/Producto");
const Categoria = require("../database/models/Categoria");
const Tipo = require("../database/models/Tipo");
const Precio = require("../database/models/Precio");
const Sesion = require("../database/models/Sesion");
const { Op } = require("sequelize");

// Obtener todos los productos
const getAllProductos = async () => {
  return await Producto.findAll({
    include: [
      { model: Categoria, attributes: ["nombre"] },
      { model: Tipo, attributes: ["nombre"] }
    ],
    order: [["nombre", "ASC"]]
  });
};

// Obtener productos por categoría, incluyendo último precio
const getProductosByCategoria = async (id_categoria) => {
  const productos = await Producto.findAll({
    where: { id_categoria },
    include: [
      { model: Tipo, attributes: ["nombre"] }
    ]
  });

  for (const p of productos) {
    const ultimoPrecio = await Precio.findOne({
      where: { id_producto: p.id_producto },
      order: [["id_sesion", "DESC"]],
      raw: true
    });
    p.dataValues.ultimoPrecio = ultimoPrecio || {};
  }

  return productos;
};

// Obtener producto por ID
const getProductoById = async (id) => {
  return await Producto.findOne({
    where: { id_producto: id },
    include: [
      { model: Categoria, attributes: ["nombre"] },
      { model: Tipo, attributes: ["nombre"] }
    ]
  });
};

// Crear nuevo producto
const createProducto = async (data) => {
  return await Producto.create(data);
};

// Actualizar producto
const updateProducto = async (id, data) => {
  const [updated] = await Producto.update(data, {
    where: { id_producto: id }
  });
  return updated ? "Producto actualizado correctamente" : "Producto no encontrado";
};

// Eliminar producto
const deleteProducto = async (id) => {
  const deleted = await Producto.destroy({
    where: { id_producto: id }
  });
  return deleted ? "Producto eliminado correctamente" : "Producto no encontrado";
};

// Obtener productos por fecha (para búsqueda)
const getProductosPorFecha = async (fecha) => {
  const sesiones = await Sesion.findAll({ where: { fecha } });
  const ids = sesiones.map(s => s.id_sesion);
  if (!ids.length) return [];

  const productos = await Producto.findAll({
    include: [
      { model: Tipo },
      {
        model: Precio,
        where: {
          id_sesion: ids.length === 1 ? ids[0] : { [Op.in]: ids }
        },
        required: true
      }
    ]
  });

  return Array.isArray(productos) ? productos : [];
};

module.exports = {
  getAllProductos,
  getProductoById,
  getProductosPorFecha,
  createProducto,
  getProductosByCategoria,
  updateProducto,
  deleteProducto
};
