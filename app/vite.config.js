import { resolve } from "node:path";
import { visualizer } from "rollup-plugin-visualizer";

const shouldAnalyze = process.env.ANALYZE === "true";

export default {
  root: ".",

  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        next: resolve(__dirname, "next.html"),
        notFound: resolve(__dirname, "404.html"),
      },
    },
    outDir: "dist",
  },

  plugins: [
    shouldAnalyze &&
      visualizer({
        filename: "dist/bundle-analysis.html",
        open: true,
        gzipSize: true,
        brotliSize: true,
      }),
  ].filter(Boolean),

  server: {
    port: 8080,
  },

  css: {
    preprocessorOptions: {
      scss: {
        silenceDeprecations: [
          "import",
          "mixed-decls",
          "color-functions",
          "global-builtin",
        ],
      },
    },
  },
};
