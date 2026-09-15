# Aplicacion de Resenas de Libros

Proyecto final en Node.js y Express con operaciones CRUD, sesiones y JWT.

## Ejecutar

```bash
npm install
npm start
```

Servidor: `http://localhost:5000`

## Pruebas rapidas

```bash
curl http://localhost:5000/
curl http://localhost:5000/isbn/1
curl http://localhost:5000/author/Chinua%20Achebe
curl http://localhost:5000/title/Things%20Fall%20Apart
curl http://localhost:5000/review/1
curl -X POST http://localhost:5000/register -H 'Content-Type: application/json' -d '{"username":"didier","password":"clave123"}'
curl -c cookies.txt -X POST http://localhost:5000/customer/login -H 'Content-Type: application/json' -d '{"username":"didier","password":"clave123"}'
curl -b cookies.txt -X PUT 'http://localhost:5000/customer/auth/review/1?review=Excelente'
curl -b cookies.txt -X DELETE http://localhost:5000/customer/auth/review/1
```

Los endpoints `/async/books`, `/async/isbn/:isbn`, `/async/author/:author` y `/async/title/:title` implementan las tareas 10 a 13 con Async/Await y Axios.

> Nota: los usuarios, sesiones y reseñas se almacenan en memoria y se reinician cuando se detiene el servidor.

