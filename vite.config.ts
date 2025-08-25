import * as path from "node:path";
import fs from "node:fs";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import tailwind from "tailwindcss";
import autoprefixer from "autoprefixer";
import postcssReplace from "postcss-replace";
import { globbySync } from "globby";

// https://vitejs.dev/config/
export default defineConfig(async ({ mode }) => {
    const isDev = mode !== "production";

    const entry = [
        path.resolve(__dirname, "src/index.ts"),
        path.resolve(__dirname, "src/locale-bundle.ts"),
        path.resolve(__dirname, "src/components/menus/bubble-extra.ts"),
    ];

    const files = await globbySync("src/extensions/**/*.ts", {
        ignore: ["src/**/*/index.ts", "src/**/*.spec.ts"], // Exclude .spec.ts files
    });

    const exports = {};
    const typeVersions = {};

    files.forEach((v: any) => {
        const vv = v.replace("src/", "");
        const [, _name, i] = vv.split("/");
        if (!_name?.includes("BaseKit")) {
            entry.push(
                path.resolve(__dirname, `src/extensions/${_name}/${_name}.ts`)
            );

            exports[`./${_name.toLowerCase()}`] = {
                require: {
                    types: `./lib/${_name}.d.cts`,
                    default: `./lib/${_name}.cjs`,
                },
                import: {
                    types: `./lib/${_name}.d.ts`,
                    default: `./lib/${_name}.js`,
                },
            };
            typeVersions[`./${_name.toLowerCase()}`] = [`./lib/${_name}.d.ts`];
        }
    });

    exports["."] = {
        require: {
            types: "./lib/index.d.cts",
            default: "./lib/index.cjs",
        },
        import: {
            types: "./lib/index.d.ts",
            default: "./lib/index.js",
        },
    };

    exports["./locale-bundle"] = {
        require: {
            types: "./lib/locale-bundle.d.cts",
            default: "./lib/locale-bundle.cjs",
        },
        import: {
            types: "./lib/locale-bundle.d.ts",
            default: "./lib/locale-bundle.js",
        },
    };

    exports["./bubble-extra"] = {
        require: {
            types: "./lib/bubble-extra.d.cts",
            default: "./lib/bubble-extra.cjs",
        },
        import: {
            types: "./lib/bubble-extra.d.ts",
            default: "./lib/bubble-extra.js",
        },
    };

    exports["./style.css"] = {
        require: "./lib/style.css",
        import: "./lib/style.css",
    };

    return {
        plugins: [
            react(),
            dts({
                rollupTypes: true,
                afterBuild: (emittedFiles) => {
                    emittedFiles.forEach((content, filePath) => {
                        if (filePath.endsWith(".d.ts")) {
                            const newFilePath = filePath.replace(".d.ts", ".d.cts");
                            fs.writeFileSync(newFilePath, content);
                        }
                    });
                },
            }),
        ],
        resolve: {
            alias: [{ find: "@", replacement: path.resolve(__dirname, "src") }],
        },
        css: {
            postcss: {
                plugins: [
                    tailwind(),
                    autoprefixer(),
                    postcssReplace({
                        pattern: /(--tw|\*, ::before, ::after)/g,
                        data: {
                            "--tw": "--richtext", // Prefixing
                            "*, ::before, ::after": ":root", // So variables does not pollute every element
                        },
                    }),
                ],
            },
            preprocessorOptions: {
                scss: {
                    charset: false,
                    api: "modern-compiler", // or 'modern'
                },
            },
        },
        build: {
            cssMinify: "esbuild",
            minify: "esbuild",
            outDir: "lib",
            sourcemap: isDev,
            lib: {
                entry,
                formats: ["es", "cjs"],
                fileName: (format, entryName) => {
                    if (format === "es") return `${entryName}.js`;

                    return `${entryName}.cjs`;
                },
            },
            rollupOptions: {
                output: {
                    assetFileNames: (assetInfo) => {
                        if (assetInfo.name == "rich-text-editor.css") return "style.css";
                        return assetInfo.name;
                    },
                },
                external: [
                    "react",
                    "react-dom",
                    "react/jsx-runtime",
                    "katex",
                    "docx",
                    "@radix-ui/react-dropdown-menu",
                    "@radix-ui/react-icons",
                    "@radix-ui/react-label",
                    "@radix-ui/react-popover",
                    "@radix-ui/react-separator",
                    "@radix-ui/react-slot",
                    "@radix-ui/react-switch",
                    "@radix-ui/react-tabs",
                    "@radix-ui/react-toast",
                    "@radix-ui/react-toggle",
                    "@radix-ui/react-tooltip",
                    "@radix-ui/react-select",
                    "@radix-ui/react-checkbox",
                    "react-colorful",
                    "scroll-into-view-if-needed",
                    "tippy.js",
                    "lucide-react",
                    "prosemirror-docx",
                    "re-resizable",
                    "@excalidraw/excalidraw",
                    "@radix-ui/react-dialog",
                    "react-image-crop",
                    "mermaid",
                    "easydrawer",
                    "frimousse",
                ],
            },
        },
    };
});
