
import { processUrl } from '$lib/common';
import AvatarList from '$lib/components/AvatarList.svelte'
import Simple from '$lib/components/Simple.svelte'

import { componentToPng } from '$lib/renderImage';


export const GET = async ({ url }) => {
	const seed = '한글'
	const width = 1200
	const height = 630

	const {members} = await processUrl(url)

	return componentToPng(AvatarList, { members, width, height, satori: true }, height, width);
};