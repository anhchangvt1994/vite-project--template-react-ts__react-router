import ErrorBoundary from 'utils/ErrorBoundary'
import LoadingBoundary from 'utils/LoadingBoundary'
import LoadingPageComponent from 'components/LoadingPageComponent'
import ErrorLoadingPageComponent from 'components/ErrorPageComponent'

const MainContainer = styled.div`
	max-width: 1280px;
	min-width: 0;
	min-height: 100vh;
	overflow: hidden;
	padding: 16px;
	margin: 0 auto;
`

function Layout() {
	const location = useLocation()
	return (
		<div className="layout">
			<MainContainer>
				<ErrorBoundary fallback={<ErrorLoadingPageComponent />}>
					<LoadingBoundary
						key={location.pathname}
						delay={150}
						fallback={<LoadingPageComponent />}
					>
						<Outlet />
					</LoadingBoundary>
				</ErrorBoundary>
			</MainContainer>
		</div>
	)
} // App()

export default Layout
