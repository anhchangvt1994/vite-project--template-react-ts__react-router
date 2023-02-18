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
		content_comment: {
			path: 'comment',
		},
		comment: {
			path: 'comment/detail',
			id: 'CommentPage',
		},
		login: {
			path: 'login',
			id: 'LoginPage',
		},
		not_found: {
			path: '*',
		},
	},
}
