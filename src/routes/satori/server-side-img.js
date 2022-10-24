
import AvatarList from '$lib/components/AvatarList.svelte'

import { componentToPng } from '$lib/renderImage';


export const GET = async ({ url }) => {
	const seed = '한글'
	const width = 1200
	const height = 630

	return componentToPng(AvatarList, { seed, width, height, satori: true }, height, width);
};