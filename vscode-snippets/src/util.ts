import * as vscode from 'vscode';
import { regexFactory } from './regex';

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
	if (endTest) {
		endTest.lastIndex = 0;
	}
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

export const findEndOfCreateLine: (textEditor: vscode.TextEditor) => vscode.TextLine | undefined = (
	editor
) => {
	const document = editor.document;
	const regex = regexFactory();

	const createLine = findLine(document, regex.createLine);
	if (createLine) {
		let line: vscode.TextLine | undefined;
		if (regex.createLineEnd.test(createLine.text)) {
			line = createLine;
		} else {
			regex.createLineEnd.lastIndex = 0;
			const createEndLine = findLine(document, regex.createLineEnd, {
				startAt: createLine.lineNumber,
				endTest: regex.export,
			});
			regex.export.lastIndex = 0;
			if (createEndLine && !regex.export.test(createEndLine.text)) {
				line = createEndLine;
			}
			regex.export.lastIndex = 0;
		}

		return line;
	}
};

export const findLastMiddlewareInCreateLine: (
	textEditor: vscode.TextEditor
) => vscode.TextLine | undefined = (editor) => {
	const document = editor.document;
	const regex = regexFactory();

	const endOfCreateLine = findEndOfCreateLine(editor);
	if (endOfCreateLine) {
		regex.lastMiddleware.lastIndex = 0;
		regex.createLine.lastIndex = 0;
		const lastMiddlewareLine = findLine(document, regex.lastMiddleware, {
			startAt: endOfCreateLine.lineNumber,
			endTest: regex.createLine,
			reverse: true,
		});
		regex.createLine.lastIndex = 0;
		if (lastMiddlewareLine && !regex.createLine.test(lastMiddlewareLine.text)) {
			return lastMiddlewareLine;
		}
	}
};

export const findEndOfMiddlewareWidgetFactoryLine: (
	textEditor: vscode.TextEditor
) => vscode.TextLine | undefined = (editor) => {
	const document = editor.document;
	const regex = regexFactory();

	const middlewareWidgetFactoryLine = findLine(document, regex.widgetFactoryReplace);
	if (middlewareWidgetFactoryLine) {
		let line: vscode.TextLine | undefined;

		regex.objectClose.lastIndex = 0;
		const middlewareWidgetFactoryEndLine = findLine(document, regex.objectClose, {
			startAt: middlewareWidgetFactoryLine.lineNumber,
			endTest: regex.export,
		});
		regex.export.lastIndex = 0;
		if (
			middlewareWidgetFactoryEndLine &&
			!regex.export.test(middlewareWidgetFactoryEndLine.text)
		) {
			line = middlewareWidgetFactoryEndLine;
		}
		regex.export.lastIndex = 0;

		return line;
	}
};

export const findLastMiddlewareInWidgetFactoryLine: (
	textEditor: vscode.TextEditor
) => vscode.TextLine | undefined = (editor) => {
	const document = editor.document;
	const regex = regexFactory();

	const middlewareWidgetFactoryEndLine = findEndOfMiddlewareWidgetFactoryLine(editor);
	if (middlewareWidgetFactoryEndLine) {
		regex.lastMiddleware.lastIndex = 0;
		regex.widgetFactoryReplace.lastIndex = 0;
		const lastMiddlewareLine = findLine(document, regex.lastMiddleware, {
			startAt: middlewareWidgetFactoryEndLine.lineNumber,
			endTest: regex.widgetFactoryReplace,
			reverse: true,
		});
		regex.widgetFactoryReplace.lastIndex = 0;
		if (lastMiddlewareLine && !regex.widgetFactoryReplace.test(lastMiddlewareLine.text)) {
			return lastMiddlewareLine;
		}
	}
};
