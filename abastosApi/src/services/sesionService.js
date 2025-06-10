const Sesion = require("../database/models/Sesion");
const Categoria = require("../database/models/Categoria");
const Producto = require("../database/models/Producto");
const Tipo = require("../database/models/Tipo");
const Precio = require("../database/models/Precio");
const NombreSecundario = require("../database/models/NombreSecundario");
const SesionAlmacenanTipo = require("../database/models/SesionAlmacenanTipo");

const { Op } = require("sequelize");

// Obtener sesiones por fecha
const getSesionesPorFecha = async (fecha) => {
  return await Sesion.findAll({
    where: { fecha },
    include: { model: Categoria, as: 'Categoria' }
  });
};

// Obtener sesiones por categoría
const getSesionesPorCategoria = async (nombreCategoria) => {
  const categoria = await Categoria.findOne({ where: { nombre: nombreCategoria } });
  if (!categoria) return [];
  return await Sesion.findAll({
    where: { id_categoria: categoria.id_categoria },
    include: { model: Categoria, as: 'Categoria' },
    order: [["fecha", "DESC"]]
  });
};

// Obtener productos de una sesión
const getProductosPorSesion = async (id_sesion) => {
  return await Producto.findAll({
    include: [
      { model: Tipo },
      {
        model: Precio,
        as: 'Precios',
        required: false
      },
      {
        model: Precio,
        as: 'ultimoPrecio',
        where: { id_sesion },
        required: false
      }
    ]
  });
};

// Obtener comentarios
const obtenerComentariosPorSesion = async (id_sesion) => {
  return await SesionAlmacenanTipo.findAll({
    where: { id_sesion }
  });
};

// Crear sesión
const crearSesionYPrecios = async ({ id_categoria, productos, comentarios_tipo, fecha }) => {
  const fechaReal = fecha ?? new Date().toISOString().split("T")[0];

  const sesion = await Sesion.create({ fecha: fechaReal, id_categoria });

  const preciosData = productos.map(prod => {
    const base = {
      id_producto: prod.id_producto,
      id_sesion: sesion.id_sesion,
      contribuye: prod.contribuye ?? true
    };

    if (!base.contribuye) return base;

    return prod.tipo_precio === 0
      ? { ...base, precio_actual: prod.precio_actual, precio_anterior: prod.precio_anterior }
      : {
          ...base,
          precio_actual_min: prod.precio_actual_min,
          precio_actual_max: prod.precio_actual_max,
          precio_anterior_min: prod.precio_anterior_min,
          precio_anterior_max: prod.precio_anterior_max
        };
  });

  await Precio.bulkCreate(preciosData);

  if (Array.isArray(comentarios_tipo)) {
    const comentariosData = comentarios_tipo.map(ct => ({
      id_tipo: ct.id_tipo,
      id_sesion: sesion.id_sesion,
      comentario: ct.comentario ?? null
    }));

    await SesionAlmacenanTipo.bulkCreate(comentariosData);
  }

  return { mensaje: "Sesión y precios guardados", id_sesion: sesion.id_sesion };
};

// Obtener datos para PDF
const obtenerDatosParaPDF = async (id_sesion) => {
  const sesion = await Sesion.findByPk(id_sesion, {
    include: [{ model: Categoria, as: 'Categoria', attributes: ["nombre", "id_categoria"] }]
  });

const productos = await Producto.findAll({
  where: { id_categoria: sesion.id_categoria },
  include: [
    { model: Tipo },
    {
      model: Precio,
      as: "Precios",
      where: { id_sesion },
      required: false,
    },
    {
      model: require("../database/models/NombreSecundario"),
      as: "NombreSecundario",
    },
  ],
});

  const comentarios = await SesionAlmacenanTipo.findAll({ where: { id_sesion } });

  const tiposMap = {};

  productos.forEach(p => {
    const tipo = p.Tipo?.nombre || "Sin tipo";
    if (!tiposMap[tipo]) tiposMap[tipo] = { nombre: tipo, productos: [] };

    const precio = p.Precios?.[0] ?? {};
    const contribuye = precio.contribuye ?? true;

    // Construcción del nombre
let nombreFinal = p.nombre;
if (sesion.id_categoria === 4 && p.NombreSecundario) {
  const { nombre_1, nombre_2, nombre_3 } = p.NombreSecundario;
  nombreFinal = [nombre_1, nombre_2, nombre_3].filter(Boolean).join(" - ");
}


    tiposMap[tipo].productos.push({
      nombre: nombreFinal,
      unidad: p.unidad_medida,
      tipo_precio: p.tipo_precio,
      contribuye,
      anterior: p.tipo_precio === 0
        ? precio.precio_anterior
        : [precio.precio_anterior_min, precio.precio_anterior_max],
      actual: p.tipo_precio === 0
        ? precio.precio_actual
        : [precio.precio_actual_min, precio.precio_actual_max]
    });
  });

  comentarios.forEach(c => {
    const tipo = productos.find(p => p.id_tipo === c.id_tipo)?.Tipo?.nombre;
    if (tipo && tiposMap[tipo]) {
      tiposMap[tipo].comentario = c.comentario;
    }
  });

  return {
    fecha: sesion.fecha,
    categoria: sesion.Categoria?.nombre || "",
    tipos: Object.values(tiposMap)
  };
};
const obtenerDatosPistachosParaPDF = async (id_sesion) => {
  const sesion = await Sesion.findByPk(id_sesion, {
    include: [{ model: Categoria, as: 'Categoria', attributes: ["nombre"] }]
  });

  if (!sesion || sesion.id_categoria !== 4) {
    throw new Error("Sesión no válida o no es de pistachos");
  }

  const productos = await Producto.findAll({
    include: [
      { model: Tipo },
      {
        model: Precio,
        as: 'Precios',
        where: { id_sesion },
        required: false
      },
      {
        model: require("../database/models/NombreSecundario"),
        as: "NombreSecundario"
      }
    ]
  });

  const comentarios = await SesionAlmacenanTipo.findAll({
    where: { id_sesion }
  });

  const tiposMap = {};

  productos.forEach(p => {
    const tipo = p.Tipo?.nombre || "Sin tipo";
    if (!tiposMap[tipo]) tiposMap[tipo] = { nombre: tipo, productos: [] };

    const precio = p.Precios?.[0] ?? {};
    const contribuye = precio.contribuye ?? true;

    const { nombre_1, nombre_2, nombre_3 } = p.NombreSecundario || {};
    const nombreFinal = [nombre_1, nombre_2, nombre_3].filter(Boolean).join(" - ");

    tiposMap[tipo].productos.push({
      nombre: nombreFinal,
      unidad: p.unidad_medida,
      tipo_precio: p.tipo_precio,
      contribuye,
      anterior: p.tipo_precio === 0
        ? precio.precio_anterior
        : [precio.precio_anterior_min, precio.precio_anterior_max],
      actual: p.tipo_precio === 0
        ? precio.precio_actual
        : [precio.precio_actual_min, precio.precio_actual_max]
    });
  });

  comentarios.forEach(c => {
    const tipo = productos.find(p => p.id_tipo === c.id_tipo)?.Tipo?.nombre;
    if (tipo && tiposMap[tipo]) {
      tiposMap[tipo].comentario = c.comentario;
    }
  });

  return {
    fecha: sesion.fecha,
    categoria: sesion.Categoria?.nombre || "",
    tipos: Object.values(tiposMap)
  };
};

module.exports = {
  getSesionesPorFecha,
  getSesionesPorCategoria,
  getProductosPorSesion,
  obtenerComentariosPorSesion,
  crearSesionYPrecios,
  obtenerDatosParaPDF,
  obtenerDatosPistachosParaPDF
};
