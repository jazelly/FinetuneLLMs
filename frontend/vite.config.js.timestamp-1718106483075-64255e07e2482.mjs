// vite.config.js
import { defineConfig } from "file:///mnt/e/github/my/FinetuneLLMs/frontend/node_modules/vite/dist/node/index.js";
import { fileURLToPath, URL } from "url";

// postcss.config.js
import tailwind from "file:///mnt/e/github/my/FinetuneLLMs/frontend/node_modules/tailwindcss/lib/index.js";
import autoprefixer from "file:///mnt/e/github/my/FinetuneLLMs/frontend/node_modules/autoprefixer/lib/autoprefixer.js";

// tailwind.config.js
var tailwind_config_default = {
  darkMode: "false",
  content: {
    relative: true,
    files: [
      "./src/components/**/*.{js,jsx}",
      "./src/hooks/**/*.js",
      "./src/models/**/*.js",
      "./src/pages/**/*.{js,jsx}",
      "./src/utils/**/*.js",
      "./src/*.jsx",
      "./index.html",
      "./node_modules/@tremor/**/*.{js,ts,jsx,tsx}"
    ]
  },
  theme: {
    extend: {
      rotate: {
        270: "270deg",
        360: "360deg"
      },
      colors: {
        "black-900": "#141414",
        accent: "#3D4147",
        "sidebar-button": "#31353A",
        sidebar: "#ebeef7",
        main: "#eef4fa",
        "historical-msg-system": "rgba(255, 255, 255, 0.05);",
        "historical-msg-user": "#2C2F35",
        outline: "#4E5153",
        dashboard: "#f7fafa",
        "sidebar-logo-inactive": "#748497",
        "sidebar-logo-active": "#5f27cd",
        "header-inactive": "#909dae",
        "header-logo-static": "#737b85",
        divline: "#eef4fa",
        "main-title": "#404b58"
      },
      backgroundImage: {
        "preference-gradient": "linear-gradient(180deg, #5A5C63 0%, rgba(90, 92, 99, 0.28) 100%);",
        "chat-msg-user-gradient": "linear-gradient(180deg, #3D4147 0%, #2C2F35 100%);",
        "selected-preference-gradient": "linear-gradient(180deg, #313236 0%, rgba(63.40, 64.90, 70.13, 0) 100%);",
        "main-gradient": "linear-gradient(180deg, #3D4147 0%, #2C2F35 100%)",
        "modal-gradient": "linear-gradient(180deg, #3D4147 0%, #2C2F35 100%)",
        "sidebar-gradient": "linear-gradient(90deg, #5B616A 0%, #3F434B 100%)",
        "dashboard-gradient": "linear-gradient(to bottom right, #0b1a55, #0e2a5e)",
        "login-gradient": "linear-gradient(180deg, #3D4147 0%, #2C2F35 100%)",
        "menu-item-gradient": "linear-gradient(90deg, #3D4147 0%, #2C2F35 100%)",
        "menu-item-selected-gradient": "linear-gradient(90deg, #5B616A 0%, #3F434B 100%)",
        "workspace-item-gradient": "linear-gradient(90deg, #3D4147 0%, #2C2F35 100%)",
        "workspace-item-selected-gradient": "linear-gradient(90deg, #5B616A 0%, #3F434B 100%)",
        "switch-selected": "linear-gradient(146deg, #5B616A 0%, #3F434B 100%)"
      },
      fontFamily: {
        sans: [
          "plus-jakarta-sans",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Roboto",
          '"Helvetica Neue"',
          "Arial",
          '"Noto Sans"',
          "sans-serif",
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
          '"Noto Color Emoji"'
        ]
      },
      animation: {
        sweep: "sweep 0.5s ease-in-out"
      },
      keyframes: {
        sweep: {
          "0%": { transform: "scaleX(0)", transformOrigin: "bottom left" },
          "100%": { transform: "scaleX(1)", transformOrigin: "bottom left" }
        },
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 }
        },
        fadeOut: {
          "0%": { opacity: 1 },
          "100%": { opacity: 0 }
        }
      }
    }
  },
  // Required for rechart styles to show since they can be rendered dynamically and will be tree-shaken if not safe-listed.
  safelist: [
    {
      pattern: /^(bg-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
      variants: ["hover", "ui-selected"]
    },
    {
      pattern: /^(text-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
      variants: ["hover", "ui-selected"]
    },
    {
      pattern: /^(border-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
      variants: ["hover", "ui-selected"]
    },
    {
      pattern: /^(ring-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/
    },
    {
      pattern: /^(stroke-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/
    },
    {
      pattern: /^(fill-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/
    }
  ],
  plugins: []
};

// postcss.config.js
var postcss_config_default = {
  plugins: [tailwind(tailwind_config_default), autoprefixer]
};

// vite.config.js
import react from "file:///mnt/e/github/my/FinetuneLLMs/frontend/node_modules/@vitejs/plugin-react/dist/index.mjs";
import dns from "dns";
import { visualizer } from "file:///mnt/e/github/my/FinetuneLLMs/frontend/node_modules/rollup-plugin-visualizer/dist/plugin/index.js";
var __vite_injected_original_import_meta_url = "file:///mnt/e/github/my/FinetuneLLMs/frontend/vite.config.js";
dns.setDefaultResultOrder("verbatim");
var vite_config_default = defineConfig({
  server: {
    port: 3e3,
    host: "localhost",
    watch: {
      usePolling: true
    }
  },
  define: {
    "process.env": process.env
  },
  css: {
    postcss: postcss_config_default
  },
  plugins: [
    react(),
    visualizer({
      template: "treemap",
      // or sunburst
      open: false,
      gzipSize: true,
      brotliSize: true,
      filename: "bundleinspector.html"
      // will be saved in project's root
    })
  ],
  resolve: {
    alias: [
      {
        find: "@",
        replacement: fileURLToPath(new URL("./src", __vite_injected_original_import_meta_url))
      },
      {
        process: "process/browser",
        stream: "stream-browserify",
        zlib: "browserify-zlib",
        util: "util",
        find: /^~.+/,
        replacement: (val) => {
          return val.replace(/^~/, "");
        }
      }
    ]
  },
  build: {
    rollupOptions: {
      external: [
        // Reduces transformation time by 50% and we don't even use this variant, so we can ignore.
        /@phosphor-icons\/react\/dist\/ssr/
      ]
    },
    commonjsOptions: {
      transformMixedEsModules: true
    }
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: "globalThis"
      },
      plugins: []
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiLCAicG9zdGNzcy5jb25maWcuanMiLCAidGFpbHdpbmQuY29uZmlnLmpzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL21udC9lL2dpdGh1Yi9teS9GaW5ldHVuZUxMTXMvZnJvbnRlbmRcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9tbnQvZS9naXRodWIvbXkvRmluZXR1bmVMTE1zL2Zyb250ZW5kL3ZpdGUuY29uZmlnLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9tbnQvZS9naXRodWIvbXkvRmluZXR1bmVMTE1zL2Zyb250ZW5kL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIlxuaW1wb3J0IHsgZmlsZVVSTFRvUGF0aCwgVVJMIH0gZnJvbSBcInVybFwiXG5pbXBvcnQgcG9zdGNzcyBmcm9tIFwiLi9wb3N0Y3NzLmNvbmZpZy5qc1wiXG5pbXBvcnQgcmVhY3QgZnJvbSBcIkB2aXRlanMvcGx1Z2luLXJlYWN0XCJcbmltcG9ydCBkbnMgZnJvbSBcImRuc1wiXG5pbXBvcnQgeyB2aXN1YWxpemVyIH0gZnJvbSBcInJvbGx1cC1wbHVnaW4tdmlzdWFsaXplclwiXG5cbmRucy5zZXREZWZhdWx0UmVzdWx0T3JkZXIoXCJ2ZXJiYXRpbVwiKVxuXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgc2VydmVyOiB7XG4gICAgcG9ydDogMzAwMCxcbiAgICBob3N0OiBcImxvY2FsaG9zdFwiLFxuICAgIHdhdGNoOiB7XG4gICAgICB1c2VQb2xsaW5nOiB0cnVlLFxuICAgIH1cbiAgfSxcbiAgZGVmaW5lOiB7XG4gICAgXCJwcm9jZXNzLmVudlwiOiBwcm9jZXNzLmVudlxuICB9LFxuICBjc3M6IHtcbiAgICBwb3N0Y3NzXG4gIH0sXG4gIHBsdWdpbnM6IFtcbiAgICByZWFjdCgpLFxuICAgIHZpc3VhbGl6ZXIoe1xuICAgICAgdGVtcGxhdGU6IFwidHJlZW1hcFwiLCAvLyBvciBzdW5idXJzdFxuICAgICAgb3BlbjogZmFsc2UsXG4gICAgICBnemlwU2l6ZTogdHJ1ZSxcbiAgICAgIGJyb3RsaVNpemU6IHRydWUsXG4gICAgICBmaWxlbmFtZTogXCJidW5kbGVpbnNwZWN0b3IuaHRtbFwiIC8vIHdpbGwgYmUgc2F2ZWQgaW4gcHJvamVjdCdzIHJvb3RcbiAgICB9KVxuICBdLFxuICByZXNvbHZlOiB7XG4gICAgYWxpYXM6IFtcbiAgICAgIHtcbiAgICAgICAgZmluZDogXCJAXCIsXG4gICAgICAgIHJlcGxhY2VtZW50OiBmaWxlVVJMVG9QYXRoKG5ldyBVUkwoXCIuL3NyY1wiLCBpbXBvcnQubWV0YS51cmwpKVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgcHJvY2VzczogXCJwcm9jZXNzL2Jyb3dzZXJcIixcbiAgICAgICAgc3RyZWFtOiBcInN0cmVhbS1icm93c2VyaWZ5XCIsXG4gICAgICAgIHpsaWI6IFwiYnJvd3NlcmlmeS16bGliXCIsXG4gICAgICAgIHV0aWw6IFwidXRpbFwiLFxuICAgICAgICBmaW5kOiAvXn4uKy8sXG4gICAgICAgIHJlcGxhY2VtZW50OiAodmFsKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIHZhbC5yZXBsYWNlKC9efi8sIFwiXCIpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICBdXG4gIH0sXG4gIGJ1aWxkOiB7XG4gICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgZXh0ZXJuYWw6IFtcbiAgICAgICAgLy8gUmVkdWNlcyB0cmFuc2Zvcm1hdGlvbiB0aW1lIGJ5IDUwJSBhbmQgd2UgZG9uJ3QgZXZlbiB1c2UgdGhpcyB2YXJpYW50LCBzbyB3ZSBjYW4gaWdub3JlLlxuICAgICAgICAvQHBob3NwaG9yLWljb25zXFwvcmVhY3RcXC9kaXN0XFwvc3NyLyxcbiAgICAgIF1cbiAgICB9LFxuICAgIGNvbW1vbmpzT3B0aW9uczoge1xuICAgICAgdHJhbnNmb3JtTWl4ZWRFc01vZHVsZXM6IHRydWVcbiAgICB9XG4gIH0sXG4gIG9wdGltaXplRGVwczoge1xuICAgIGVzYnVpbGRPcHRpb25zOiB7XG4gICAgICBkZWZpbmU6IHtcbiAgICAgICAgZ2xvYmFsOiBcImdsb2JhbFRoaXNcIlxuICAgICAgfSxcbiAgICAgIHBsdWdpbnM6IFtdXG4gICAgfVxuICB9XG59KVxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvbW50L2UvZ2l0aHViL215L0ZpbmV0dW5lTExNcy9mcm9udGVuZFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL21udC9lL2dpdGh1Yi9teS9GaW5ldHVuZUxMTXMvZnJvbnRlbmQvcG9zdGNzcy5jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL21udC9lL2dpdGh1Yi9teS9GaW5ldHVuZUxMTXMvZnJvbnRlbmQvcG9zdGNzcy5jb25maWcuanNcIjtpbXBvcnQgdGFpbHdpbmQgZnJvbSAndGFpbHdpbmRjc3MnXG5pbXBvcnQgYXV0b3ByZWZpeGVyIGZyb20gJ2F1dG9wcmVmaXhlcidcbmltcG9ydCB0YWlsd2luZENvbmZpZyBmcm9tICcuL3RhaWx3aW5kLmNvbmZpZy5qcydcblxuZXhwb3J0IGRlZmF1bHQge1xuICBwbHVnaW5zOiBbdGFpbHdpbmQodGFpbHdpbmRDb25maWcpLCBhdXRvcHJlZml4ZXJdLFxufSIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL21udC9lL2dpdGh1Yi9teS9GaW5ldHVuZUxMTXMvZnJvbnRlbmRcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9tbnQvZS9naXRodWIvbXkvRmluZXR1bmVMTE1zL2Zyb250ZW5kL3RhaWx3aW5kLmNvbmZpZy5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vbW50L2UvZ2l0aHViL215L0ZpbmV0dW5lTExNcy9mcm9udGVuZC90YWlsd2luZC5jb25maWcuanNcIjsvKiogQHR5cGUge2ltcG9ydCgndGFpbHdpbmRjc3MnKS5Db25maWd9ICovXG5leHBvcnQgZGVmYXVsdCB7XG4gIGRhcmtNb2RlOiBcImZhbHNlXCIsXG4gIGNvbnRlbnQ6IHtcbiAgICByZWxhdGl2ZTogdHJ1ZSxcbiAgICBmaWxlczogW1xuICAgICAgXCIuL3NyYy9jb21wb25lbnRzLyoqLyoue2pzLGpzeH1cIixcbiAgICAgIFwiLi9zcmMvaG9va3MvKiovKi5qc1wiLFxuICAgICAgXCIuL3NyYy9tb2RlbHMvKiovKi5qc1wiLFxuICAgICAgXCIuL3NyYy9wYWdlcy8qKi8qLntqcyxqc3h9XCIsXG4gICAgICBcIi4vc3JjL3V0aWxzLyoqLyouanNcIixcbiAgICAgIFwiLi9zcmMvKi5qc3hcIixcbiAgICAgIFwiLi9pbmRleC5odG1sXCIsXG4gICAgICBcIi4vbm9kZV9tb2R1bGVzL0B0cmVtb3IvKiovKi57anMsdHMsanN4LHRzeH1cIixcbiAgICBdLFxuICB9LFxuICB0aGVtZToge1xuICAgIGV4dGVuZDoge1xuICAgICAgcm90YXRlOiB7XG4gICAgICAgIDI3MDogXCIyNzBkZWdcIixcbiAgICAgICAgMzYwOiBcIjM2MGRlZ1wiLFxuICAgICAgfSxcbiAgICAgIGNvbG9yczoge1xuICAgICAgICBcImJsYWNrLTkwMFwiOiBcIiMxNDE0MTRcIixcbiAgICAgICAgYWNjZW50OiBcIiMzRDQxNDdcIixcbiAgICAgICAgXCJzaWRlYmFyLWJ1dHRvblwiOiBcIiMzMTM1M0FcIixcbiAgICAgICAgc2lkZWJhcjogXCIjZWJlZWY3XCIsXG4gICAgICAgIG1haW46IFwiI2VlZjRmYVwiLFxuICAgICAgICBcImhpc3RvcmljYWwtbXNnLXN5c3RlbVwiOiBcInJnYmEoMjU1LCAyNTUsIDI1NSwgMC4wNSk7XCIsXG4gICAgICAgIFwiaGlzdG9yaWNhbC1tc2ctdXNlclwiOiBcIiMyQzJGMzVcIixcbiAgICAgICAgb3V0bGluZTogXCIjNEU1MTUzXCIsXG4gICAgICAgIGRhc2hib2FyZDogXCIjZjdmYWZhXCIsXG4gICAgICAgIFwic2lkZWJhci1sb2dvLWluYWN0aXZlXCI6IFwiIzc0ODQ5N1wiLFxuICAgICAgICBcInNpZGViYXItbG9nby1hY3RpdmVcIjogXCIjNWYyN2NkXCIsXG4gICAgICAgIFwiaGVhZGVyLWluYWN0aXZlXCI6IFwiIzkwOWRhZVwiLFxuICAgICAgICBcImhlYWRlci1sb2dvLXN0YXRpY1wiOiBcIiM3MzdiODVcIixcbiAgICAgICAgZGl2bGluZTogXCIjZWVmNGZhXCIsXG4gICAgICAgIFwibWFpbi10aXRsZVwiOiBcIiM0MDRiNThcIixcbiAgICAgIH0sXG4gICAgICBiYWNrZ3JvdW5kSW1hZ2U6IHtcbiAgICAgICAgXCJwcmVmZXJlbmNlLWdyYWRpZW50XCI6XG4gICAgICAgICAgXCJsaW5lYXItZ3JhZGllbnQoMTgwZGVnLCAjNUE1QzYzIDAlLCByZ2JhKDkwLCA5MiwgOTksIDAuMjgpIDEwMCUpO1wiLFxuICAgICAgICBcImNoYXQtbXNnLXVzZXItZ3JhZGllbnRcIjpcbiAgICAgICAgICBcImxpbmVhci1ncmFkaWVudCgxODBkZWcsICMzRDQxNDcgMCUsICMyQzJGMzUgMTAwJSk7XCIsXG4gICAgICAgIFwic2VsZWN0ZWQtcHJlZmVyZW5jZS1ncmFkaWVudFwiOlxuICAgICAgICAgIFwibGluZWFyLWdyYWRpZW50KDE4MGRlZywgIzMxMzIzNiAwJSwgcmdiYSg2My40MCwgNjQuOTAsIDcwLjEzLCAwKSAxMDAlKTtcIixcbiAgICAgICAgXCJtYWluLWdyYWRpZW50XCI6IFwibGluZWFyLWdyYWRpZW50KDE4MGRlZywgIzNENDE0NyAwJSwgIzJDMkYzNSAxMDAlKVwiLFxuICAgICAgICBcIm1vZGFsLWdyYWRpZW50XCI6IFwibGluZWFyLWdyYWRpZW50KDE4MGRlZywgIzNENDE0NyAwJSwgIzJDMkYzNSAxMDAlKVwiLFxuICAgICAgICBcInNpZGViYXItZ3JhZGllbnRcIjogXCJsaW5lYXItZ3JhZGllbnQoOTBkZWcsICM1QjYxNkEgMCUsICMzRjQzNEIgMTAwJSlcIixcbiAgICAgICAgXCJkYXNoYm9hcmQtZ3JhZGllbnRcIjpcbiAgICAgICAgICBcImxpbmVhci1ncmFkaWVudCh0byBib3R0b20gcmlnaHQsICMwYjFhNTUsICMwZTJhNWUpXCIsXG4gICAgICAgIFwibG9naW4tZ3JhZGllbnRcIjogXCJsaW5lYXItZ3JhZGllbnQoMTgwZGVnLCAjM0Q0MTQ3IDAlLCAjMkMyRjM1IDEwMCUpXCIsXG4gICAgICAgIFwibWVudS1pdGVtLWdyYWRpZW50XCI6XG4gICAgICAgICAgXCJsaW5lYXItZ3JhZGllbnQoOTBkZWcsICMzRDQxNDcgMCUsICMyQzJGMzUgMTAwJSlcIixcbiAgICAgICAgXCJtZW51LWl0ZW0tc2VsZWN0ZWQtZ3JhZGllbnRcIjpcbiAgICAgICAgICBcImxpbmVhci1ncmFkaWVudCg5MGRlZywgIzVCNjE2QSAwJSwgIzNGNDM0QiAxMDAlKVwiLFxuICAgICAgICBcIndvcmtzcGFjZS1pdGVtLWdyYWRpZW50XCI6XG4gICAgICAgICAgXCJsaW5lYXItZ3JhZGllbnQoOTBkZWcsICMzRDQxNDcgMCUsICMyQzJGMzUgMTAwJSlcIixcbiAgICAgICAgXCJ3b3Jrc3BhY2UtaXRlbS1zZWxlY3RlZC1ncmFkaWVudFwiOlxuICAgICAgICAgIFwibGluZWFyLWdyYWRpZW50KDkwZGVnLCAjNUI2MTZBIDAlLCAjM0Y0MzRCIDEwMCUpXCIsXG4gICAgICAgIFwic3dpdGNoLXNlbGVjdGVkXCI6IFwibGluZWFyLWdyYWRpZW50KDE0NmRlZywgIzVCNjE2QSAwJSwgIzNGNDM0QiAxMDAlKVwiLFxuICAgICAgfSxcbiAgICAgIGZvbnRGYW1pbHk6IHtcbiAgICAgICAgc2FuczogW1xuICAgICAgICAgIFwicGx1cy1qYWthcnRhLXNhbnNcIixcbiAgICAgICAgICBcInVpLXNhbnMtc2VyaWZcIixcbiAgICAgICAgICBcInN5c3RlbS11aVwiLFxuICAgICAgICAgIFwiLWFwcGxlLXN5c3RlbVwiLFxuICAgICAgICAgIFwiQmxpbmtNYWNTeXN0ZW1Gb250XCIsXG4gICAgICAgICAgJ1wiU2Vnb2UgVUlcIicsXG4gICAgICAgICAgXCJSb2JvdG9cIixcbiAgICAgICAgICAnXCJIZWx2ZXRpY2EgTmV1ZVwiJyxcbiAgICAgICAgICBcIkFyaWFsXCIsXG4gICAgICAgICAgJ1wiTm90byBTYW5zXCInLFxuICAgICAgICAgIFwic2Fucy1zZXJpZlwiLFxuICAgICAgICAgICdcIkFwcGxlIENvbG9yIEVtb2ppXCInLFxuICAgICAgICAgICdcIlNlZ29lIFVJIEVtb2ppXCInLFxuICAgICAgICAgICdcIlNlZ29lIFVJIFN5bWJvbFwiJyxcbiAgICAgICAgICAnXCJOb3RvIENvbG9yIEVtb2ppXCInLFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICAgIGFuaW1hdGlvbjoge1xuICAgICAgICBzd2VlcDogXCJzd2VlcCAwLjVzIGVhc2UtaW4tb3V0XCIsXG4gICAgICB9LFxuICAgICAga2V5ZnJhbWVzOiB7XG4gICAgICAgIHN3ZWVwOiB7XG4gICAgICAgICAgXCIwJVwiOiB7IHRyYW5zZm9ybTogXCJzY2FsZVgoMClcIiwgdHJhbnNmb3JtT3JpZ2luOiBcImJvdHRvbSBsZWZ0XCIgfSxcbiAgICAgICAgICBcIjEwMCVcIjogeyB0cmFuc2Zvcm06IFwic2NhbGVYKDEpXCIsIHRyYW5zZm9ybU9yaWdpbjogXCJib3R0b20gbGVmdFwiIH0sXG4gICAgICAgIH0sXG4gICAgICAgIGZhZGVJbjoge1xuICAgICAgICAgIFwiMCVcIjogeyBvcGFjaXR5OiAwIH0sXG4gICAgICAgICAgXCIxMDAlXCI6IHsgb3BhY2l0eTogMSB9LFxuICAgICAgICB9LFxuICAgICAgICBmYWRlT3V0OiB7XG4gICAgICAgICAgXCIwJVwiOiB7IG9wYWNpdHk6IDEgfSxcbiAgICAgICAgICBcIjEwMCVcIjogeyBvcGFjaXR5OiAwIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0sXG4gIH0sXG4gIC8vIFJlcXVpcmVkIGZvciByZWNoYXJ0IHN0eWxlcyB0byBzaG93IHNpbmNlIHRoZXkgY2FuIGJlIHJlbmRlcmVkIGR5bmFtaWNhbGx5IGFuZCB3aWxsIGJlIHRyZWUtc2hha2VuIGlmIG5vdCBzYWZlLWxpc3RlZC5cbiAgc2FmZWxpc3Q6IFtcbiAgICB7XG4gICAgICBwYXR0ZXJuOlxuICAgICAgICAvXihiZy0oPzpzbGF0ZXxncmF5fHppbmN8bmV1dHJhbHxzdG9uZXxyZWR8b3JhbmdlfGFtYmVyfHllbGxvd3xsaW1lfGdyZWVufGVtZXJhbGR8dGVhbHxjeWFufHNreXxibHVlfGluZGlnb3x2aW9sZXR8cHVycGxlfGZ1Y2hzaWF8cGlua3xyb3NlKS0oPzo1MHwxMDB8MjAwfDMwMHw0MDB8NTAwfDYwMHw3MDB8ODAwfDkwMHw5NTApKSQvLFxuICAgICAgdmFyaWFudHM6IFtcImhvdmVyXCIsIFwidWktc2VsZWN0ZWRcIl0sXG4gICAgfSxcbiAgICB7XG4gICAgICBwYXR0ZXJuOlxuICAgICAgICAvXih0ZXh0LSg/OnNsYXRlfGdyYXl8emluY3xuZXV0cmFsfHN0b25lfHJlZHxvcmFuZ2V8YW1iZXJ8eWVsbG93fGxpbWV8Z3JlZW58ZW1lcmFsZHx0ZWFsfGN5YW58c2t5fGJsdWV8aW5kaWdvfHZpb2xldHxwdXJwbGV8ZnVjaHNpYXxwaW5rfHJvc2UpLSg/OjUwfDEwMHwyMDB8MzAwfDQwMHw1MDB8NjAwfDcwMHw4MDB8OTAwfDk1MCkpJC8sXG4gICAgICB2YXJpYW50czogW1wiaG92ZXJcIiwgXCJ1aS1zZWxlY3RlZFwiXSxcbiAgICB9LFxuICAgIHtcbiAgICAgIHBhdHRlcm46XG4gICAgICAgIC9eKGJvcmRlci0oPzpzbGF0ZXxncmF5fHppbmN8bmV1dHJhbHxzdG9uZXxyZWR8b3JhbmdlfGFtYmVyfHllbGxvd3xsaW1lfGdyZWVufGVtZXJhbGR8dGVhbHxjeWFufHNreXxibHVlfGluZGlnb3x2aW9sZXR8cHVycGxlfGZ1Y2hzaWF8cGlua3xyb3NlKS0oPzo1MHwxMDB8MjAwfDMwMHw0MDB8NTAwfDYwMHw3MDB8ODAwfDkwMHw5NTApKSQvLFxuICAgICAgdmFyaWFudHM6IFtcImhvdmVyXCIsIFwidWktc2VsZWN0ZWRcIl0sXG4gICAgfSxcbiAgICB7XG4gICAgICBwYXR0ZXJuOlxuICAgICAgICAvXihyaW5nLSg/OnNsYXRlfGdyYXl8emluY3xuZXV0cmFsfHN0b25lfHJlZHxvcmFuZ2V8YW1iZXJ8eWVsbG93fGxpbWV8Z3JlZW58ZW1lcmFsZHx0ZWFsfGN5YW58c2t5fGJsdWV8aW5kaWdvfHZpb2xldHxwdXJwbGV8ZnVjaHNpYXxwaW5rfHJvc2UpLSg/OjUwfDEwMHwyMDB8MzAwfDQwMHw1MDB8NjAwfDcwMHw4MDB8OTAwfDk1MCkpJC8sXG4gICAgfSxcbiAgICB7XG4gICAgICBwYXR0ZXJuOlxuICAgICAgICAvXihzdHJva2UtKD86c2xhdGV8Z3JheXx6aW5jfG5ldXRyYWx8c3RvbmV8cmVkfG9yYW5nZXxhbWJlcnx5ZWxsb3d8bGltZXxncmVlbnxlbWVyYWxkfHRlYWx8Y3lhbnxza3l8Ymx1ZXxpbmRpZ298dmlvbGV0fHB1cnBsZXxmdWNoc2lhfHBpbmt8cm9zZSktKD86NTB8MTAwfDIwMHwzMDB8NDAwfDUwMHw2MDB8NzAwfDgwMHw5MDB8OTUwKSkkLyxcbiAgICB9LFxuICAgIHtcbiAgICAgIHBhdHRlcm46XG4gICAgICAgIC9eKGZpbGwtKD86c2xhdGV8Z3JheXx6aW5jfG5ldXRyYWx8c3RvbmV8cmVkfG9yYW5nZXxhbWJlcnx5ZWxsb3d8bGltZXxncmVlbnxlbWVyYWxkfHRlYWx8Y3lhbnxza3l8Ymx1ZXxpbmRpZ298dmlvbGV0fHB1cnBsZXxmdWNoc2lhfHBpbmt8cm9zZSktKD86NTB8MTAwfDIwMHwzMDB8NDAwfDUwMHw2MDB8NzAwfDgwMHw5MDB8OTUwKSkkLyxcbiAg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O0FBQUEsRUFDRjtBQUFBLEVBQ0EsU0FBUyxDQUFDO0FBQ1o7OztBRC9IQSxJQUFPLHlCQUFRO0FBQUEsRUFDYixTQUFTLENBQUMsU0FBUyx1QkFBYyxHQUFHLFlBQVk7QUFDbEQ7OztBREhBLE9BQU8sV0FBVztBQUNsQixPQUFPLFNBQVM7QUFDaEIsU0FBUyxrQkFBa0I7QUFMeUosSUFBTSwyQ0FBMkM7QUFPck8sSUFBSSxzQkFBc0IsVUFBVTtBQUdwQyxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixRQUFRO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixPQUFPO0FBQUEsTUFDTCxZQUFZO0FBQUEsSUFDZDtBQUFBLEVBQ0Y7QUFBQSxFQUNBLFFBQVE7QUFBQSxJQUNOLGVBQWUsUUFBUTtBQUFBLEVBQ3pCO0FBQUEsRUFDQSxLQUFLO0FBQUEsSUFDSDtBQUFBLEVBQ0Y7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLE1BQU07QUFBQSxJQUNOLFdBQVc7QUFBQSxNQUNULFVBQVU7QUFBQTtBQUFBLE1BQ1YsTUFBTTtBQUFBLE1BQ04sVUFBVTtBQUFBLE1BQ1YsWUFBWTtBQUFBLE1BQ1osVUFBVTtBQUFBO0FBQUEsSUFDWixDQUFDO0FBQUEsRUFDSDtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0w7QUFBQSxRQUNFLE1BQU07QUFBQSxRQUNOLGFBQWEsY0FBYyxJQUFJLElBQUksU0FBUyx3Q0FBZSxDQUFDO0FBQUEsTUFDOUQ7QUFBQSxNQUNBO0FBQUEsUUFDRSxTQUFTO0FBQUEsUUFDVCxRQUFRO0FBQUEsUUFDUixNQUFNO0FBQUEsUUFDTixNQUFNO0FBQUEsUUFDTixNQUFNO0FBQUEsUUFDTixhQUFhLENBQUMsUUFBUTtBQUNwQixpQkFBTyxJQUFJLFFBQVEsTUFBTSxFQUFFO0FBQUEsUUFDN0I7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLE9BQU87QUFBQSxJQUNMLGVBQWU7QUFBQSxNQUNiLFVBQVU7QUFBQTtBQUFBLFFBRVI7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLElBQ0EsaUJBQWlCO0FBQUEsTUFDZix5QkFBeUI7QUFBQSxJQUMzQjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLGNBQWM7QUFBQSxJQUNaLGdCQUFnQjtBQUFBLE1BQ2QsUUFBUTtBQUFBLFFBQ04sUUFBUTtBQUFBLE1BQ1Y7QUFBQSxNQUNBLFNBQVMsQ0FBQztBQUFBLElBQ1o7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
