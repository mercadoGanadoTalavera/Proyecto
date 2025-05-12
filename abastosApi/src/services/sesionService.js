const Sesion = require("../database/models/Sesion");
const Categoria = require("../database/models/Categoria");
const Producto = require("../database/models/Producto");
const Tipo = require("../database/models/Tipo");
const Precio = require("../database/models/Precio");
const SesionAlmacenanTipo = require("../database/models/SesionAlmacenanTipo"); // Asegúrate de tener este modelo

const getSesionesPorFecha = async (fecha) => {
  return await Sesion.findAll({
    where: { fecha },
    include: { model: Categoria }
  });
};

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

const crearSesionYPrecios = async ({ id_categoria, productos, comentarios_tipo }) => {
  const fechaHoy = new Date().toISOString().split("T")[0];

  const sesion = await Sesion.create({
    fecha: fechaHoy,
    id_categoria
  });

  const preciosData = productos.map(prod => {
    const base = {
      id_producto: prod.id_producto,
      id_sesion: sesion.id_sesion
    };

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

  // Inserta comentarios por tipo si se incluyen
  if (Array.isArray(comentarios_tipo)) {
    const comentariosData = comentarios_tipo.map(ct => ({
      id_tipo: ct.id_tipo,
      id_sesion: sesion.id_sesion,
      comentario: ct.comentario ?? null
    }));

    await SesionAlmacenanTipo.bulkCreate(comentariosData);
  }

  return { mensaje: "Sesión, precios y comentarios guardados", id_sesion: sesion.id_sesion };
};

module.exports = {
  getSesionesPorFecha,
  getProductosPorSesion,
  crearSesionYPrecios
};
