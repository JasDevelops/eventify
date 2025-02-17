import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
	base: '/',
	plugins: [
		react(),
		VitePWA({
			manifest: {
				short_name: 'Eventify',
				name: 'Eventify',
				icons: [
					{
						src: 'assets/favicon.svg',
						sizes: '48x48',
						type: 'image/svg+xml',
						purpose: 'maskable',
					},
					{
						src: 'assets/eventify-144.png',
						type: 'image/png',
						sizes: '144x144',
						purpose: 'any',
					},
					{
						src: 'assets/eventify-192.png',
						type: 'image/png',
						sizes: '192x192',
						purpose: 'maskable',
					},
					{
						src: 'assets/eventify-512.png',
						type: 'image/png',
						sizes: '512x512',
						purpose: 'maskable',
					},
				],
				screenshots: [
					{
						src: 'assets/screenshot-1280x720.png',
						sizes: '1280x720',
						type: 'image/png',
						form_factor: 'wide',
					},
					{
						src: 'assets/screenshot-640x1136.png',
						sizes: '640x1136',
						type: 'image/png',
						form_factor: 'narrow',
					},
				],
				id: '/',
				start_url: '/',
				display: 'standalone',
				theme_color: '#f9f9f9',
				background_color: '#331832',
			},
			srcDir: 'src', // Update if your service-worker.js is elsewhere
			filename: 'service-worker.js', // Ensure it's accessible in production
			registerType: 'autoUpdate',
			workbox: {
				runtimeCaching: [
					{
						urlPattern: /\/.*\.(png|svg)$/,
						handler: 'StaleWhileRevalidate',
						options: {
							cacheName: 'images',
							expiration: {
								maxEntries: 50,
							},
						},
					},
				],
			},
		}),
	],
});
