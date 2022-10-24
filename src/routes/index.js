import { processUrl } from '$lib/common.js'

export async function GET({ url }) {

    let body = await processUrl(url)
    return { body }
}