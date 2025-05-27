const Sesion = require("../database/models/Sesion");
const Categoria = require("../database/models/Categoria");
const Producto = require("../database/models/Producto");
const Tipo = require("../database/models/Tipo");
const Precio = require("../database/models/Precio");
const SesionAlmacenanTipo = require("../database/models/SesionAlmacenanTipo");

const {
  generarPDFPorSesion,
  obtenerDatosParaPDF
} = require("../services/pdfService");

// Obtener sesiones por fecha
const getSesionesPorFecha = async (req, res) => {
  try {
    const { fecha } = req.query;
    const sesiones = await Sesion.findAll({
      where: { fecha },
      include: { model: Categoria }
    });
    res.json(sesiones);
  } catch (error) {
    console.error("Error obteniendo sesiones:", error);
    res.status(500).json({ error: "Error obteniendo sesiones" });
  }
};

// Obtener productos de una sesión
const getProductosDeSesion = async (req, res) => {
  try {
    const { id_sesion } = req.params;
    const productos = await Producto.findAll({
      include: [
        { model: Tipo },
        {
          model: Precio,
          where: { id_sesion },
          required: true
        }
      ]
    });
    res.json(productos);
  } catch (error) {
    console.error("Error obteniendo productos:", error);
    res.status(500).json({ error: "Error obteniendo productos de sesión" });
  }
};

// Crear nueva sesión con precios y comentarios
const crearSesionYPrecios = async (req, res) => {
  try {
    const { id_categoria, productos, comentarios_tipo, fecha } = req.body;
    const fechaHoy = fecha ?? new Date().toISOString().split("T")[0];

    const sesion = await Sesion.create({
      fecha: fechaHoy,
      id_categoria
    });

    const preciosData = productos.map(prod => {
      if (prod.contribuye === false) return {
        id_producto: prod.id_producto,
        id_sesion: sesion.id_sesion,
        contribuye: false
      };

      const base = {
        id_producto: prod.id_producto,
        id_sesion: sesion.id_sesion,
        contribuye: prod.contribuye ?? true
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

    if (Array.isArray(comentarios_tipo)) {
      const comentariosData = comentarios_tipo.map(ct => ({
        id_tipo: ct.id_tipo,
        id_sesion: sesion.id_sesion,
        comentario: ct.comentario ?? null
      }));

      await SesionAlmacenanTipo.bulkCreate(comentariosData);
    }

    res.status(201).json({
      mensaje: "Sesión y precios guardados",
      id_sesion: sesion.id_sesion
    });
  } catch (error) {
    console.error("Error al crear sesión y precios:", error);
    res.status(500).json({ error: "Error creando sesión y precios" });
  }
};

// Descargar PDF de una sesión
const descargarPDF = async (req, res) => {
  const { id_sesion } = req.params;
  try {
    const pdfBuffer = await generarPDFPorSesion(id_sesion);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "inline; filename=lonja.pdf");
    res.send(pdfBuffer);
  } catch (error) {
    console.error("Error generando PDF:", error);
    res.status(500).json({ error: "Error generando PDF" });
  }
};

module.exports = {
  getSesionesPorFecha,
  getProductosDeSesion,
  crearSesionYPrecios,
  descargarPDF
};
