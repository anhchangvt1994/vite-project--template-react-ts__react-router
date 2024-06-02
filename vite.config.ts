import path from 'path'
import fs from 'fs'
import { defineConfig } from 'vite'
import alias from '@rollup/plugin-alias'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import AutoImport from 'unplugin-auto-import/vite'
import tailwind from 'tailwindcss'
import tailwindNesting from 'tailwindcss/nesting'
import autoprefixer from 'autoprefixer'
import postcssSimpleVars from 'postcss-simple-vars'
import EnvironmentPlugin from 'vite-plugin-environment'

import {
	ENV_OBJECT_DEFAULT,
	promiseENVWriteFileSync,
} from './config/env/env.mjs'
import { generateDTS } from './config/types/dts-generator.mjs'

const resolve = resolveTsconfigPathsToAlias()

// https://vitejs.dev/config/
export default defineConfig(async ({ mode }) => {
	// const react =
	// 	mode === 'development'
	// 		? (await import('@vitejs/plugin-react-swc')).default
	// 		: (await import('@vitejs/plugin-react')).default
	const react = await (await import('@vitejs/plugin-react')).default

	promiseENVWriteFileSync.then(function () {
		generateDTS({
			input: ENV_OBJECT_DEFAULT as any,
			outputDir: './config/types' as any,
			filename: 'ImportMeta.d.ts' as any,
		})
	})

	const ViteConfigWithMode = await getViteConfigWithMode(mode)
	const config = ViteConfigWithMode?.default?.() ?? {}
	const aliasExternal = ViteConfigWithMode?.aliasExternal ?? {}

	return {
		publicDir: 'src/assets/static',
		plugins: [
			react(),
			EnvironmentPlugin(ENV_OBJECT_DEFAULT as any, {
				defineOn: 'import.meta.env',
			}),
			nodeResolve({
				extensions: ['.mjs', '.js', '.json', '.js', '.ts', '.jsx', '.tsx'],
				modulePaths: resolve.modules,
			}),
			AutoImport({
				// targets to transform
				include: [
					/\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
					/\.md$/, // .md
				],
				imports: [
					// presets
					'react',
					{
						react: [
							['*', 'React'],
							'Suspense',
							'componentDidCatch',
							'StrictMode',
							'createContext',
						],
					},
					{
						'react-dom/client': ['createRoot'],
					},
					'react-router-dom',
					{
						'react-router-dom': [
							'createBrowserRouter',
							'RouterProvider',
							'BrowserRouter',
							'useMatches',
							'generatePath',
						],
					},
					{
						'app/router/context/InfoContext': ['useRoute'],
						'utils/StringHelper.ts': [
							'getSlug',
							'getSlugWithoutDash',
							'getUnsignedLetters',
							'getCustomSlug',
							'generateTitleCase',
							'generateSentenceCase',
							'encode',
							'decode',
							'hashCode',
						],
						'hooks/useStringHelper.ts': [
							'useSlug',
							'useSlugWithoutDash',
							'useUnsignedLetters',
							'useTitleCase',
							'useSentenceCase',
						],
						'utils/CookieHelper.ts': ['getCookie', 'setCookie', 'deleteCookie'],
					},
					{
						'styled-components': [
							['default', 'styled'],
							'createGlobalStyle',
							'keyframes',
						],
					},
					{
						polished: ['rgba'],
					},
				],
				dts: './config/auto-imports.d.ts',
				eslintrc: {
					enabled: true,
					filepath: './config/.eslintrc-auto-import.json',
				},
			}),
			...(mode === 'development'
				? [
						alias({
							entries: aliasExternal.entries || {},
						}),
				  ]
				: []),
			...(config?.plugins ?? []),
		],
		css: {
			postcss: {
				plugins: [
					autoprefixer,
					postcssSimpleVars,
					(tailwindNesting as () => any)(),
					tailwind('./tailwind.config.cjs'),
				],
			},
		},
		resolve: {
			alias: {
				...resolve.alias,
				...aliasExternal.entries,
			},
		},
		optimizeDeps: {
			...(mode === 'production'
				? {
						exclude: Object.keys(aliasExternal.entries || {}),
				  }
				: {}),
		},
		build: {
			assetsDir: '',
			rollupOptions: {
				output: {
					chunkFileNames() {
						return '[name].[hash].js'
					},
				},
			},
			minify: 'terser',
			terserOptions: {
				format: {
					comments: false, // It will drop all the console.log statements from the final production build
				},
				compress: {
					drop_console: true, // It will stop showing any console.log statement in dev tools. Make it false if you want to see consoles in production mode.
				},
			},
		},
	}
})

const getViteConfigWithMode = (mode) => {
	if (!mode) return

	return mode === 'development'
		? import('./config/vite.development.config')
		: import('./config/vite.production.config')
} // getViteConfigFilePathWithMode(mode?: 'development' | 'production')

function resolveTsconfigPathsToAlias(tsconfigPath = './tsconfig.json') {
	// const tsconfig = require(tsconfigPath)
	// const { paths, baseUrl } = tsconfig.compilerOptions
	// NOTE - Get json content without comment line (ignore error JSON parse some string have unexpected symbol)
	// https://stackoverflow.com/questions/40685262/read-json-file-ignoring-custom-comments
	const tsconfig = JSON.parse(
		fs
			.readFileSync(path.resolve('.', tsconfigPath))
			?.toString()
			.replace(/\\"|"(?:\\"|[^"])*"|(\/\/.*|\/\*[\s\S]*?\*\/)/g, (m, g) =>
				g ? '' : m
			)
	)

	const { paths, baseUrl } = tsconfig.compilerOptions

	const modules = [path.resolve(__dirname, baseUrl)]

	const alias = Object.fromEntries(
		Object.entries(paths)
			.filter(([, pathValues]) => (pathValues as Array<string>).length > 0)
			.map(([pathKey, pathValues]) => {
				const key = pathKey.replace('/*', '')
				const value = path.resolve(
					__dirname,
					baseUrl,
					(pathValues as Array<string>)[0].replace(/[\/|\*]+(?:$)/g, '')
				)
				modules.push(value)
				return [key, value]
			})
	)

	return {
		alias: {
			src: path.resolve(__dirname, baseUrl),
			...alias,
		},
		modules,
	}
} // resolveTsconfigPathsToAlias()
