"use client";

import { ApkDownloadToast } from "./ApkDownloadToast";
import { ServiceWorkerRegistration } from "./ServiceWorkerRegistration";
import { UpdateNotification } from "./UpdateNotification";

export function ClientWrapper() {
  return (
    <>
      <ApkDownloadToast />
      <ServiceWorkerRegistration />
      <UpdateNotification />
    </>
  );
}
