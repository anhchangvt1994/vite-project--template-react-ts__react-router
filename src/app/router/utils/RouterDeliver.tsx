import {
	INavigateInfo,
	IRouteInfo,
	NavigateInfoContext,
	RouteInfoContext,
	useRouteInit,
} from 'app/router/context/InfoContext'
import type { Params } from 'react-router'

let navigateInfo: INavigateInfo = {
	from: undefined,
	to: undefined,
}

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

export default function RouterDeliver({ children }) {
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
		handle: {},
	}

	navigateInfo = {
		from:
			navigateInfo.to && navigateInfo.to.fullPath !== routeInfo.fullPath
				? navigateInfo.to
				: navigateInfo.from,
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
