import * as vscode from 'vscode';
import { parse } from 'path';

import { addMiddleware } from './middleware';
import { regexFactory } from './regex';
import { findLine } from './util';

export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(
		vscode.commands.registerCommand('dojo.addi18n', function() {
			let editor = vscode.window.activeTextEditor;
			if (editor) {
				let document = editor.document;
				editor.edit((editBuilder) => addMiddleware(document, editBuilder, 'i18n'));
			}
		}),
		vscode.commands.registerCommand('dojo.addTheme', function() {
			let editor = vscode.window.activeTextEditor;
			if (editor) {
				let document = editor.document;
				editor.edit((editBuilder) => addMiddleware(document, editBuilder, 'theme'));
			}
		}),
		vscode.commands.registerCommand('dojo.addBlock', function() {
			let editor = vscode.window.activeTextEditor;
			if (editor) {
				let document = editor.document;
				editor.edit((editBuilder) => addMiddleware(document, editBuilder, 'block'));
			}
		}),
		vscode.commands.registerCommand('dojo.addBreakpoint', function() {
			let editor = vscode.window.activeTextEditor;
			if (editor) {
				let document = editor.document;
				editor.edit((editBuilder) => addMiddleware(document, editBuilder, 'breakpoint'));
			}
		}),
		vscode.commands.registerCommand('dojo.addCache', function() {
			let editor = vscode.window.activeTextEditor;
			if (editor) {
				let document = editor.document;
				editor.edit((editBuilder) => addMiddleware(document, editBuilder, 'cache'));
			}
		}),
		vscode.commands.registerCommand('dojo.addIcache', function() {
			let editor = vscode.window.activeTextEditor;
			if (editor) {
				let document = editor.document;
				editor.edit((editBuilder) => addMiddleware(document, editBuilder, 'icache'));
			}
		}),
		vscode.commands.registerCommand('dojo.addFocus', function() {
			let editor = vscode.window.activeTextEditor;
			if (editor) {
				let document = editor.document;
				editor.edit((editBuilder) => addMiddleware(document, editBuilder, 'focus'));
			}
		}),
		vscode.commands.registerCommand('dojo.addIntersection', function() {
			let editor = vscode.window.activeTextEditor;
			if (editor) {
				let document = editor.document;
				editor.edit((editBuilder) => addMiddleware(document, editBuilder, 'intersection'));
			}
		}),
		vscode.commands.registerCommand('dojo.addResize', function() {
			let editor = vscode.window.activeTextEditor;
			if (editor) {
				let document = editor.document;
				editor.edit((editBuilder) => addMiddleware(document, editBuilder, 'resize'));
			}
		}),
		vscode.commands.registerCommand('dojo.addValidity', function() {
			let editor = vscode.window.activeTextEditor;
			if (editor) {
				let document = editor.document;
				editor.edit((editBuilder) => addMiddleware(document, editBuilder, 'validity'));
			}
		}),
		vscode.commands.registerCommand('dojo.addStore', function() {
			let editor = vscode.window.activeTextEditor;
			if (editor) {
				let document = editor.document;
				editor.edit((editBuilder) => addMiddleware(document, editBuilder, 'store'));
			}
		}),
		vscode.commands.registerCommand('dojo.addDimensions', function() {
			let editor = vscode.window.activeTextEditor;
			if (editor) {
				let document = editor.document;
				editor.edit((editBuilder) => addMiddleware(document, editBuilder, 'dimensions'));
			}
		}),
		vscode.commands.registerCommand('dojo.addProperties', function() {
			let editor = vscode.window.activeTextEditor;
			if (editor) {
				let document = editor.document;
				editor.edit((editBuilder) => {
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

					const widgetFactoryLine = findLine(document, regex.widgetFactoryStart);
					if (widgetFactoryLine) {
						if (regex.widgetFactoryEnd.test(widgetFactoryLine.text)) {
							let newWidgetFactoryLine = widgetFactoryLine.text;
							if (/([ ]*}[ ]*\))/g.test(newWidgetFactoryLine)) {
								newWidgetFactoryLine = widgetFactoryLine.text.replace(/([ ]*}[ ]*\))/g, `, properties })`);
							}
							else if (/(\([ ]*\))/g.test(newWidgetFactoryLine)) {
								newWidgetFactoryLine = widgetFactoryLine.text.replace(/(\([ ]*\))/g, `({ properties })`);
							}
							editBuilder.replace(widgetFactoryLine.range, newWidgetFactoryLine);
							editBuilder.insert(widgetFactoryLine.rangeIncludingLineBreak.end, '\tconst {  } = properties();\r\n');
						}
						else {
							const widgetFactoryEndLine = findLine(document, regex.widgetFactoryEnd);
							if (widgetFactoryEndLine) {
								const lineBefore = document.lineAt(widgetFactoryEndLine.lineNumber - 1);
								editBuilder.insert(lineBefore.range.end, ',');
								editBuilder.insert(widgetFactoryEndLine.rangeIncludingLineBreak.start, '\tproperties\r\n');
								editBuilder.insert(widgetFactoryEndLine.rangeIncludingLineBreak.end, '\tconst {  } = properties();\r\n');
							}
						}
					}
				});
			}
		})
	);
}
