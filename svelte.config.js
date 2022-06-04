import adapter from '@sveltejs/adapter-auto';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter(),
		vite: {
			optimizeDeps: {
				exclude: ["@babichjacob/svelte-localstorage"],
			},
			ssr: {
				noExternal: ["@babichjacob/svelte-localstorage"],
			},
		}
	}
};

export default config;
