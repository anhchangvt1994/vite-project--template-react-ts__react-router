import useEffectCustomize from 'utils/use-effect-customize'

function App() {
	const [count, setCount] = useState(0)

	const useEffectCounter = new useEffectCustomize([count])

	useEffectCounter.init(() => {
		const timer = setTimeout(() => setCount(count + 1), 1000)
		return () => clearTimeout(timer)
	})

	return (
		<div className="app">
			<img
				className="app-logo"
				src="images/logo.svg"
				alt=" Logo"
				width="256"
				height="256"
			/>
			<p className="text-primary greeting-label">
				Welcome to {import.meta.env.GENERAL_GREETING}
			</p>
			<p className="text-green counter-label">
				Page has been open for <code>{count}</code> seconds.
			</p>
		</div>
	)
} // App()

export default App
