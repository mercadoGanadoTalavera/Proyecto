const Sesion = require("../database/models/Sesion");
const Categoria = require("../database/models/Categoria");
const Producto = require("../database/models/Producto");
const Tipo = require("../database/models/Tipo");
const Precio = require("../database/models/Precio");
const SesionAlmacenanTipo = require("../database/models/SesionAlmacenanTipo");

const { Op } = require("sequelize");

// Obtener sesiones por fecha
const getSesionesPorFecha = async (fecha) => {
  return await Sesion.findAll({
    where: { fecha },
    include: { model: Categoria }
  });
};

// Obtener productos de una sesión
const getProductosPorSesion = async (id_sesion) => {
  return await Producto.findAll({
    include: [
      { model: Tipo },
      {
        model: Precio,
        where: { id_sesion },
        required: true
      }
    ]
  });
};

// Crear nueva sesión con precios y comentarios
const crearSesionYPrecios = async ({ id_categoria, productos, comentarios_tipo, fecha }) => {
  const fechaReal = fecha ?? new Date().toISOString().split("T")[0];

  const sesion = await Sesion.create({
    fecha: fechaReal,
    id_categoria
  });

  const preciosData = productos.map(prod => {
    const base = {
      id_producto: prod.id_producto,
      id_sesion: sesion.id_sesion,
      contribuye: prod.contribuye ?? true
    };

    if (!base.contribuye) {
      return base; // No añade precios
    }

    if (prod.tipo_precio === 0) {
      return {
        ...base,
        precio_actual: prod.precio_actual,
        precio_anterior: prod.precio_anterior
      };
    } else {
      return {
        ...base,
        precio_actual_min: prod.precio_actual_min,
        precio_actual_max: prod.precio_actual_max,
        precio_anterior_min: prod.precio_anterior_min,
        precio_anterior_max: prod.precio_anterior_max
      };
    }
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

// Obtener datos para el PDF
const obtenerDatosParaPDF = async (id_sesion) => {
  const sesion = await Sesion.findByPk(id_sesion, {
    include: [{ model: Categoria, attributes: ["nombre"] }]
  });

  const productos = await Producto.findAll({
    include: [
      { model: Tipo },
      {
        model: Precio,
        where: { id_sesion },
        required: false
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

    tiposMap[tipo].productos.push({
      nombre: p.nombre,
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
    categoria: sesion.Categorium?.nombre || "",
    tipos: Object.values(tiposMap)
  };
};

module.exports = {
  getSesionesPorFecha,
  getProductosPorSesion,
  crearSesionYPrecios,
  obtenerDatosParaPDF
};
