#  El Rincón del Buen Sabor - Core MVC System

Sistema Full-Stack de gestión y catalogación de platos para restaurante, diseñado para organizar menús basados en un sistema de proteínas. Desarrollado bajo una arquitectura MVC utilizando **Nuxt 3 (Vue.js)** en el Frontend/Backend y **Microsoft SQL Server** como motor de base de datos relacional.

##  Tecnologías Utilizadas

* **Frontend:** Vue.js (Nuxt 3), HTML5, CSS.
* **Backend:** Nitro Server (Nuxt API Routes), Node.js.
* **Base de Datos:** Microsoft SQL Server.
* **Driver de Conexión:** `mssql`.

##  Características Principales (Core)

* **Arquitectura Full-Stack Integrada:** Conexión directa a SQL Server mediante API interna.
* **Validación de Integridad (Backend):** Bloqueo a nivel de servidor contra inserciones duplicadas evaluando la combinación exacta de `Nombre del Plato + Proteína específica`.
* **Manejo de Relaciones Complejas:** Implementación de llaves foráneas en cascada (Tipos > Categorías > Proteínas > Platos).
* **UI Reactiva:** Formularios de selección en cascada que filtran proteínas dinámicamente según su grupo alimenticio.
* **Tabla en Tiempo Real:** Visualización instantánea de los registros guardados sin necesidad de recargar la página.

##  Requisitos Previos

Para ejecutar este proyecto localmente, necesitas tener instalado:
* [Node.js](https://nodejs.org/) (v18 o superior).
* Microsoft SQL Server y SQL Server Management Studio (SSMS).
* **TCP/IP habilitado** en el puerto `1433` dentro del Administrador de configuración de SQL Server.

##  Instalación y Configuración

**1. Clonar el repositorio y descargar dependencias:**
```bash
git clone [https://github.com/tu-usuario/rincon-core-mvc.git](https://github.com/tu-usuario/rincon-core-mvc.git)
cd rincon-core-mvc
npm install
