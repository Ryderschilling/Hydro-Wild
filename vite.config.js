import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        product: resolve(__dirname, 'product.html'),
        shop: resolve(__dirname, 'shop.html'),
        story: resolve(__dirname, 'story.html'),
        contact: resolve(__dirname, 'contact.html'),
      },
    },
  },
});
