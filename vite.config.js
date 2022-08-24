import { sveltekit } from '@sveltejs/kit/vite';

/** @type {import('vite').UserConfig} */
const config = {
        plugins: [sveltekit()],
        optimizeDeps: {
                exclude: ["@babichjacob/svelte-localstorage"],
        },
        ssr: {
                noExternal: ["@babichjacob/svelte-localstorage",
                             "@popperjs/core"]
        },
};

export default config;
