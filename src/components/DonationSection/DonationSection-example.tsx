// Ejemplo de uso del componente DonationSection en diferentes proyectos

import DonationSection from "./DonationSection";

// Ejemplo para el proyecto de equipos
export function EquiposDonationSection() {
  return (
    <DonationSection
      title="¿Te gustó el gestor de equipos? Apoya el proyecto"
      buttonText="Donar al proyecto"
      buttonUrl="https://cafecito.app/tu-usuario"
      buttonIcon="⚽"
      variant="card"
      className="mt-8"
    />
  );
}

// Ejemplo para un blog personal
export function BlogDonationSection() {
  return (
    <DonationSection
      title="¿Te sirvió este artículo? Invítame un café"
      buttonText="Comprar un café"
      buttonUrl="https://buymeacoffee.com/tu-usuario"
      buttonIcon="☕"
      variant="minimal"
    />
  );
}

// Ejemplo para un proyecto open source
export function OpenSourceDonationSection() {
  return (
    <DonationSection
      title="Apoya este proyecto open source"
      buttonText="Hacer donación"
      buttonUrl="https://github.com/sponsors/tu-usuario"
      buttonIcon="⭐"
      variant="default"
      className="mt-6 mb-4"
    />
  );
}

// Ejemplo para una aplicación de productividad
export function ProductivityAppDonationSection() {
  return (
    <DonationSection
      title="¿Te ayuda esta app a ser más productivo? Apoya el desarrollo"
      buttonText="Apoyar proyecto"
      buttonUrl="https://ko-fi.com/tu-usuario"
      buttonIcon="🚀"
      variant="card"
    />
  );
}
