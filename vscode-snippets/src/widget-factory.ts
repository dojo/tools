import * as vscode from 'vscode';
import { parse } from 'path';

import { regexFactory } from './regex';
import { findEndOfCreateLine, findLine, getTab } from './util';
import { Callback } from './interface';

function addToWidgetFactory(
	document: vscode.TextDocument,
	editBuilder: vscode.TextEditorEdit,
	options: vscode.TextEditorOptions,
	property: string,
	callback: (widgetFactoryEndLine: vscode.TextLine) => void
) {
	const tab = getTab(options);
	const regex = regexFactory();
	const widgetFactoryLine = findLine(document, regex.widgetFactoryStart);
	if (widgetFactoryLine) {
		if (regex.widgetFactoryEnd.test(widgetFactoryLine.text)) {
			let newWidgetFactoryLine = widgetFactoryLine.text;
			if (/([ ]*}[ ]*\))/g.test(newWidgetFactoryLine)) {
				newWidgetFactoryLine = widgetFactoryLine.text.replace(
					/([ ]*}[ ]*\))/g,
					`, ${property} })`
				);
			} else {
				newWidgetFactoryLine = widgetFactoryLine.text.replace(
					/(\([ ]*\))/g,
					`({ ${property} })`
				);
			}
			editBuilder.replace(widgetFactoryLine.range, newWidgetFactoryLine);
			callback(widgetFactoryLine);
		} else {
			const widgetFactoryEndLine = findLine(document, regex.widgetFactoryEnd);
			if (widgetFactoryEndLine) {
				const lineBefore = document.lineAt(widgetFactoryEndLine.lineNumber - 1);
				editBuilder.insert(lineBefore.range.end, ',');
				editBuilder.insert(
					widgetFactoryEndLine.rangeIncludingLineBreak.start,
					`${tab}${property}\r\n`
				);
				callback(widgetFactoryEndLine);
			}
		}
	}
}

export const addProperties: Callback = (editor, edit) => {
	const document = editor.document;
	const regex = regexFactory();
	const file = parse(document.fileName);
	const lastImportStatement = findLine(document, regex.importLine, { reverse: true });
	if (lastImportStatement) {
		edit.insert(
			lastImportStatement.rangeIncludingLineBreak.end,
			`\r\ninterface ${file.name}Properties {\r\n\r\n}\r\n`
		);
	}

	const endOfCreateLine = findEndOfCreateLine(editor);
	if (endOfCreateLine) {
		const newCreateLine = endOfCreateLine.text.replace(
			');',
			`).properties<${file.name}Properties>();`
		);
		edit.replace(endOfCreateLine.range, newCreateLine);
	}

	addToWidgetFactory(document, edit, editor.options, 'properties', (widgetFactoryEndLine) => {
		edit.insert(
			widgetFactoryEndLine.rangeIncludingLineBreak.end,
			'\tconst {  } = properties();\r\n'
		);
	});
};

export const addChildren: Callback = (editor, edit) => {
	addToWidgetFactory(editor.document, edit, editor.options, 'children', () =>
		edit.insert(editor.selection.anchor, 'children()')
	);
};
