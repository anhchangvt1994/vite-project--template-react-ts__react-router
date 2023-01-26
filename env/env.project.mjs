import { createRequire } from 'module'
const require = createRequire(import.meta.url)

export default {
	prefix: 'project',
	data: {
		mode: process.env.MODE,
	},
}
