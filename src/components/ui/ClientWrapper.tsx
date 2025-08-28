"use client";

import { ServiceWorkerRegistration } from "./ServiceWorkerRegistration";
import { UpdateNotification } from "./UpdateNotification";

export function ClientWrapper() {
  return (
    <>
      <ServiceWorkerRegistration />
      <UpdateNotification />
    </>
  );
}
