import {
	quicktype,
	InputData,
	jsonInputForTargetLanguage,
} from 'quicktype-core'
import {
	ENV_OBJECT_DEFAULT as ImportMeta,
	promiseENVWriteFileSync,
} from '../env/env.mjs'
import { writeFile } from 'fs'
import { resolve } from 'path'

async function quicktypeJSON(targetLanguage, jsonString) {
	const jsonInput = jsonInputForTargetLanguage(targetLanguage)

	// We could add multiple samples for the same desired
	// type, or many sources for other types. Here we're
	// just making one type from one piece of sample JSON.
	await jsonInput.addSource({
		name: 'ImportMeta',
		samples: [jsonString],
	})

	const inputData = new InputData()
	inputData.addInput(jsonInput)

	return await quicktype({
		inputData,
		lang: targetLanguage,
		rendererOptions: { 'just-types': 'true' },
	})
}

async function main() {
	const { lines: tdsGroup } = await quicktypeJSON(
		'typescript',
		JSON.stringify({ env: ImportMeta })
	)

	writeFile(
		resolve('./config/types', 'ImportMeta.d.ts'),
		tdsGroup.join('\n').replace(/export\s/g, ''),
		function (err) {}
	)
}

main()

export { promiseENVWriteFileSync }
