import * as vscode from 'vscode';

export function findLine(
	document: vscode.TextDocument,
	test: RegExp,
	options: {
		reverse?: boolean;
		startAt?: number;
		endTest?: RegExp;
	} = {}
) {
	test.lastIndex = 0;
	const { reverse = false, endTest } = options;
	const { startAt = reverse ? document.lineCount - 1 : 0 } = options;
	for (
		let i = reverse ? document.lineCount - startAt - 1 : startAt;
		i < document.lineCount;
		i++
	) {
		const line = document.lineAt(reverse ? document.lineCount - i - 1 : i);
		if (test.test(line.text)) {
			return line;
		}
		if (endTest && endTest.test(line.text)) {
			return line;
		}
	}
}

export function getTab(options: vscode.TextEditorOptions) {
	let tab = '\t';
	if (options.insertSpaces) {
		tab = ' '.repeat(Number(options.tabSize));
	}
	return tab;
}
