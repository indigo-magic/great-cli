import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
<% if (preInstallPlugin.includes("vite-plugin-eslint")) { %>import eslintPlugin from 'vite-plugin-eslint';<% }  %>
<% if (preInstallPlugin.includes("vite-plugin-pwa")) { %>import { VitePWA } from 'vite-plugin-pwa'       <% }  %>
<% if (preInstallPlugin.includes("vite-plugin-mock")) { %>import { viteMockServe } from 'vite-plugin-mock';  <% }  %>


// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
    <% if(preInstallPlugin.includes("vite-plugin-eslint")) { %>
        // https://github.com/gxmari007/vite-plugin-eslint
        eslintPlugin(),
    <% }  %>
    <% if (preInstallPlugin.includes("vite-plugin-pwa")) { %>
        // https://github.com/antfu/vite-plugin-pwa
        VitePWA(),
    <% }  %>
    <% if (preInstallPlugin.includes("vite-plugin-mock")) { %>
        // https://github.com/anncwb/vite-plugin-mock
        viteMockServe({
            // default
            mockPath: 'mock',
        }),
    <% }  %>
    ]
})