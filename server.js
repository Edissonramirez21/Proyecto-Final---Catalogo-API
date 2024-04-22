import http from "http";
import app from "./app/app.js";

//Crear servidor
const PUERTO = process.env.PUERTO || 7000;
const server = http.createServer(app);
server.listen(PUERTO, console.log(`el servidor esta corriendo en el puerto ${PUERTO}`));