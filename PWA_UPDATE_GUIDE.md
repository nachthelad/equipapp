# Guía de Actualizaciones PWA - EquipApp

## 🚀 Sistema de Actualizaciones Implementado

Este proyecto incluye un sistema completo para forzar actualizaciones de la PWA, asegurando que los usuarios siempre tengan la versión más reciente de la aplicación.

## 📋 Características Implementadas

### 1. **Detección Automática de Actualizaciones**

- El service worker detecta automáticamente cuando hay una nueva versión disponible
- Notificación visual en la parte inferior de la pantalla
- Opción para actualizar inmediatamente o posponer

### 2. **Service Worker Personalizado**

- `public/sw-custom.js`: Service worker optimizado para actualizaciones
- Estrategias de cache inteligentes
- Comunicación bidireccional con la aplicación

### 3. **Hooks de React**

- `useUpdateDetection`: Detecta actualizaciones automáticamente
- `useManualUpdate`: Permite verificación manual de actualizaciones

### 4. **Componentes de UI**

- `UpdateNotification`: Notificación automática de actualizaciones
- `UpdateSettings`: Panel de configuración manual
- `ServiceWorkerRegistration`: Registro automático del SW

### 5. **Sistema de Versionado**

- Actualización automática de versiones en build
- Script `update-version.js` para gestión de versiones
- Información de versión en manifest.json

## 🔧 Cómo Funciona

### Actualizaciones Automáticas

1. **Detección**: El service worker verifica actualizaciones cada 30 minutos
2. **Notificación**: Se muestra una notificación cuando hay una nueva versión
3. **Actualización**: El usuario puede actualizar con un clic
4. **Recarga**: La aplicación se recarga automáticamente con la nueva versión

### Actualizaciones Manuales

1. **Panel de Configuración**: Botón "Actualizaciones" en la interfaz
2. **Verificación Manual**: Botón para verificar actualizaciones
3. **Forzar Actualización**: Opción para limpiar cache y recargar

## 🛠️ Uso para Desarrolladores

### Comandos Disponibles

```bash
# Build con actualización automática de versión
npm run build

# Solo actualizar versión
npm run update-version

# Desarrollo
npm run dev
```

### Archivos Principales

- `src/hooks/useUpdateDetection.ts`: Hook para detección automática
- `src/hooks/useManualUpdate.ts`: Hook para actualizaciones manuales
- `src/components/ui/UpdateNotification.tsx`: Notificación automática
- `src/components/ui/UpdateSettings.tsx`: Panel de configuración
- `public/sw-custom.js`: Service worker personalizado
- `scripts/update-version.js`: Script de actualización de versiones

### Configuración

El sistema está configurado automáticamente en:

- `src/app/layout.tsx`: Registro de componentes
- `next.config.mjs`: Configuración de PWA
- `public/manifest.json`: Información de versión

## 📱 Experiencia del Usuario

### Para Usuarios de PWA

1. **Instalación**: La app se instala como PWA
2. **Uso Normal**: La app funciona offline
3. **Actualización Automática**: Notificación cuando hay nueva versión
4. **Actualización Manual**: Opción en configuración

### Para Usuarios Web

1. **Uso Normal**: La app funciona en navegador
2. **Cache Inteligente**: Archivos se cachean automáticamente
3. **Actualizaciones**: Se aplican automáticamente en recarga

## 🔄 Estrategias de Cache

### Archivos Estáticos

- Cache inmediato en instalación
- Actualización automática cuando hay cambios

### Archivos de Next.js

- Cache con verificación de red
- Actualización automática de versiones

### API Calls

- Network First con fallback a cache
- Cache de 24 horas para respuestas exitosas

## 🚨 Solución de Problemas

### Si las actualizaciones no funcionan:

1. Verificar que el service worker esté registrado
2. Limpiar cache del navegador
3. Usar "Forzar Actualización" desde configuración
4. Verificar conexión a internet

### Para desarrollo:

1. Usar `npm run dev` para desarrollo
2. El service worker se deshabilita en desarrollo
3. Usar `npm run build` para probar actualizaciones

## 📈 Monitoreo

### Logs del Service Worker

- Instalación y activación
- Estrategias de cache
- Verificación de actualizaciones

### Información de Versión

- Versión actual en configuración
- Fecha de compilación
- Estado de PWA

## 🔮 Próximas Mejoras

- [ ] Notificaciones push para actualizaciones
- [ ] Actualización en segundo plano
- [ ] Rollback a versiones anteriores
- [ ] Métricas de adopción de actualizaciones

---

**Nota**: Este sistema asegura que los usuarios siempre tengan la versión más reciente de la aplicación, mejorando la experiencia y reduciendo problemas de compatibilidad.
