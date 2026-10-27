import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const apiPort = loadEnv(mode, process.cwd(), "").API_PORT || "4174";
  const apiTarget = `http://127.0.0.1:${apiPort}`;
  return {
    plugins: [react()],
    server: { proxy: { "/api": apiTarget } },
    preview: { proxy: { "/api": apiTarget } },
  };
});
