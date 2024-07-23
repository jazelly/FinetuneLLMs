// vite.config.js
import { defineConfig } from "file:///E:/github/my/FinetuneLLMs/frontend/node_modules/vite/dist/node/index.js";
import { fileURLToPath, URL } from "url";

// postcss.config.js
import tailwind from "file:///E:/github/my/FinetuneLLMs/frontend/node_modules/tailwindcss/lib/index.js";
import autoprefixer from "file:///E:/github/my/FinetuneLLMs/frontend/node_modules/autoprefixer/lib/autoprefixer.js";

// tailwind.config.js
var tailwind_config_default = {
  darkMode: "false",
  content: {
    relative: true,
    files: [
      "./src/**/*.{js,jsx,ts,tsx}",
      "./src/*.{jsx,tsx}",
      "./src/App.tsx",
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
        "main-base": "#24303C",
        "main-workspace": "#2E3A46",
        "main-dark": "#1F2933",
        "main-menu": "#3D4B56",
        "main-text": "#BFCAD4",
        "main-blue": "#4F7ED4",
        blue350: "#4A7AD6",
        "main-nile-blue": "#518C99",
        "main-gray": "#A1ACBD",
        gray320: "#A6B2BD",
        "main-lightgray": "#727E8A",
        "main-white": "#F9FCFC",
        "main-orange": "#D7C692",
        "icon-inactive": "#7C8690",
        "panel-blue": "#B3D7F4",
        "historical-msg-system": "rgba(255, 255, 255, 0.05);",
        "historical-msg-user": "#2C2F35",
        outline: "#4E5153",
        dashboard: "#f7fafa",
        "sidebar-logo-active": "#5f27cd",
        "header-logo-static": "#737b85",
        "main-log-white": "#B8C7E0",
        "main-log-lightblue": "#97D8F4",
        divline: "#eef4fa",
        "main-title": "#404b58",
        "pipeline-highlight": "#455166"
      },
      backgroundImage: {
        "preference-gradient": "linear-gradient(180deg, #5A5C63 0%, rgba(90, 92, 99, 0.28) 100%);",
        "chat-msg-user-gradient": "linear-gradient(180deg, #3D4147 0%, #1b2638 100%);",
        "selected-preference-gradient": "linear-gradient(180deg, #313236 0%, rgba(63.40, 64.90, 70.13, 0) 100%);",
        "main-gradient": "linear-gradient(180deg, #3D4059 0%, #1b2638 100%)",
        "main-white-gradient": "linear-gradient(to bottom right, #F4F9FF, #D3D7E4)",
        "modal-gradient": "linear-gradient(180deg, #3D4147 0%, #1b2638 100%)",
        "sidebar-gradient": "linear-gradient(90deg, #5B616A 0%, #3F434B 100%)",
        "login-gradient": "linear-gradient(180deg, #3D4147 0%, #1b2638 100%)",
        "menu-item-gradient": "linear-gradient(90deg, #3D4147 0%, #1b2638 100%)",
        "menu-item-selected-gradient": "linear-gradient(90deg, #5B616A 0%, #1b2638 100%)",
        "workspace-item-gradient": "linear-gradient(90deg, #3D4147 0%, #1b2638 100%)",
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
import react from "file:///E:/github/my/FinetuneLLMs/frontend/node_modules/@vitejs/plugin-react/dist/index.mjs";
import dns from "dns";
import { visualizer } from "file:///E:/github/my/FinetuneLLMs/frontend/node_modules/rollup-plugin-visualizer/dist/plugin/index.js";
var __vite_injected_original_import_meta_url = "file:///E:/github/my/FinetuneLLMs/frontend/vite.config.js";
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiLCAicG9zdGNzcy5jb25maWcuanMiLCAidGFpbHdpbmQuY29uZmlnLmpzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiRTpcXFxcZ2l0aHViXFxcXG15XFxcXEZpbmV0dW5lTExNc1xcXFxmcm9udGVuZFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRTpcXFxcZ2l0aHViXFxcXG15XFxcXEZpbmV0dW5lTExNc1xcXFxmcm9udGVuZFxcXFx2aXRlLmNvbmZpZy5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRTovZ2l0aHViL215L0ZpbmV0dW5lTExNcy9mcm9udGVuZC92aXRlLmNvbmZpZy5qc1wiO2ltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gXCJ2aXRlXCJcbmltcG9ydCB7IGZpbGVVUkxUb1BhdGgsIFVSTCB9IGZyb20gXCJ1cmxcIlxuaW1wb3J0IHBvc3Rjc3MgZnJvbSBcIi4vcG9zdGNzcy5jb25maWcuanNcIlxuaW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdFwiXG5pbXBvcnQgZG5zIGZyb20gXCJkbnNcIlxuaW1wb3J0IHsgdmlzdWFsaXplciB9IGZyb20gXCJyb2xsdXAtcGx1Z2luLXZpc3VhbGl6ZXJcIlxuXG5kbnMuc2V0RGVmYXVsdFJlc3VsdE9yZGVyKFwidmVyYmF0aW1cIilcblxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHNlcnZlcjoge1xuICAgIHBvcnQ6IDMwMDAsXG4gICAgaG9zdDogXCJsb2NhbGhvc3RcIixcbiAgICB3YXRjaDoge1xuICAgICAgdXNlUG9sbGluZzogdHJ1ZSxcbiAgICB9XG4gIH0sXG4gIGRlZmluZToge1xuICAgIFwicHJvY2Vzcy5lbnZcIjogcHJvY2Vzcy5lbnZcbiAgfSxcbiAgY3NzOiB7XG4gICAgcG9zdGNzc1xuICB9LFxuICBwbHVnaW5zOiBbXG4gICAgcmVhY3QoKSxcbiAgICB2aXN1YWxpemVyKHtcbiAgICAgIHRlbXBsYXRlOiBcInRyZWVtYXBcIiwgLy8gb3Igc3VuYnVyc3RcbiAgICAgIG9wZW46IGZhbHNlLFxuICAgICAgZ3ppcFNpemU6IHRydWUsXG4gICAgICBicm90bGlTaXplOiB0cnVlLFxuICAgICAgZmlsZW5hbWU6IFwiYnVuZGxlaW5zcGVjdG9yLmh0bWxcIiAvLyB3aWxsIGJlIHNhdmVkIGluIHByb2plY3QncyByb290XG4gICAgfSlcbiAgXSxcbiAgcmVzb2x2ZToge1xuICAgIGFsaWFzOiBbXG4gICAgICB7XG4gICAgICAgIGZpbmQ6IFwiQFwiLFxuICAgICAgICByZXBsYWNlbWVudDogZmlsZVVSTFRvUGF0aChuZXcgVVJMKFwiLi9zcmNcIiwgaW1wb3J0Lm1ldGEudXJsKSlcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHByb2Nlc3M6IFwicHJvY2Vzcy9icm93c2VyXCIsXG4gICAgICAgIHN0cmVhbTogXCJzdHJlYW0tYnJvd3NlcmlmeVwiLFxuICAgICAgICB6bGliOiBcImJyb3dzZXJpZnktemxpYlwiLFxuICAgICAgICB1dGlsOiBcInV0aWxcIixcbiAgICAgICAgZmluZDogL15+LisvLFxuICAgICAgICByZXBsYWNlbWVudDogKHZhbCkgPT4ge1xuICAgICAgICAgIHJldHVybiB2YWwucmVwbGFjZSgvXn4vLCBcIlwiKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgXVxuICB9LFxuICBidWlsZDoge1xuICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgIGV4dGVybmFsOiBbXG4gICAgICAgIC8vIFJlZHVjZXMgdHJhbnNmb3JtYXRpb24gdGltZSBieSA1MCUgYW5kIHdlIGRvbid0IGV2ZW4gdXNlIHRoaXMgdmFyaWFudCwgc28gd2UgY2FuIGlnbm9yZS5cbiAgICAgICAgL0BwaG9zcGhvci1pY29uc1xcL3JlYWN0XFwvZGlzdFxcL3Nzci8sXG4gICAgICBdXG4gICAgfSxcbiAgICBjb21tb25qc09wdGlvbnM6IHtcbiAgICAgIHRyYW5zZm9ybU1peGVkRXNNb2R1bGVzOiB0cnVlXG4gICAgfVxuICB9LFxuICBvcHRpbWl6ZURlcHM6IHtcbiAgICBlc2J1aWxkT3B0aW9uczoge1xuICAgICAgZGVmaW5lOiB7XG4gICAgICAgIGdsb2JhbDogXCJnbG9iYWxUaGlzXCJcbiAgICAgIH0sXG4gICAgICBwbHVnaW5zOiBbXVxuICAgIH1cbiAgfVxufSlcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiRTpcXFxcZ2l0aHViXFxcXG15XFxcXEZpbmV0dW5lTExNc1xcXFxmcm9udGVuZFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRTpcXFxcZ2l0aHViXFxcXG15XFxcXEZpbmV0dW5lTExNc1xcXFxmcm9udGVuZFxcXFxwb3N0Y3NzLmNvbmZpZy5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRTovZ2l0aHViL215L0ZpbmV0dW5lTExNcy9mcm9udGVuZC9wb3N0Y3NzLmNvbmZpZy5qc1wiO2ltcG9ydCB0YWlsd2luZCBmcm9tICd0YWlsd2luZGNzcydcbmltcG9ydCBhdXRvcHJlZml4ZXIgZnJvbSAnYXV0b3ByZWZpeGVyJ1xuaW1wb3J0IHRhaWx3aW5kQ29uZmlnIGZyb20gJy4vdGFpbHdpbmQuY29uZmlnLmpzJ1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIHBsdWdpbnM6IFt0YWlsd2luZCh0YWlsd2luZENvbmZpZyksIGF1dG9wcmVmaXhlcl0sXG59IiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJFOlxcXFxnaXRodWJcXFxcbXlcXFxcRmluZXR1bmVMTE1zXFxcXGZyb250ZW5kXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJFOlxcXFxnaXRodWJcXFxcbXlcXFxcRmluZXR1bmVMTE1zXFxcXGZyb250ZW5kXFxcXHRhaWx3aW5kLmNvbmZpZy5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRTovZ2l0aHViL215L0ZpbmV0dW5lTExNcy9mcm9udGVuZC90YWlsd2luZC5jb25maWcuanNcIjsvKiogQHR5cGUge2ltcG9ydCgndGFpbHdpbmRjc3MnKS5Db25maWd9ICovXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICBkYXJrTW9kZTogJ2ZhbHNlJyxcclxuICBjb250ZW50OiB7XHJcbiAgICByZWxhdGl2ZTogdHJ1ZSxcclxuICAgIGZpbGVzOiBbXHJcbiAgICAgICcuL3NyYy8qKi8qLntqcyxqc3gsdHMsdHN4fScsXHJcbiAgICAgICcuL3NyYy8qLntqc3gsdHN4fScsXHJcbiAgICAgICcuL3NyYy9BcHAudHN4JyxcclxuICAgICAgJy4vaW5kZXguaHRtbCcsXHJcbiAgICAgICcuL25vZGVfbW9kdWxlcy9AdHJlbW9yLyoqLyoue2pzLHRzLGpzeCx0c3h9JyxcclxuICAgIF0sXHJcbiAgfSxcclxuICB0aGVtZToge1xyXG4gICAgZXh0ZW5kOiB7XHJcbiAgICAgIHJvdGF0ZToge1xyXG4gICAgICAgIDI3MDogJzI3MGRlZycsXHJcbiAgICAgICAgMzYwOiAnMzYwZGVnJyxcclxuICAgICAgfSxcclxuICAgICAgY29sb3JzOiB7XHJcbiAgICAgICAgJ2JsYWNrLTkwMCc6ICcjMTQxNDE0JyxcclxuICAgICAgICBhY2NlbnQ6ICcjM0Q0MTQ3JyxcclxuICAgICAgICAnc2lkZWJhci1idXR0b24nOiAnIzMxMzUzQScsXHJcblxyXG4gICAgICAgICdtYWluLWJhc2UnOiAnIzI0MzAzQycsXHJcbiAgICAgICAgJ21haW4td29ya3NwYWNlJzogJyMyRTNBNDYnLFxyXG4gICAgICAgICdtYWluLWRhcmsnOiAnIzFGMjkzMycsXHJcbiAgICAgICAgJ21haW4tbWVudSc6ICcjM0Q0QjU2JyxcclxuICAgICAgICAnbWFpbi10ZXh0JzogJyNCRkNBRDQnLFxyXG4gICAgICAgICdtYWluLWJsdWUnOiAnIzRGN0VENCcsXHJcbiAgICAgICAgYmx1ZTM1MDogJyM0QTdBRDYnLFxyXG4gICAgICAgICdtYWluLW5pbGUtYmx1ZSc6ICcjNTE4Qzk5JyxcclxuICAgICAgICAnbWFpbi1ncmF5JzogJyNBMUFDQkQnLFxyXG4gICAgICAgIGdyYXkzMjA6ICcjQTZCMkJEJyxcclxuICAgICAgICAnbWFpbi1saWdodGdyYXknOiAnIzcyN0U4QScsXHJcbiAgICAgICAgJ21haW4td2hpdGUnOiAnI0Y5RkNGQycsXHJcbiAgICAgICAgJ21haW4tb3JhbmdlJzogJyNEN0M2OTInLFxyXG4gICAgICAgICdpY29uLWluYWN0aXZlJzogJyM3Qzg2OTAnLFxyXG5cclxuICAgICAgICAncGFuZWwtYmx1ZSc6ICcjQjNEN0Y0JyxcclxuICAgICAgICAnaGlzdG9yaWNhbC1tc2ctc3lzdGVtJzogJ3JnYmEoMjU1LCAyNTUsIDI1NSwgMC4wNSk7JyxcclxuICAgICAgICAnaGlzdG9yaWNhbC1tc2ctdXNlcic6ICcjMkMyRjM1JyxcclxuICAgICAgICBvdXRsaW5lOiAnIzRFNTE1MycsXHJcbiAgICAgICAgZGFzaGJvYXJkOiAnI2Y3ZmFmYScsXHJcbiAgICAgICAgJ3NpZGViYXItbG9nby1hY3RpdmUnOiAnIzVmMjdjZCcsXHJcbiAgICAgICAgJ2hlYWRlci1sb2dvLXN0YXRpYyc6ICcjNzM3Yjg1JyxcclxuICAgICAgICAnbWFpbi1sb2ctd2hpdGUnOiAnI0I4QzdFMCcsXHJcbiAgICAgICAgJ21haW4tbG9nLWxpZ2h0Ymx1ZSc6ICcjOTdEOEY0JyxcclxuICAgICAgICBkaXZsaW5lOiAnI2VlZjRmYScsXHJcbiAgICAgICAgJ21haW4tdGl0bGUnOiAnIzQwNGI1OCcsXHJcbiAgICAgICAgJ3BpcGVsaW5lLWhpZ2hsaWdodCc6ICcjNDU1MTY2JyxcclxuICAgICAgfSxcclxuICAgICAgYmFja2dyb3VuZEltYWdlOiB7XHJcbiAgICAgICAgJ3ByZWZlcmVuY2UtZ3JhZGllbnQnOlxyXG4gICAgICAgICAgJ2xpbmVhci1ncmFkaWVudCgxODBkZWcsICM1QTVDNjMgMCUsIHJnYmEoOTAsIDkyLCA5OSwgMC4yOCkgMTAwJSk7JyxcclxuICAgICAgICAnY2hhdC1tc2ctdXNlci1ncmFkaWVudCc6XHJcbiAgICAgICAgICAnbGluZWFyLWdyYWRpZW50KDE4MGRlZywgIzNENDE0NyAwJSwgIzFiMjYzOCAxMDAlKTsnLFxyXG4gICAgICAgICdzZWxlY3RlZC1wcmVmZXJlbmNlLWdyYWRpZW50JzpcclxuICAgICAgICAgICdsaW5lYXItZ3JhZGllbnQoMTgwZGVnLCAjMzEzMjM2IDAlLCByZ2JhKDYzLjQwLCA2NC45MCwgNzAuMTMsIDApIDEwMCUpOycsXHJcbiAgICAgICAgJ21haW4tZ3JhZGllbnQnOiAnbGluZWFyLWdyYWRpZW50KDE4MGRlZywgIzNENDA1OSAwJSwgIzFiMjYzOCAxMDAlKScsXHJcbiAgICAgICAgJ21haW4td2hpdGUtZ3JhZGllbnQnOlxyXG4gICAgICAgICAgJ2xpbmVhci1ncmFkaWVudCh0byBib3R0b20gcmlnaHQsICNGNEY5RkYsICNEM0Q3RTQpJyxcclxuICAgICAgICAnbW9kYWwtZ3JhZGllbnQnOiAnbGluZWFyLWdyYWRpZW50KDE4MGRlZywgIzNENDE0NyAwJSwgIzFiMjYzOCAxMDAlKScsXHJcbiAgICAgICAgJ3NpZGViYXItZ3JhZGllbnQnOiAnbGluZWFyLWdyYWRpZW50KDkwZGVnLCAjNUI2MTZBIDAlLCAjM0Y0MzRCIDEwMCUpJyxcclxuICAgICAgICAnbG9naW4tZ3JhZGllbnQnOiAnbGluZWFyLWdyYWRpZW50KDE4MGRlZywgIzNENDE0NyAwJSwgIzFiMjYzOCAxMDAlKScsXHJcbiAgICAgICAgJ21lbnUtaXRlbS1ncmFkaWVudCc6XHJcbiAgICAgICAgICAnbGluZWFyLWdyYWRpZW50KDkwZGVnLCAjM0Q0MTQ3IDAlLCAjMWIyNjM4IDEwMCUpJyxcclxuICAgICAgICAnbWVudS1pdGVtLXNlbGVjdGVkLWdyYWRpZW50JzpcclxuICAgICAgICAgICdsaW5lYXItZ3JhZGllbnQoOTBkZWcsICM1QjYxNkEgMCUsICMxYjI2MzggMTAwJSknLFxyXG4gICAgICAgICd3b3Jrc3BhY2UtaXRlbS1ncmFkaWVudCc6XHJcbiAgICAgICAgICAnbGluZWFyLWdyYWRpZW50KDkwZGVnLCAjM0Q0MTQ3IDAlLCAjMWIyNjM4IDEwMCUpJyxcclxuICAgICAgICAnd29ya3NwYWNlLWl0ZW0tc2VsZWN0ZWQtZ3JhZGllbnQnOlxyXG4gICAgICAgICAgJ2xpbmVhci1ncmFkaWVudCg5MGRlZywgIzVCNjE2QSAwJSwgIzNGNDM0QiAxMDAlKScsXHJcbiAgICAgICAgJ3N3aXRjaC1zZWxlY3RlZCc6ICdsaW5lYXItZ3JhZGllbnQoMTQ2ZGVnLCAjNUI2MTZBIDAlLCAjM0Y0MzRCIDEwMCUpJyxcclxuICAgICAgfSxcclxuICAgICAgZm9udEZhbWlseToge1xyXG4gICAgICAgIHNhbnM6IFtcclxuICAgICAgICAgICdwbHVzLWpha2FydGEtc2FucycsXHJcbiAgICAgICAgICAndWktc2Fucy1zZXJpZicsXHJcbiAgICAgICAgICAnc3lzdGVtLXVpJyxcclxuICAgICAgICAgICctYXBwbGUtc3lzdGVtJyxcclxuICAgICAgICAgICdCbGlua01hY1N5c3RlbUZvbnQnLFxyXG4gICAgICAgICAgJ1wiU2Vnb2UgVUlcIicsXHJcbiAgICAgICAgICAnUm9ib3RvJyxcclxuICAgICAgICAgICdcIkhlbHZldGljYSBOZXVlXCInLFxyXG4gICAgICAgICAgJ0FyaWFsJyxcclxuICAgICAgICAgICdcIk5vdG8gU2Fuc1wiJyxcclxuICAgICAgICAgICdzYW5zLXNlcmlmJyxcclxuICAgICAgICAgICdcIkFwcGxlIENvbG9yIEVtb2ppXCInLFxyXG4gICAgICAgICAgJ1wiU2Vnb2UgVUkgRW1vamlcIicsXHJcbiAgICAgICAgICAnXCJTZWdvZSBVSSBTeW1ib2xcIicsXHJcbiAgICAgICAgICAnXCJOb3RvIENvbG9yIEVtb2ppXCInLFxyXG4gICAgICAgIF0sXHJcbiAgICAgIH0sXHJcbiAgICAgIGFuaW1hdGlvbjoge1xyXG4gICAgICAgIHN3ZWVwOiAnc3dlZXAgMC41cyBlYXNlLWluLW91dCcsXHJcbiAgICAgIH0sXHJcbiAgICAgIGtleWZyYW1lczoge1xyXG4gICAgICAgIHN3ZWVwOiB7XHJcbiAgICAgICAgICAnMCUnOiB7IHRyYW5zZm9ybTogJ3NjYWxlWCgwKScsIHRyYW5zZm9ybU9yaWdpbjogJ2JvdHRvbSBsZWZ0JyB9LFxyXG4gICAgICAgICAgJzEwMCUnOiB7IHRyYW5zZm9ybTogJ3NjYWxlWCgxKScsIHRyYW5zZm9ybU9yaWdpbjogJ2JvdHRvbSBsZWZ0JyB9LFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZmFkZUluOiB7XHJcbiAgICAgICAgICAnMCUnOiB7IG9wYWNpdHk6IDAgfSxcclxuICAgICAgICAgICcxMDAlJzogeyBvcGFjaXR5OiAxIH0sXHJcbiAgICAgICAgfSxcclxuICAgICAgICBmYWRlT3V0OiB7XHJcbiAgICAgICAgICAnMCUnOiB7IG9wYWNpdHk6IDEgfSxcclxuICAgICAgICAgICcxMDAlJzogeyBvcGFjaXR5OiAwIH0sXHJcbiAgICAgICAgfSxcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgfSxcclxuICAvLyBSZXF1aXJlZCBmb3IgcmVjaGFydCBzdHlsZXMgdG8gc2hvdyBzaW5jZSB0aGV5IGNhbiBiZSByZW5kZXJlZCBkeW5hbWljYWxseSBhbmQgd2lsbCBiZSB0cmVlLXNoYWtlbiBpZiBub3Qgc2FmZS1saXN0ZWQuXHJcbiAgc2FmZWxpc3Q6IFtcclxuICAgIHtcclxuICAgICAgcGF0dGVybjpcclxuICAgICAgICAvXihiZy0oPzpzbGF0ZXxncmF5fHppbmN8bmV1dHJhbHxzdG9uZXxyZWR8b3JhbmdlfGFtYmVyfHllbGxvd3xsaW1lfGdyZWVufGVtZXJhbGR8dGVhbHxjeWFufHNreXxibHVlfGluZGlnb3x2aW9sZXR8cHVycGxlfGZ1Y2hzaWF8cGlua3xyb3NlKS0oPzo1MHwxMDB8MjAwfDMwMHw0MDB8NTAwfDYwMHw3MDB8ODAwfDkwMHw5NTApKSQvLFxyXG4gICAgICB2YXJpYW50czogWydob3ZlcicsICd1aS1zZWxlY3RlZCddLFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgcGF0dGVybjpcclxuICAgICAgICAvXih0ZXh0LSg/OnNsYXRlfGdyYXl8emluY3xuZXV0cmFsfHN0b25lfHJlZHxvcmFuZ2V8YW1iZXJ8eWVsbG93fGxpbWV8Z3JlZW58ZW1lcmFsZHx0ZWFsfGN5YW58c2t5fGJsdWV8aW5kaWdvfHZpb2xldHxwdXJwbGV8ZnVjaHNpYXxwaW5rfHJvc2UpLSg/OjUwfDEwMHwyMDB8MzAwfDQwMHw1MDB8NjAwfDcwMHw4MDB8OTAwfDk1MCkpJC8sXHJcbiAgICAgIHZhcmlhbnRzOiBbJ2hvdmVyJywgJ3VpLXNlbGVjdGVkJ10sXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBwYXR0ZXJuOlxyXG4gICAgICAgIC9eKGJvcmRlci0oPzpzbGF0ZXxncmF5fHppbmN8bmV1dHJhbHxzdG9uZXxyZWR8b3JhbmdlfGFtYmVyfHllbGxvd3xsaW1lfGdyZWVufGVtZXJhbGR8dGVhbHxjeWFufHNreXxibHVlfGluZGlnb3x2aW9sZXR8cHVycGxlfGZ1Y2hzaWF8cGlua3xyb3NlKS0oPzo1MHwxMDB8MjAwfDMwMHw0MDB8NTAwfDYwMHw3MDB8ODAwfDkwMHw5NTApKSQvLFxyXG4gICAgICB2YXJpYW50czogWydob3ZlcicsICd1aS1zZWxlY3RlZCddLFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgcGF0dGVybjpcclxuICAgICAgICAvXihyaW5nLSg/OnNsYXRlfGdyYXl8emluY3xuZXV0cmFsfHN0b25lfHJlZHxvcmFuZ2V8YW1iZXJ8eWVsbG93fGxpbWV8Z3JlZW58ZW1lcmFsZHx0ZWFsfGN5YW58c2t5fGJsdWV8aW5kaWdvfHZpb2xldHxwdXJwbGV8ZnVjaHNpYXxwaW5rfHJvc2UpLSg/OjUwfDEwMHwyMDB8MzAwfDQwMHw1MDB8NjAwfDcwMHw4MDB8OTAwfDk1MCkpJC8sXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBwYXR0ZXJuOlxyXG4gICAgICAgIC9eKHN0cm9rZS0oPzpzbGF0ZXxncmF5fHppbmN8bmV1dHJhbHxzdG9uZXxyZWR8b3JhbmdlfGFtYmVyfHllbGxvd3xsaW1lfGdyZWVufGVtZXJhbGR8dGVhbHxjeWFufHNreXxibHVlfGluZGlnb3x2aW9sZXR8cHVycGxlfGZ1Y2hzaWF8cGlua3xyb3NlKS0oPzo1MHwxMDB8MjAwfDMwMHw0MDB8NTAwfDYwMHw3MDB8ODAwfDkwMHw5NTApKSQvLFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgcGF0dGVybjpcclxuICAgICAgICAvXihmaWxsLSg/OnNsYXRlfGdyYXl8emluY3xuZXV0cmFsfHN0b25lfHJlZHxvcmFuZ2V8YW1iZXJ8eWVsbG93fGxpbWV8Z3JlZW58ZW1lcmFsZHx0ZWFsfGN5YW58c2t5fGJsdWV8aW5kaWdvfHZpb2xldHxwdXJwbGV8ZnVjaHNpYXxwaW5rfHJvc2UpLSg/OjUwfDEwMHwyMDB8MzAwfDQwMHw1MDB8NjAwfDcwMHw4MDB8OTAwfDk1MCkpJC8sXHJcbiAgICB9LFxyXG4gIF0sXHJcbiAgcGx1Z2luczogW10sXHJcbn07XHJcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBa1MsU0FBUyxvQkFBb0I7QUFDL1QsU0FBUyxlQUFlLFdBQVc7OztBQ0RxUSxPQUFPLGNBQWM7QUFDN1QsT0FBTyxrQkFBa0I7OztBQ0F6QixJQUFPLDBCQUFRO0FBQUEsRUFDYixVQUFVO0FBQUEsRUFDVixTQUFTO0FBQUEsSUFDUCxVQUFVO0FBQUEsSUFDVixPQUFPO0FBQUEsTUFDTDtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUFBLEVBQ0EsT0FBTztBQUFBLElBQ0wsUUFBUTtBQUFBLE1BQ04sUUFBUTtBQUFBLFFBQ04sS0FBSztBQUFBLFFBQ0wsS0FBSztBQUFBLE1BQ1A7QUFBQSxNQUNBLFFBQVE7QUFBQSxRQUNOLGFBQWE7QUFBQSxRQUNiLFFBQVE7QUFBQSxRQUNSLGtCQUFrQjtBQUFBLFFBRWxCLGFBQWE7QUFBQSxRQUNiLGtCQUFrQjtBQUFBLFFBQ2xCLGFBQWE7QUFBQSxRQUNiLGFBQWE7QUFBQSxRQUNiLGFBQWE7QUFBQSxRQUNiLGFBQWE7QUFBQSxRQUNiLFNBQVM7QUFBQSxRQUNULGtCQUFrQjtBQUFBLFFBQ2xCLGFBQWE7QUFBQSxRQUNiLFNBQVM7QUFBQSxRQUNULGtCQUFrQjtBQUFBLFFBQ2xCLGNBQWM7QUFBQSxRQUNkLGVBQWU7QUFBQSxRQUNmLGlCQUFpQjtBQUFBLFFBRWpCLGNBQWM7QUFBQSxRQUNkLHlCQUF5QjtBQUFBLFFBQ3pCLHVCQUF1QjtBQUFBLFFBQ3ZCLFNBQVM7QUFBQSxRQUNULFdBQVc7QUFBQSxRQUNYLHVCQUF1QjtBQUFBLFFBQ3ZCLHNCQUFzQjtBQUFBLFFBQ3RCLGtCQUFrQjtBQUFBLFFBQ2xCLHNCQUFzQjtBQUFBLFFBQ3RCLFNBQVM7QUFBQSxRQUNULGNBQWM7QUFBQSxRQUNkLHNCQUFzQjtBQUFBLE1BQ3hCO0FBQUEsTUFDQSxpQkFBaUI7QUFBQSxRQUNmLHVCQUNFO0FBQUEsUUFDRiwwQkFDRTtBQUFBLFFBQ0YsZ0NBQ0U7QUFBQSxRQUNGLGlCQUFpQjtBQUFBLFFBQ2pCLHVCQUNFO0FBQUEsUUFDRixrQkFBa0I7QUFBQSxRQUNsQixvQkFBb0I7QUFBQSxRQUNwQixrQkFBa0I7QUFBQSxRQUNsQixzQkFDRTtBQUFBLFFBQ0YsK0JBQ0U7QUFBQSxRQUNGLDJCQUNFO0FBQUEsUUFDRixvQ0FDRTtBQUFBLFFBQ0YsbUJBQW1CO0FBQUEsTUFDckI7QUFBQSxNQUNBLFlBQVk7QUFBQSxRQUNWLE1BQU07QUFBQSxVQUNKO0FBQUEsVUFDQTtBQUFBLFVBQ0E7QUFBQSxVQUNBO0FBQUEsVUFDQTtBQUFBLFVBQ0E7QUFBQSxVQUNBO0FBQUEsVUFDQTtBQUFBLFVBQ0E7QUFBQSxVQUNBO0FBQUEsVUFDQTtBQUFBLFVBQ0E7QUFBQSxVQUNBO0FBQUEsVUFDQTtBQUFBLFVBQ0E7QUFBQSxRQUNGO0FBQUEsTUFDRjtBQUFBLE1BQ0EsV0FBVztBQUFBLFFBQ1QsT0FBTztBQUFBLE1BQ1Q7QUFBQSxNQUNBLFdBQVc7QUFBQSxRQUNULE9BQU87QUFBQSxVQUNMLE1BQU0sRUFBRSxXQUFXLGFBQWEsaUJBQWlCLGNBQWM7QUFBQSxVQUMvRCxRQUFRLEVBQUUsV0FBVyxhQUFhLGlCQUFpQixjQUFjO0FBQUEsUUFDbkU7QUFBQSxRQUNBLFFBQVE7QUFBQSxVQUNOLE1BQU0sRUFBRSxTQUFTLEVBQUU7QUFBQSxVQUNuQixRQUFRLEVBQUUsU0FBUyxFQUFFO0FBQUEsUUFDdkI7QUFBQSxRQUNBLFNBQVM7QUFBQSxVQUNQLE1BQU0sRUFBRSxTQUFTLEVBQUU7QUFBQSxVQUNuQixRQUFRLEVBQUUsU0FBUyxFQUFFO0FBQUEsUUFDdkI7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFBQTtBQUFBLEVBRUEsVUFBVTtBQUFBLElBQ1I7QUFBQSxNQUNFLFNBQ0U7QUFBQSxNQUNGLFVBQVUsQ0FBQyxTQUFTLGFBQWE7QUFBQSxJQUNuQztBQUFBLElBQ0E7QUFBQSxNQUNFLFNBQ0U7QUFBQSxNQUNGLFVBQVUsQ0FBQyxTQUFTLGFBQWE7QUFBQSxJQUNuQztBQUFBLElBQ0E7QUFBQSxNQUNFLFNBQ0U7QUFBQSxNQUNGLFVBQVUsQ0FBQyxTQUFTLGFBQWE7QUFBQSxJQUNuQztBQUFBLElBQ0E7QUFBQSxNQUNFLFNBQ0U7QUFBQSxJQUNKO0FBQUEsSUFDQTtBQUFBLE1BQ0UsU0FDRTtBQUFBLElBQ0o7QUFBQSxJQUNBO0FBQUEsTUFDRSxTQUNFO0FBQUEsSUFDSjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLFNBQVMsQ0FBQztBQUNaOzs7QUQ1SUEsSUFBTyx5QkFBUTtBQUFBLEVBQ2IsU0FBUyxDQUFDLFNBQVMsdUJBQWMsR0FBRyxZQUFZO0FBQ2xEOzs7QURIQSxPQUFPLFdBQVc7QUFDbEIsT0FBTyxTQUFTO0FBQ2hCLFNBQVMsa0JBQWtCO0FBTDBKLElBQU0sMkNBQTJDO0FBT3RPLElBQUksc0JBQXNCLFVBQVU7QUFHcEMsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsUUFBUTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sT0FBTztBQUFBLE1BQ0wsWUFBWTtBQUFBLElBQ2Q7QUFBQSxFQUNGO0FBQUEsRUFDQSxRQUFRO0FBQUEsSUFDTixlQUFlLFFBQVE7QUFBQSxFQUN6QjtBQUFBLEVBQ0EsS0FBSztBQUFBLElBQ0g7QUFBQSxFQUNGO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxNQUFNO0FBQUEsSUFDTixXQUFXO0FBQUEsTUFDVCxVQUFVO0FBQUE7QUFBQSxNQUNWLE1BQU07QUFBQSxNQUNOLFVBQVU7QUFBQSxNQUNWLFlBQVk7QUFBQSxNQUNaLFVBQVU7QUFBQTtBQUFBLElBQ1osQ0FBQztBQUFBLEVBQ0g7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMO0FBQUEsUUFDRSxNQUFNO0FBQUEsUUFDTixhQUFhLGNBQWMsSUFBSSxJQUFJLFNBQVMsd0NBQWUsQ0FBQztBQUFBLE1BQzlEO0FBQUEsTUFDQTtBQUFBLFFBQ0UsU0FBUztBQUFBLFFBQ1QsUUFBUTtBQUFBLFFBQ1IsTUFBTTtBQUFBLFFBQ04sTUFBTTtBQUFBLFFBQ04sTUFBTTtBQUFBLFFBQ04sYUFBYSxDQUFDLFFBQVE7QUFDcEIsaUJBQU8sSUFBSSxRQUFRLE1BQU0sRUFBRTtBQUFBLFFBQzdCO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQUEsRUFDQSxPQUFPO0FBQUEsSUFDTCxlQUFlO0FBQUEsTUFDYixVQUFVO0FBQUE7QUFBQSxRQUVSO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxJQUNBLGlCQUFpQjtBQUFBLE1BQ2YseUJBQXlCO0FBQUEsSUFDM0I7QUFBQSxFQUNGO0FBQUEsRUFDQSxjQUFjO0FBQUEsSUFDWixnQkFBZ0I7QUFBQSxNQUNkLFFBQVE7QUFBQSxRQUNOLFFBQVE7QUFBQSxNQUNWO0FBQUEsTUFDQSxTQUFTLENBQUM7QUFBQSxJQUNaO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
