import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({
    plugins: [react()],
    base: '/', // Configura esto si tu app estará en un subdirectorio, ej: '/my-app/'
    resolve: {
        alias: {
            '@': '/src',
        },
    },
});
