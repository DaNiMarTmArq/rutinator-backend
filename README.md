# 🏃‍♂️ Rutinator Backend

## 🚀 Introducción

Rutinator es una aplicación diseñada para gestionar **rutinas personalizadas** basadas en tus objetivos, intereses y disponibilidad.  
Este repositorio contiene el **backend** de la app, encargado de la lógica de negocio, la comunicación con la base de datos y la integración con servicios externos para ofrecer una experiencia completa y escalable.

## 🏗️ Arquitectura de Capas

El proyecto sigue una arquitectura en capas para mantener el código modular y fácil de mantener:

1. **Modelo**  
   Define los esquemas y entidades que representan los datos (usuarios, rutinas, actividades, etc.).

2. **Servicio**  
   Contiene la lógica de negocio:

   - Validaciones
   - Autenticación de usuarios
   - Creacion de rutinas, actividades, intereses, etc.
   - Integración con OpenAI para generación de rutinas
   - Envío de emails y descarga de PDFs

3. **Controlador**  
   Expone los endpoints HTTP, recibe las solicitudes, delega en los servicios correspondientes y devuelve las respuestas al cliente.

## 🛠️ Tecnología

- **Node.js + TypeScript**
- **Express** para el servidor HTTP
- **MySQL2** como base de datos relacional
- **Zod** para validación de esquemas
- **jsonwebtoken** (JWT) para autenticación
- **bcrypt** para hashing de contraseñas
- **CORS** para gestionar orígenes cruzados
- **Multer** y **mime** para manejo de archivos
- **Nodemailer** para envío de correos electrónicos 📧
- **PDFKit** para generar descargas de rutina en PDF 📄
- **OpenAI SDK** para crear rutinas personalizadas con IA 🤖
- **dotenv** para configuración con variables de entorno

## ⚙️ Cómo iniciar el proyecto

1. **Clonar el repositorio**

   ```bash
   git clone https://github.com/DaNiMarTmArq/rutinator-backend
   cd rutinator-backend
   ```

2. **Instalar dependencias**

   ```bash
   npm install
   ```

3. **Configurar variables de entorno**  
   Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

   ```env
   DB_HOST=<tu_db_host>
   DB_USER=<tu_db_usuario>
   DB_PASSWORD=<tu_db_contraseña>
   DB_NAME=<tu_nombre_de_base_de_datos>
   DB_PORT=<puerto_mysql>
   JWT_SECRET=<secreto_para_jwt>
   NODE_ENV=development
   OPENAI_API_KEY=<tu_api_key_openai>
   ```

4. **Compilar TypeScript**

   ```bash
   npm run build
   ```

5. **Arrancar el servidor**

   ```bash
   npm start
   ```

6. **¡Listo!**  
   El servidor estará disponible en `http://localhost:3000` (o el puerto configurado).

---

✨ Gracias por usar Rutinator. ¡A crear rutinas exitosas! 💪
