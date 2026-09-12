import tailwindcss from "@tailwindcss/vite"
import laravel from "laravel-vite-plugin"
import react from "@vitejs/plugin-react"
import inertia from "@inertiajs/vite"
import { fileURLToPath } from "url"
import { defineConfig } from "vite"
import path from "path"

const to = (x) => path.resolve(path.dirname(fileURLToPath(import.meta.url)), x)

export default defineConfig({
  plugins: [
    laravel({
      input: ["resources/js/app.jsx"],
      refresh: true
    }),
    tailwindcss(),
    inertia(),
    react()
  ],
  resolve: {
    alias: {
      "@": to("./resources/js")
    }
  }
})
