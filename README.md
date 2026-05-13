G-PIM: Gestión de Pastillas e Inventario Médico

![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Expo](https://img.shields.io/badge/Expo-1B1F23?style=for-the-badge&logo=expo&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
![JavaScript](https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E)

G-PIM es una solución móvil diseñada para asegurar la continuidad del tratamiento médico en adultos mayores. Conecta en tiempo real la rutina diaria del paciente con un sistema de monitoreo inteligente para su familiar o cuidador.

Este proyecto forma parte del **Taller Aplicado de Programación 004V**.

## Características Principales

* **Interfaces Duales:** * *Modo Adulto Mayor:* UI de alta accesibilidad (botones grandes, alto contraste) para registrar la toma de medicamentos.
    * *Modo Familiar:* Dashboard completo con gráficos e historial.
* **Inventario Inteligente en Tiempo Real:** Algoritmo que calcula los días restantes de medicación basado en la dosis diaria.
* **Alertas Preventivas:** Notificaciones Push (FCM) al dispositivo del familiar cuando el stock llega a niveles críticos (< 15%).
* **Comparador de Precios:** Integración con APIs externas para encontrar la opción de reposición más económica en farmacias.

##  Arquitectura y Tecnologías

El proyecto está desarrollado bajo el patrón arquitectónico **MVVM (Model-View-ViewModel)**, garantizando la separación entre la interfaz de usuario y la lógica de negocio.

* **Frontend:** React Native (Framework) + Expo (Toolchain) + React Native Paper (UI Components).
* **Backend as a Service (BaaS):** * *Firebase Authentication:* Gestión de usuarios y vinculación de cuentas.
    * *Cloud Firestore:* Base de datos NoSQL con sincronización bidireccional en tiempo real.
    * *Firebase Cloud Messaging:* Motor de notificaciones.
