const Producto = require("../database/models/Producto");
const Categoria = require("../database/models/Categoria");
const Tipo = require("../database/models/Tipo");
const Precio = require("../database/models/Precio");
const Sesion = require("../database/models/Sesion");
const NombreSecundario = require("../database/models/NombreSecundario");
const { Op } = require("sequelize");

// Obtener todos los productos
const getAllProductos = async () => {
  return await Producto.findAll({
    include: [
      { model: Categoria, attributes: ["nombre"] },
      { model: Tipo, attributes: ["nombre"] }
    ],
    order: [['nombre', 'ASC']]
  });
};

// Obtener productos por categoría (con tipo y precio más reciente)
const getProductosByCategoria = async (id_categoria) => {
  const includeOptions = [
    {
      model: Tipo,
      attributes: ["id_tipo", "nombre"],
      required: false
    },
    {
      model: Categoria,
      attributes: ["nombre"],
      required: true
    }
  ];

  // Solo añadir NombreSecundario si es categoría 4 (Pistachos)
  if (parseInt(id_categoria) === 4) {
    includeOptions.push({
      model: NombreSecundario,
      as: "nombres", // alias definido en associations.js
      attributes: ["nombre_1", "nombre_2", "nombre_3"],
      required: false
    });
  }

  const productos = await Producto.findAll({
    where: { id_categoria },
    include: includeOptions,
    order: [['nombre', 'ASC']]
  });

  for (let p of productos) {
    const ultimo = await Precio.findOne({
      where: { id_producto: p.id_producto },
      order: [['id_sesion', 'DESC']],
      attributes: [
        'precio_actual',
        'precio_actual_min',
        'precio_actual_max',
        'precio_anterior',
        'precio_anterior_min',
        'precio_anterior_max',
        'contribuye'
      ]
    });
    p.dataValues.ultimoPrecio = ultimo;
  }

  return productos;
};

// Obtener un producto por ID
const getProductoById = async (id) => {
  return await Producto.findOne({
    where: { id_producto: id },
    include: [
      { model: Categoria, attributes: ["nombre"] },
      { model: Tipo, attributes: ["nombre"] }
    ]
  });
};

// Crear un nuevo producto
const createProducto = async (data) => {
  return await Producto.create(data);
};

// Actualizar un producto
const updateProducto = async (id, data) => {
  const [updated] = await Producto.update(data, { where: { id_producto: id } });
  return updated ? "Producto actualizado correctamente" : "Producto no encontrado";
};

// Eliminar un producto
const deleteProducto = async (id) => {
  const deleted = await Producto.destroy({ where: { id_producto: id } });
  return deleted ? "Producto eliminado correctamente" : "Producto no encontrado";
};

// Obtener productos por fecha (para búsquedas históricas)
const getProductosPorFecha = async (fecha) => {
  const sesiones = await Sesion.findAll({ where: { fecha } });
  const ids = sesiones.map(s => s.id_sesion);
  if (!ids.length) return [];

  return await Producto.findAll({
    include: [
      { model: Tipo },
      {
        model: Precio,
        where: { id_sesion: ids.length === 1 ? ids[0] : { [Op.in]: ids } },
        required: true
      }
    ]
  });
};

// Función para obtener productos por tipo (pistacho o almendra)
const getProductosByTipo = async (tipos) => {
  return await Producto.findAll({
    where: {
      id_tipo: { [Op.in]: tipos },
    },
    include: [
      { model: Tipo },
      {
        model: Precio,
        as: "Precios",
        required: false,
      },
      {
        model: NombreSecundario,
        as: "nombres",
        attributes: ["nombre_1", "nombre_2", "nombre_3"],
        required: false,
      },
    ],
  });
};

module.exports = {
  getAllProductos,
  getProductosByCategoria,
  getProductoById,
  createProducto,
  updateProducto,
  deleteProducto,
  getProductosPorFecha,
  getProductosByTipo
};
