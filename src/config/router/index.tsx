import { useMatches } from 'react-router-dom'
import type { RouteObject, Params, To } from 'react-router'
import type { IValidation } from 'config/router/context/ValidationContext'
import {
	INavigateInfo,
	IRouteInfo,
	NavigateInfoContext,
	RouteInfoContext,
	useNavigateInfo,
	useRouteInit,
	RouteInitContext,
} from 'config/router/context/InfoContext'
import Layout from 'Layout'
import NotFoundPage from 'pages/NotFoundPage'

function withLazy(
	f: () => Promise<{
		default: React.ComponentType<any>
	}>
) {
	try {
		if (typeof f === 'function') {
			const Component = lazy(f)
			return <Component />
		} else {
			throw Object.assign(
				new Error(
					'The param of withLazy function must be a Function return a Promise or a Dynamic Import that give a React.ComponentType'
				),
				{ code: 402 }
			)
		}
	} catch (err) {
		console.error(err)
	}
} // withLazy

function ValidateBasicParam(): IValidation {
	const params = useParams()

	for (const key in params) {
		if (
			params[key] &&
			(!/^[a-zA-Z0-9._-]+$/.test(params[key] as string) ||
				/[._-]+$/.test(params[key] as string))
		) {
			return {
				status: 404,
			}
		}
	}

	return {
		status: 200,
	}
} //ValidateBasicParam()

function ValidateCustomParams(): IValidation {
	const params = useParams()

	const validation: IValidation = {
		status: 200,
	}

	const matches = useMatches()
	matches.some(function (item) {
		const validate = (
			item as {
				handle?: {
					params?: {
						validate: (params: Params) => IValidation
					}
				}
			}
		)?.handle?.params?.validate

		if (params && typeof validate === 'function' && !validate(params)) {
			validation.status = 404
			return true
		}
	})

	return validation
} // ValidateCustomParams()

function useProtectRoute(): IValidation {
	const matches = useMatches()
	const protection: IValidation = {
		status: 200,
	}
	matches.some(function (item) {
		const protect = (
			item?.handle as
				| {
						protect: () => string
				  }
				| undefined
		)?.protect

		if (protect && typeof protect === 'function') {
			const protectInfo = protect()

			if (!protectInfo) {
				protection.status = 302
				protection.redirect = protectInfo
				return true
			}
		}
	})

	return protection
} // useProtectRoute()

function useSplitParams(): Params<string> {
	const matches = useMatches()
	const params = useParams()

	let newParams = {
		...params,
	}

	matches.forEach(function (item) {
		const splitParams = (
			item as {
				handle?: {
					params?: {
						split: (params: Params) => Params
					}
				}
			}
		)?.handle?.params?.split

		if (params && typeof splitParams === 'function') {
			newParams = {
				...newParams,
				...(splitParams(params) || {}),
			}
		}
	})

	return newParams
} // useSplitParams()

function RouterInit({ children }) {
	const location = useLocation()
	const matches = useMatches()
	const routeInit = matches.find((item) => item.pathname === location.pathname)

	return (
		<RouteInitContext.Provider value={routeInit}>
			{children}
		</RouteInitContext.Provider>
	)
}

function RouterValidation({ children }) {
	let validation: IValidation = { status: 200 }
	validation = ValidateBasicParam()

	if (validation.status === 404) {
		return <NotFoundPage />
	}

	validation = ValidateCustomParams()

	if (validation.status === 404) {
		return <NotFoundPage />
	}

	return children
} // RouterValidation()

function RouterProtection({ children }) {
	const protection = useProtectRoute()

	if (protection.status !== 200) {
		const to =
			typeof protection.redirect === 'string' ? protection.redirect : -1
		return <Navigate to={to as To} replace={true} />
	}

	return children
} // RouterProtect()

function RouterDiliver({ children }) {
	const location = useLocation()
	const routeInit = useRouteInit()
	const params = useSplitParams()
	const queryString = location.search?.substring(1)
	const query = queryString
		? JSON.parse(
				'{"' + queryString.replace(/&/g, '","').replace(/=/g, '":"') + '"}',
				function (key, value) {
					return key === '' ? value : decodeURIComponent(value)
				}
		  )
		: undefined

	const routeInfo: IRouteInfo = {
		params,
		query,
		path: location.pathname,
		fullPath: location.pathname + location.search,
		id: routeInit?.id,
	}

	const prevNavigateInfo = useNavigateInfo()

	const navigateInfo: INavigateInfo = {
		from: prevNavigateInfo.to ? prevNavigateInfo.to : undefined,
		to: routeInfo,
	}

	return (
		<RouteInfoContext.Provider value={routeInfo}>
			<NavigateInfoContext.Provider value={navigateInfo}>
				{children}
			</NavigateInfoContext.Provider>
		</RouteInfoContext.Provider>
	)
} // RouterDiliver()

const routes: RouteObject[] = [
	{
		path: import.meta.env.ROUTER_BASE_PATH,
		element: (
			<RouterInit>
				<RouterValidation>
					<RouterProtection>
						<RouterDiliver>
							<Layout />
						</RouterDiliver>
					</RouterProtection>
				</RouterValidation>
			</RouterInit>
		),
		children: [
			{
				index: true,
				path: import.meta.env.ROUTER_HOME_PATH,
				element: withLazy(() => import('pages/HomePage')),
			},
			{
				path: import.meta.env.ROUTER_CONTENT_PATH,
				element: withLazy(() => import('pages/ContentPage')),
				handle: {
					params: {
						validate(p) {
							if (typeof p.slugs === 'string') {
								return /\d+$/.test(p.slugs as string)
							}

							return true
						},
						split(p) {
							return {
								slug: p.slugs?.match(/^[a-zA-Z-_.]+[a-zA-Z]/)?.[0],
								id: p.slugs?.match(/\d+$/)?.[0],
							}
						},
					},
					protect: () => {
						return true
					},
				},
				children: [
					{
						path: import.meta.env.ROUTER_COMMENT_PAGE_PATH,
						element: withLazy(
							() => import('components/comment-page/CommentRow')
						),
					},
				],
			}, // Content Page
			{
				path: import.meta.env.ROUTER_NOT_FOUND_PATH,
				element: <NotFoundPage />,
			},
		],
	},
]

const router = createBrowserRouter(routes, {
	basename: '/',
})

export default router
