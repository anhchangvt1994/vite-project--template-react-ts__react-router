import 'assets/styles/main.scss'
import 'assets/styles/tailwind.css'
import router from 'config/router/index'

const root = createRoot(document.getElementById('root'))

root.render(
	<StrictMode>
		<RouterProvider router={router} />
	</StrictMode>
)
