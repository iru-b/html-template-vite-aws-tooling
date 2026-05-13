import fs from "node:fs";
import { resolve } from "node:path";
import { visualizer } from "rollup-plugin-visualizer";

const shouldAnalyze = process.env.ANALYZE === "true";

function htmlIncludes() {
  return {
    name: "html-includes",
    transformIndexHtml: {
      order: "pre",
      handler(html, ctx) {
        return html.replace(/<!--\s*@include\s+(.*?)\s*-->/g, (_, file) => {
          const filePath = resolve(process.cwd(), file.trim());
          return fs.readFileSync(filePath, "utf-8");
        });
      },
    },
  };
}

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
    htmlIncludes(),

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
