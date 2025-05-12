const API_BASE = "http://localhost:3000/mercadoabastos";

document.addEventListener("DOMContentLoaded", () => {
  const inicio = document.getElementById("inicio");
  const crearPDF = document.getElementById("crearPDF");
  const busqueda = document.getElementById("busqueda");
  const categoriasContainer = document.getElementById("categoriasContainer");
  const formularioProductos = document.getElementById("formularioProductos");
  const sesionesBody = document.getElementById("sesionesBody");
  const productosBody = document.getElementById("productosBody");
  const guardarBtn = document.getElementById("guardarCambiosBtn");

  let categoriaSeleccionada = null;

  // Navegación
  document.getElementById("btnCrearPDF").onclick = () => {
    inicio.classList.add("hidden");
    crearPDF.classList.remove("hidden");
    cargarCategorias();
  };

  document.getElementById("btnBuscar").onclick = () => {
    inicio.classList.add("hidden");
    busqueda.classList.remove("hidden");
  };

  document.getElementById("volverInicioDesdePDF").onclick = () => {
    crearPDF.classList.add("hidden");
    inicio.classList.remove("hidden");
    formularioProductos.innerHTML = "";
    categoriasContainer.innerHTML = "";
    guardarBtn.classList.add("hidden");
  };

  document.getElementById("volverInicioDesdeBusqueda").onclick = () => {
    busqueda.classList.add("hidden");
    inicio.classList.remove("hidden");
    sesionesBody.innerHTML = "";
    productosBody.innerHTML = "";
  };

  // Cargar categorías
  function cargarCategorias() {
    fetch(`${API_BASE}/categorias/all`)
      .then(res => res.json())
      .then(categorias => {
        categoriasContainer.innerHTML = "";
        categorias.forEach(cat => {
          const btn = document.createElement("button");
          btn.className = "bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700";
          btn.textContent = cat.nombre;
          btn.onclick = () => {
            categoriaSeleccionada = cat.id_categoria;
            cargarFormularioPorCategoria(cat.id_categoria);
          };
          categoriasContainer.appendChild(btn);
        });
      });
  }

  function cargarFormularioPorCategoria(idCategoria) {
    fetch(`${API_BASE}/productos/categoria/${idCategoria}`)
      .then(res => res.json())
      .then(mostrarFormularioEditable);
  }

  function mostrarFormularioEditable(productos) {
    formularioProductos.innerHTML = "";
    guardarBtn.classList.remove("hidden");

    const grupos = {};
    productos.forEach(p => {
      const tipo = p.Tipo?.nombre || "Sin tipo";
      if (!grupos[tipo]) grupos[tipo] = [];
      grupos[tipo].push(p);
    });

    for (const [tipo, productosTipo] of Object.entries(grupos)) {
      const tipoId = productosTipo[0].id_tipo;
      const grupo = document.createElement("div");
      grupo.className = "mb-6 border p-4 rounded shadow";

      const tabla = document.createElement("table");
      tabla.className = "table-auto w-full border mb-3";
      tabla.innerHTML = `
        <thead class="bg-gray-100"><tr>
          <th class="border px-2 py-1">Producto</th>
          <th class="border px-2 py-1">Unidad</th>
          <th class="border px-2 py-1">Precio anterior</th>
          <th class="border px-2 py-1">Precio actual</th>
        </tr></thead>
        <tbody></tbody>
      `;

      const tbody = tabla.querySelector("tbody");
      productosTipo.forEach(p => {
        const tr = document.createElement("tr");
        tr.dataset.idProducto = p.id_producto;
        tr.dataset.tipoPrecio = p.tipo_precio;

        const u = p.ultimoPrecio || {};

        if (p.tipo_precio === 0) {
          tr.innerHTML = `
            <td class="border px-2 py-1">${p.nombre}</td>
            <td class="border px-2 py-1">${p.unidad_medida}</td>
            <td class="border px-2 py-1">
              <input type="number" readonly class="precio-anterior border w-full px-2 bg-gray-100" value="${u.precio_actual ?? ""}" />
            </td>
            <td class="border px-2 py-1">
              <input type="number" class="precio-actual border w-full px-2" />
            </td>
          `;
        } else {
          tr.innerHTML = `
            <td class="border px-2 py-1">${p.nombre}</td>
            <td class="border px-2 py-1">${p.unidad_medida}</td>
            <td class="border px-2 py-1">
              <input type="number" readonly class="precio-anterior-min border w-20 bg-gray-100" value="${u.precio_actual_min ?? ""}" /> -
              <input type="number" readonly class="precio-anterior-max border w-20 bg-gray-100" value="${u.precio_actual_max ?? ""}" />
            </td>
            <td class="border px-2 py-1">
              <input type="number" class="precio-actual-min border w-20" /> -
              <input type="number" class="precio-actual-max border w-20" />
            </td>
          `;
        }

        tbody.appendChild(tr);
      });

      const comentario = document.createElement("textarea");
      comentario.className = "comentario-tipo w-full border p-2 mt-2";
      comentario.dataset.idTipo = tipoId;
      comentario.placeholder = `Comentario sobre ${tipo}`;

      grupo.innerHTML = `<h4 class="font-bold mb-2">${tipo}</h4>`;
      grupo.appendChild(tabla);
      grupo.appendChild(comentario);
      formularioProductos.appendChild(grupo);
    }
  }

  guardarBtn.onclick = () => {
    const filas = [...document.querySelectorAll("tbody tr")];
    const productos = filas.map(fila => {
      const id_producto = parseInt(fila.dataset.idProducto);
      const tipo_precio = parseInt(fila.dataset.tipoPrecio);
      if (tipo_precio === 0) {
        return {
          id_producto,
          tipo_precio,
          precio_actual: parseFloat(fila.querySelector(".precio-actual").value || 0)
        };
      } else {
        return {
          id_producto,
          tipo_precio,
          precio_actual_min: parseFloat(fila.querySelector(".precio-actual-min").value || 0),
          precio_actual_max: parseFloat(fila.querySelector(".precio-actual-max").value || 0)
        };
      }
    });

    const comentarios = [...document.querySelectorAll(".comentario-tipo")].map(area => ({
      id_tipo: parseInt(area.dataset.idTipo),
      comentario: area.value.trim() || null
    }));

    fetch(`${API_BASE}/sesiones`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id_categoria: categoriaSeleccionada,
        productos,
        comentarios_tipo: comentarios
      })
    })
      .then(res => res.json())
      .then(data => alert("Datos guardados. ID sesión: " + data.id_sesion))
      .catch(() => alert("Error al guardar"));
  };

  // Buscar sesiones por fecha
  document.getElementById("buscarFechaBtn").onclick = () => {
    const fecha = document.getElementById("fechaBusqueda").value;
    if (!fecha) return alert("Introduce una fecha");

    fetch(`${API_BASE}/sesiones/fecha?fecha=${fecha}`)
      .then(res => res.json())
      .then(sesiones => {
        sesionesBody.innerHTML = "";
        productosBody.innerHTML = "";
        if (!Array.isArray(sesiones) || sesiones.length === 0) {
          sesionesBody.innerHTML = `<tr><td colspan="3" class="text-center text-gray-500">No hay sesiones</td></tr>`;
          return;
        }
        sesiones.forEach(s => {
          const tr = document.createElement("tr");
          tr.className = "hover:bg-gray-100 cursor-pointer";
          tr.innerHTML = `<td class="border px-4 py-2">${s.id_sesion}</td>
                          <td class="border px-4 py-2">${s.fecha}</td>
                          <td class="border px-4 py-2">${s.Categorium?.nombre || ""}</td>`;
          tr.onclick = () => cargarProductosSesion(s.id_sesion);
          sesionesBody.appendChild(tr);
        });
      });
  };

  function cargarProductosSesion(idSesion) {
    fetch(`${API_BASE}/sesiones/${idSesion}/productos`)
      .then(res => res.json())
      .then(productos => {
        productosBody.innerHTML = "";
        productos.forEach(p => {
          const pr = Array.isArray(p.Precios) ? p.Precios[0] : {};
          const actual = p.tipo_precio === 0
            ? pr.precio_actual ?? "N/D"
            : `${pr.precio_actual_min ?? ""} - ${pr.precio_actual_max ?? ""}`;
          const anterior = p.tipo_precio === 0
            ? pr.precio_anterior ?? "N/D"
            : `${pr.precio_anterior_min ?? ""} - ${pr.precio_anterior_max ?? ""}`;
          const tr = document.createElement("tr");
          tr.innerHTML = `
            <td class="border px-4 py-2">${p.nombre}</td>
            <td class="border px-4 py-2">${p.unidad_medida}</td>
            <td class="border px-4 py-2">${p.Tipo?.nombre || ""}</td>
            <td class="border px-4 py-2">${actual}</td>
            <td class="border px-4 py-2">${anterior}</td>
          `;
          productosBody.appendChild(tr);
        });
      });
  }
});
