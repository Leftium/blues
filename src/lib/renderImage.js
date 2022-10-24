import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { html as toReactNode } from 'satori-html';

async function loadFont(url) {
	const fontUrl = 'http://fonts.gstatic.com/s/notosanskr/v27/PbykFmXiEBPT4ITbgNA5Cgm20HTs4JMMuA.otf'
	const fetched = await fetch(fontUrl)

	const data = await fetched.arrayBuffer()

	return data;
}

export async function componentToPng(component, props, height, width) {
	const result = component.render(props);
	const html = `${result.html}<style>${result.css.code}</style>`
	const markup = toReactNode(html);

	const patchObject = (obj, targetKey, method) => {
		if (Array.isArray(obj)) {
			obj.forEach(element => patchObject(element, targetKey, method))
		} else if (typeof obj === 'object') {
			for (const key in obj) {
				const value = obj[key]
				if (key === targetKey) obj[key] = method(obj[key])
				else patchObject(value, targetKey, method)
			}
		}
	}

	patchObject(markup, 'backgroundImage', (url) => url.replace('https//', 'https://'))

	const svg = await satori(markup, {
		fonts: [
			{
				name: 'Noto Sans KR',
				data: await loadFont(),
				style: 'normal'
			}
		],
		height: +height,
		width: +width
	});

	const resvg = new Resvg(svg, {
		fitTo: {
			mode: 'width',
			value: +width
		}
	});

	const png = resvg.render();

	return new Response(png.asPng(), {
		headers: {
			'content-type': 'image/png'
		}
	});
}