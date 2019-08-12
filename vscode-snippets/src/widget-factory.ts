import * as vscode from 'vscode';
import { parse } from "path";

import { regexFactory } from "./regex";
import { findLine, getTab } from "./util";
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
				newWidgetFactoryLine = widgetFactoryLine.text.replace(/([ ]*}[ ]*\))/g, `, ${property} })`);
			}
			else if (/(\([ ]*\))/g.test(newWidgetFactoryLine)) {
				newWidgetFactoryLine = widgetFactoryLine.text.replace(/(\([ ]*\))/g, `({ ${property} })`);
			}
			editBuilder.replace(widgetFactoryLine.range, newWidgetFactoryLine);
			callback(widgetFactoryLine);
		}
		else {
			const widgetFactoryEndLine = findLine(document, regex.widgetFactoryEnd);
			if (widgetFactoryEndLine) {
				const lineBefore = document.lineAt(widgetFactoryEndLine.lineNumber - 1);
				editBuilder.insert(lineBefore.range.end, ',');
				editBuilder.insert(widgetFactoryEndLine.rangeIncludingLineBreak.start, `${tab}${property}\r\n`);
				callback(widgetFactoryLine);
			}
		}
	}
}

export const addProperties: Callback = ({ document, editBuilder, options }) => {
	const regex = regexFactory();
	const file = parse(document.fileName);
	const lastImportStatement = findLine(document, regex.importLine, { reverse: true });
	if (lastImportStatement) {
		editBuilder.insert(
			lastImportStatement.rangeIncludingLineBreak.end,
			`\r\ninterface ${file.name}Properties {\r\n\r\n}\r\n`
		);
	}

	const createLine = findLine(document, regex.createLine);
	if (createLine) {
		let line: vscode.TextLine | undefined;
		if (regex.createLineEnd.test(createLine.text)) {
			line = createLine;
		}
		else {
			const createEndLine = findLine(document, regex.createLineEnd, { startAt: createLine.lineNumber });
			if (createEndLine) {
				line = createEndLine;
			}
		}
		if (line) {
			const newCreateLine = line.text.replace(');', `).properties<${file.name}Properties>();`);
			editBuilder.replace(line.range, newCreateLine);
		}
	}

	addToWidgetFactory(document, editBuilder, options, 'properties', (widgetFactoryEndLine) => {
		editBuilder.insert(widgetFactoryEndLine.rangeIncludingLineBreak.end, '\tconst {  } = properties();\r\n');
	});
}

export const addChildren: Callback = ({ document, editBuilder, selection, options }) => {
	addToWidgetFactory(document, editBuilder, options, 'children', () => editBuilder.insert(selection.anchor, 'children()'));
}
