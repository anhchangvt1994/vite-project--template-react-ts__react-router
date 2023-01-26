export default {
	prefix: 'router',
	data: {
		base: {
			path: '/',
		},
		home: {
			path: '/',
		},
		content: {
			path: ':slugs',
		},
		comment_page: {
			path: 'comment',
		},
		detail: {
			path: 'detail',
		},
		not_found: {
			path: '*',
		},
	},
}
