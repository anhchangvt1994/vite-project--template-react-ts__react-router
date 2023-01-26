import type { UserConfig } from 'vite'
import type { RollupAliasOptions } from '@rollup/plugin-alias'
import NormalSplitChunks from './plugins/NormalSplitChunks'

export default async (): Promise<UserConfig> => {
	return {
		// NOTE - If you want to use Regex please use /...\/([^/]+)/ to split chunks right way
		plugins: [NormalSplitChunks([/node_modules\/([^/]+)/, /utils\/([^/]+)/])],
	}
}

export const aliasExternal: RollupAliasOptions = {
	entries: process.env.ESM
		? {
				react: 'https://esm.sh/react@18.2.0',
				'react-dom': 'https://esm.sh/react-dom@18.2.0',
		  }
		: {},
}
