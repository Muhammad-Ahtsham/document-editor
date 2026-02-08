import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const isProduction = mode === 'production';

  return {
    plugins: [react()],
    ...(!isProduction && {
      server: {
        proxy: {
          "/api": {
            target: env.VITE_API_URL,
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api/, ""),
          },
        },
      },
    }),
    define: {
      'process.env.VITE_API_URL': JSON.stringify(env.VITE_API_URL),
      'import.meta.env.VITE_API_URL': JSON.stringify(env.VITE_API_URL)
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});