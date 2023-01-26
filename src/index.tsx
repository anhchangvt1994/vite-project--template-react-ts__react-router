import 'assets/styles/tailwind.css'
import 'assets/styles/app.scss'

const root = createRoot(document.getElementById('root'))
const App = React.lazy(() => import('App'))

root.render(
	<Suspense>
		<App />
	</Suspense>
)
