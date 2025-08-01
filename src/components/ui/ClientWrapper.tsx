"use client";

import { ServiceWorkerRegistration } from "./ServiceWorkerRegistration";
import { UpdateNotification } from "./UpdateNotification";
import { VersionIndicator } from "./VersionIndicator";

export function ClientWrapper() {
  return (
    <>
      <ServiceWorkerRegistration />
      <UpdateNotification />
      <VersionIndicator />
    </>
  );
}
