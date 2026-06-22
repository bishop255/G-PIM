# G-PIM: Gestor Predictivo de Insumos Médicos

![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge\&logo=react\&logoColor=61DAFB)
![Expo](https://img.shields.io/badge/Expo-1B1F23?style=for-the-badge\&logo=expo\&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge\&logo=firebase\&logoColor=black)
![JavaScript](https://img.shields.io/badge/JavaScript-323330?style=for-the-badge\&logo=javascript\&logoColor=F7DF1E)

## Descripción del Proyecto

G-PIM (Gestor Predictivo de Insumos Médicos) es una aplicación móvil desarrollada para apoyar el control y seguimiento de tratamientos médicos en adultos mayores.

La solución permite a familiares y cuidadores supervisar en tiempo real el cumplimiento del tratamiento, gestionar inventarios de medicamentos, recibir alertas preventivas de agotamiento, comparar precios en farmacias y acceder a información farmacológica asistida por Inteligencia Artificial.

El sistema busca mejorar la adherencia a los tratamientos médicos, reducir riesgos asociados al quiebre de stock de medicamentos y facilitar el seguimiento remoto de pacientes desde cualquier lugar y en cualquier momento.

Este proyecto fue desarrollado en el contexto de la asignatura **Taller Aplicado de Programación 004V**.

---

# Características Principales

### Gestión de Usuarios

* Registro e inicio de sesión mediante Firebase Authentication.
* Gestión de perfiles de cuidador y paciente.
* Cierre seguro de sesión.

### Vinculación Cuidador – Paciente

* Asociación de cuentas mediante código QR.
* Relación en tiempo real entre paciente y cuidador.

### Gestión de Medicamentos

* Registro de medicamentos e insumos médicos.
* Actualización manual de stock.
* Control de inventario en tiempo real.
* Registro de horarios de administración.
* Seguimiento de consumo diario.

### Automatización Inteligente

* Cálculo automático de consumo de medicamentos.
* Proyección de agotamiento de stock.
* Estimación de días restantes de tratamiento.
* Indicadores visuales de nivel de seguridad del inventario.

### Alertas y Notificaciones

* Alertas de stock crítico.
* Alertas preventivas de agotamiento.
* Notificaciones Push mediante Firebase Cloud Messaging.
* Seguimiento remoto entre paciente y cuidador.

### Seguimiento del Tratamiento

* Confirmación de dosis tomadas por el paciente.
* Historial de administración de medicamentos.
* Supervisión remota por parte del cuidador.

### Emergencias

* Generación de alertas de emergencia.
* Comunicación inmediata entre paciente y cuidador.

### Comparador de Precios

* Consulta de precios de medicamentos en farmacias online.
* Identificación de alternativas más económicas para reposición.

### Inteligencia Artificial

* Consulta automática de información farmacológica.
* Resumen de uso del medicamento.
* Recomendaciones y advertencias generales.
* Información generada mediante OpenAI GPT.

---

# Arquitectura y Tecnologías

El proyecto está desarrollado bajo el patrón arquitectónico **MVVM (Model-View-ViewModel)**, permitiendo separar la interfaz de usuario de la lógica de negocio y facilitando la mantenibilidad del sistema.

## Frontend

* React Native
* Expo
* JavaScript (ES6)
* TypeScript (Modelos de datos)
* React Navigation

## Backend

### Backend as a Service (BaaS)

* Firebase Authentication
* Cloud Firestore
* Firebase Cloud Messaging (FCM)

### Servicios Externos

* OpenAI API
* APIs de consulta de precios farmacéuticos

### Backend Complementario

* Node.js
* Express.js

---

# Tecnologías Utilizadas

## Lenguajes

* JavaScript (ES6)
* TypeScript
* JSX

## Frameworks y Librerías

* React Native
* Expo
* Firebase SDK
* Expo Notifications
* Expo Camera
* Expo Location
* React Native QRCode SVG
* React Native Vector Icons

## Base de Datos

* Cloud Firestore (NoSQL)

## Servicios Cloud

* Firebase Authentication
* Firebase Cloud Messaging
* OpenAI API

---

# Estructura del Equipo

| Integrante      | Rol                              |
| --------------- | -------------------------------- |
| Andrés Moreno   | Arquitecto de Software y Backend |
| Andrés Figueroa | Gestor de Proyecto y QA          |
| Nicolas Moraga  | Diseñador UI/UX y Frontend       |

## Responsabilidades

### Andrés Moreno – Arquitecto de Software y Backend

* Diseño de la arquitectura general del sistema.
* Definición e implementación del patrón MVVM.
* Integración y configuración de Firebase.
* Desarrollo del backend complementario con Node.js y Express.
* Integración de APIs externas para comparación de precios.
* Integración de Inteligencia Artificial mediante OpenAI.
* Configuración de despliegue y publicación de servicios.
* Soporte técnico y mantenimiento de infraestructura.

### Andrés Figueroa – Gestor de Proyecto y QA

* Planificación y coordinación de actividades del proyecto.
* Levantamiento y gestión de requerimientos.
* Elaboración de documentación técnica y funcional.
* Diseño y ejecución de casos de prueba.
* Validación de funcionalidades implementadas.
* Control de calidad y seguimiento de incidencias.
* Apoyo en el desarrollo e integración de funcionalidades.
* Preparación de informes y entregables académicos.

### Nicolas Moraga – Diseñador UI/UX y Frontend

* Diseño de experiencia de usuario (UX).
* Diseño visual de interfaces (UI).
* Creación de prototipos y wireframes.
* Implementación de interfaces en React Native.
* Diseño de componentes visuales y estilos.
* Optimización de accesibilidad y usabilidad.
* Colaboración en el desarrollo de pantallas para cuidador y paciente.
* Apoyo en pruebas de interfaz y experiencia de usuario.

---

# Estado del Proyecto

Versión actual: **1.0.0**

Estado: **Funcional y desplegado**

Características implementadas:

* Gestión de usuarios.
* Gestión de pacientes.
* Gestión de medicamentos.
* Inventario inteligente.
* Alertas preventivas.
* Emergencias.
* Comparador de precios.
* Información farmacológica mediante IA.
* Notificaciones Push.
* Seguimiento remoto en tiempo real.
