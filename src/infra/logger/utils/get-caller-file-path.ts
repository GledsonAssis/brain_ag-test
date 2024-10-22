export function getCallerFilePath(reference: string | number = 3): string {
      /* istanbul ignore next */
	let stack: string[] = new Error().stack?.split('\n') || []
	const stackFiltered = stack.map(item => item.split('at ')[1] || item)
	switch (typeof reference) {
		case 'number':
			return stackFiltered[reference].slice(
				stackFiltered[reference].lastIndexOf('(') + 1,
				nthLastIndexOf(stackFiltered[reference], ':', 2)
			)
		case 'string':
			const idxRef = stackFiltered.findIndex((item) => item.includes(`${reference}:`)) + 1
			return stackFiltered[idxRef].slice(
				stackFiltered[idxRef].lastIndexOf('(') + 1,
				nthLastIndexOf(stackFiltered[idxRef], ':', 2)
			)
	}
}

const nthLastIndexOf = (url: string, searchString: string, n: number): number => {
      /* istanbul ignore next */
	if (url === null) return -1
	if (!n || isNaN(n) || n <= 1) return url.lastIndexOf(searchString)
	n--
	return url.lastIndexOf(searchString, nthLastIndexOf(url, searchString, n) - 1)
}
