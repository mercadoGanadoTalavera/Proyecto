# Proyecto - Mercado Ganado Talavera

## Descripción

Este proyecto es un sistema de gestión de lonjas que permite la administración y control de los mercados de cereales, ganado ovino y bovino, frutos secos y productos ecológicos. Además, facilita la generación automática de documentos PDF a partir de los datos introducidos en formularios.

## Características Principales

- **Administración de Lonjas**: Registro y seguimiento de precios y productos de las lonjas.
- **Automatización de Documentos**: Generación de PDFs a partir de formularios completados por los usuarios.
- **Control de Datos**: Gestión de información en tiempo real sobre precios, existencias y reportes.
- **API RESTful**: Backend basado en una API para facilitar la integración con otros sistemas.
- **Base de Datos SQL**: Administración de datos optimizada para el almacenamiento seguro.

## Tecnologías Utilizadas

- **Backend**: Node.js con Express.js
- **Base de Datos**: MySQL / PostgreSQL
- **Frontend**: React.js / Vue.js (en caso de contar con una interfaz gráfica)
- **Generación de PDFs**: Librerías como pdfkit o jsPDF
- **Control de Versiones**: Git y GitHub

## Instalación

Para instalar y ejecutar el proyecto localmente, siga estos pasos:

1. **Clonar el repositorio:**
   ```sh
   git clone https://github.com/mercadoGanadoTalavera/Proyecto.git
   cd Proyecto
   ```

2. **Instalar dependencias del backend:**
   ```sh
   cd backend
   npm install
   ```

3. **Configurar la base de datos:**
   - Cree una base de datos en MySQL/PostgreSQL.
   - Ejecute los scripts de `SQL/` para inicializar las tablas.

4. **Configurar variables de entorno:**
   Cree un archivo `.env` en la raíz del proyecto con los siguientes valores:
   ```env
   DB_HOST=localhost
   DB_USER=usuario
   DB_PASSWORD=contraseña
   DB_NAME=mercado_lonjas
   ```

5. **Ejecutar el backend:**
   ```sh
   npm start
   ```

6. **(Opcional) Configurar y ejecutar el frontend:**
   ```sh
   cd frontend
   npm install
   npm run dev
   ```

## Uso

- **Acceder al API:** `http://localhost:5000/api`
- **Consultar información de lonjas:**
  ```sh
  curl -X GET http://localhost:5000/api/lonjas
  ```
- **Generar PDF con datos ingresados:**
  ```sh
  curl -X POST http://localhost:5000/api/generar-pdf -d '{"datos": {"producto": "Trigo", "precio": 200}}'
  ```

## Contribución

Si desea contribuir al proyecto:
1. Realice un **fork** del repositorio.
2. Cree una nueva rama con la funcionalidad o corrección.
3. Envíe un **Pull Request** para su revisión.

