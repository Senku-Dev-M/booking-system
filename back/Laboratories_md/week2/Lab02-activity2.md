## 1. Configuración del Servidor
El servidor de la API se ha configurado utilizando el framework Express. La configuración principal reside en `src/app.ts` (compilado a `src/app.js` para su ejecución en Node.js).

*   **Configuración básica con Express:** Se inicializa una aplicación Express para gestionar las solicitudes HTTP.
*   **Middleware para manejar datos JSON (`body-parser`):**
    Se utiliza `app.use(bodyParser.json());` para que la aplicación Express pueda parsear automáticamente los cuerpos de las solicitudes entrantes que contengan datos en formato JSON.


## 2. Diseño y Documentación de Endpoints RESTful

Se ha diseñado una API RESTful para gestionar los recursos principales del sistema de reservas hoteleras: Hoteles y Habitaciones. 
### Conceptos de Métodos HTTP:

*   **`GET`**:
    *   **Propósito:** Se utiliza para solicitar y recuperar una representación de un recurso específico o una colección de recursos.
*   **`POST`**:
    *   **Propósito:** Se utiliza para enviar datos a un recurso identificado, generalmente con el fin de crear un nuevo recurso en el servidor.
*   **`PUT`**:
    *   **Propósito:** Se utiliza para actualizar completamente un recurso existente o para crear un recurso si no existe, con los datos proporcionados en el cuerpo de la solicitud.
*   **`DELETE`**:
    *   **Propósito:** Se utiliza para eliminar el recurso especificado por la URL.

### Endpoints Diseñados para la API del Capstone:

Todos los endpoints de la API están prefijados con `/api/v1/`.

#### **Recurso: Hoteles (`/api/v1/hotels`)**

| Método HTTP | Ruta                  | Propósito General                      | Descripción Detallada                                  |
| :---------- | :-------------------- | :------------------------------------- | :----------------------------------------------------- |
| `GET`       | `/api/v1/hotels`      | Obtener todos los hoteles              | Recupera una lista completa de todos los hoteles registrados en el sistema. |
| `GET`       | `/api/v1/hotels/:id`  | Obtener un hotel por ID                | Recupera los detalles de un hotel específico utilizando su identificador único. |
| `POST`      | `/api/v1/hotels`      | Crear un nuevo hotel                   | Permite registrar un nuevo hotel en la base de datos con los datos proporcionados. |
| `PUT`       | `/api/v1/hotels/:id`  | Actualizar un hotel existente          | Modifica la información de un hotel específico identificado por su ID. |
| `DELETE`    | `/api/v1/hotels/:id`  | Eliminar un hotel                      | Elimina un hotel del sistema utilizando su identificador único. |

#### **Recurso: Habitaciones (`/api/v1/rooms`)**

| Método HTTP | Ruta                  | Propósito General                      | Descripción Detallada                                  |
| :---------- | :-------------------- | :------------------------------------- | :----------------------------------------------------- |
| `GET`       | `/api/v1/rooms`       | Obtener y buscar habitaciones          | Recupera una lista de todas las habitaciones, con la capacidad de aplicar filtros de búsqueda (ej., por número de personas, ubicación, rango de precios). |
| `GET`       | `/api/v1/rooms/:id`   | Obtener una habitación por ID          | Recupera los detalles de una habitación específica utilizando su identificador único. |
| `POST`      | `/api/v1/rooms`       | Crear una nueva habitación             | Permite registrar una nueva habitación en el sistema, asociada a un hotel existente. |
| `PUT`       | `/api/v1/rooms/:id`   | Actualizar una habitación existente    | Modifica la información de una habitación específica identificada por su ID. |
| `DELETE`    | `/api/v1/rooms/:id`   | Eliminar una habitación                | Elimina una habitación del sistema utilizando su identificador único. |

En cuanto a la estructura del rpoyecto tenemos:
D:.
├───application
│   ├───services
│   └───useCases
│       ├───bookings
│       ├───hotels
│       └───rooms
├───domain
│   ├───entities
│   ├───exceptions
│   └───repositories
├───infrastructure
│   ├───config
│   ├───database
│   │   └───models
│   ├───repositories
│   └───web
├───interfaces
│   ├───dtos
│   └───http
│       ├───controllers
│       ├───middlewares
│       └───routes
└───shared
    ├───constants
    ├───types
    └───utils

Usando Clean Architecture
Tambien se uso swagger para la prueba de los endpoints en lugar de postman xD