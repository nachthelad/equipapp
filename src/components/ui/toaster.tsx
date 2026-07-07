"use client";

import { useToast } from "@/hooks/use-toast";
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, persistent, ...props }) {
        return (
          <Toast
            key={id}
            {...props}
            data-persistent={persistent ? "" : undefined}
            className="bg-gray-800/95 backdrop-blur-sm border-gray-600 shadow-xl"
          >
            <div className="grid gap-1">
              {title && <ToastTitle className="text-white">{title}</ToastTitle>}
              {description && (
                <ToastDescription className="text-gray-300">
                  {description}
                </ToastDescription>
              )}
            </div>
            {action}
            <ToastClose className="text-white/70 hover:text-white focus:ring-white/60" />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
