# DonationSection Component

Un componente reutilizable para mostrar secciones de donación en cualquier proyecto React/Next.js.

## Instalación

1. Copia el archivo `DonationSection.tsx` a tu proyecto
2. Asegúrate de tener Tailwind CSS instalado (o adapta los estilos según tu framework de CSS)

## Uso Básico

```tsx
import DonationSection from './components/DonationSection';

// Uso con valores por defecto
<DonationSection />

// Uso personalizado
<DonationSection
  title="¿Te gustó este proyecto? Apoya el desarrollo"
  buttonText="Donar"
  buttonUrl="https://tu-link-de-donacion.com"
  buttonIcon="❤️"
/>
```

## Props Disponibles

| Prop         | Tipo                             | Por defecto                          | Descripción                  |
| ------------ | -------------------------------- | ------------------------------------ | ---------------------------- |
| `title`      | string                           | "¿Te gustó la app? Invítame un café" | Texto del título             |
| `buttonText` | string                           | "Invitar un cafecito"                | Texto del botón              |
| `buttonUrl`  | string                           | "https://cafecito.app/nachthelad"    | URL del enlace de donación   |
| `buttonIcon` | string                           | "☕"                                 | Icono del botón              |
| `className`  | string                           | ""                                   | Clases CSS adicionales       |
| `variant`    | 'default' \| 'minimal' \| 'card' | 'default'                            | Estilo visual del componente |

## Variantes

### Default

```tsx
<DonationSection variant="default" />
```

### Minimal

```tsx
<DonationSection variant="minimal" />
```

### Card

```tsx
<DonationSection variant="card" />
```

## Ejemplos de Uso

### Para un proyecto de equipos

```tsx
<DonationSection
  title="¿Te gustó el gestor de equipos? Apoya el proyecto"
  buttonText="Donar al proyecto"
  buttonUrl="https://cafecito.app/tu-usuario"
  buttonIcon="⚽"
  variant="card"
/>
```

### Para un blog personal

```tsx
<DonationSection
  title="¿Te sirvió este artículo? Invítame un café"
  buttonText="Comprar un café"
  buttonUrl="https://buymeacoffee.com/tu-usuario"
  buttonIcon="☕"
  variant="minimal"
/>
```

### Con estilos personalizados

```tsx
<DonationSection
  className="mt-8 mb-4"
  title="Apoya este proyecto open source"
  buttonText="Hacer donación"
  buttonUrl="https://github.com/sponsors/tu-usuario"
  buttonIcon="⭐"
/>
```

## Personalización de Estilos

El componente usa Tailwind CSS. Si necesitas personalizar los estilos, puedes:

1. Modificar las clases en el componente
2. Usar la prop `className` para agregar estilos adicionales
3. Crear nuevas variantes en el objeto `variantClasses`

## Dependencias

- React
- Tailwind CSS (para los estilos)
- TypeScript (opcional, pero recomendado)
