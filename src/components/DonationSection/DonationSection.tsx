import { motion } from "framer-motion";

interface DonationSectionProps {
  title?: string;
  buttonText?: string;
  buttonUrl?: string;
  buttonIcon?: string;
  className?: string;
  variant?: "default" | "minimal" | "card" | "glass";
}

export default function DonationSection({
  title = "¿Te gustó la app? Invítame un café",
  buttonText = "Invitar un cafecito",
  buttonUrl = "https://cafecito.app/nachthelad",
  buttonIcon = "☕",
  className = "",
  variant = "default",
}: DonationSectionProps) {
  const baseClasses = "mt-6 text-center";

  const variantClasses = {
    default: "bg-gray-50 rounded-xl p-4 border border-gray-200",
    minimal: "bg-transparent p-2",
    card: "bg-white rounded-lg p-6 shadow-md border border-gray-100",
    glass: "glass rounded-2xl p-6 shadow-2xl",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className={`${baseClasses} ${className}`}
    >
      <div className={variantClasses[variant]}>
        <p
          className={`text-sm mb-3 ${
            variant === "glass" ? "text-white/80" : "text-gray-600"
          }`}
        >
          {title}
        </p>
        <a
          href={buttonUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          <span className="mr-2">{buttonIcon}</span>
          {buttonText}
        </a>
      </div>
    </motion.div>
  );
}
