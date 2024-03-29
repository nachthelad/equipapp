import withPWAInit from "@ducanh2912/next-pwa";
/** @type {import('next').NextConfig} */

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  scope: "/",
  workboxOptions: {
    disableDevLogs: true,
  },
});

const nextConfig = { reactStrictMode: false };

export default withPWA(nextConfig);
