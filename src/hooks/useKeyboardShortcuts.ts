"use client";
import { useEffect, useCallback } from "react";

interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  action: () => void;
  description: string;
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[]) {
  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    // Don't trigger shortcuts when user is typing in form fields
    if (
      event.target instanceof HTMLInputElement ||
      event.target instanceof HTMLTextAreaElement ||
      event.target instanceof HTMLSelectElement ||
      (event.target as HTMLElement)?.contentEditable === "true"
    ) {
      return;
    }

    const shortcut = shortcuts.find((s) => {
      return (
        s.key.toLowerCase() === event.key.toLowerCase() &&
        (s.ctrlKey ?? false) === (event.ctrlKey || event.metaKey) &&
        (s.shiftKey ?? false) === event.shiftKey &&
        (s.altKey ?? false) === event.altKey
      );
    });

    if (shortcut) {
      event.preventDefault();
      shortcut.action();
    }
  }, [shortcuts]);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleKeyPress]);
}

export function useGlobalKeyboardShortcuts() {
  const showShortcutsHelp = useCallback(() => {
    const shortcuts = [
      "Ctrl/Cmd + Enter: Enviar formulario",
      "R: Redistribuir equipos",
      "C: Copiar equipos",
      "W: Compartir por WhatsApp",
      "B: Volver atrás",
      "?: Mostrar ayuda de atajos",
      "Esc: Cerrar modales",
    ];
    
    alert(`⌨️ Atajos de teclado:\n\n${shortcuts.join("\n")}`);
  }, []);

  const shortcuts: KeyboardShortcut[] = [
    {
      key: "?",
      action: showShortcutsHelp,
      description: "Mostrar atajos de teclado",
    },
    {
      key: "Escape",
      action: () => {
        // Close any open modals/dialogs
        const escEvent = new KeyboardEvent("keydown", { key: "Escape" });
        document.dispatchEvent(escEvent);
      },
      description: "Cerrar modales",
    },
  ];

  useKeyboardShortcuts(shortcuts);
}