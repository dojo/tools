import * as vscode from 'vscode';

function findLine(document: vscode.TextDocument, test: RegExp, reverse = false) {
	let start = reverse ? document.lineCount : 0;
	let end = reverse ? 0 : document.lineCount;
	let iChange = reverse ? -1 : 1;
	for (let i = start; i < end; i = i + iChange) {
		const line = document.lineAt(i);
		if (test.test(line.text)) {
			return line;
		}
	}
}

function addMiddleware(
	document: vscode.TextDocument,
	editBuilder: vscode.TextEditorEdit,
	middleware: string
) {
	const vdomImportRegex = /import \{[a-zA-Z0-9, ]+\} from '@dojo\/framework\/core\/vdom';/g;
	const createLineRegex = /create\((\{[a-zA-Z0-9, ]+\})*\)/g;
	const widgetFactoryRegex = /export (?:default|const [a-zA-Z0-9]+[ ]*=)[ ]*[a-zA-Z0-9]+\((?:function [a-zA-Z0-9]+)*\((?:{[ ]*middleware[ ]*:[ ]*(\{[a-zA-Z0-9, ]+\})*[ ]*\}[ ]*)*\)/g;
	const widgetFactoryReplaceRegex = /\((?:{[ ]*middleware[ ]*:[ ]*(\{[a-zA-Z0-9, ]+\})*[ ]*\}[ ]*)*\)/g;

	let importName = middleware;
	if (middleware === 'store') {
		importName = `create${importName.charAt(0).toUpperCase()}${importName.slice(1)}Middleware`;
	}

	const importStatement = `import ${importName} from \'@dojo/framework/core/middleware/${middleware}\';\r\n`;
	const importLine = findLine(document, vdomImportRegex);
	if (importLine) {
		editBuilder.insert(importLine.rangeIncludingLineBreak.end, importStatement);
	}

	const createLine = findLine(document, createLineRegex);
	if (createLine) {
		let newCreateLine = createLine.text;
		createLineRegex.lastIndex = 0;
		const match = createLineRegex.exec(newCreateLine);
		if (match && match.length > 1 && match[1]) {
			let middlewares = match[1];
			const newMiddleware = middlewares.replace(/[ ]*\}/g, `, ${middleware} }`);
			newCreateLine = newCreateLine.replace(middlewares, newMiddleware);
		} else {
			newCreateLine = newCreateLine.replace('create()', `create({ ${middleware} })`);
		}
		editBuilder.replace(createLine.range, newCreateLine);

		switch (middleware) {
			case 'store':
				editBuilder.insert(
					createLine.range.start,
					`const ${middleware} = ${importName}();\r\n`
				);
				break;
		}
	}

	const widgetFactoryLine = findLine(document, widgetFactoryRegex);
	if (widgetFactoryLine) {
		let newFactoryLine = widgetFactoryLine.text;
		const match = widgetFactoryReplaceRegex.exec(newFactoryLine);
		if (match && match.length > 1 && match[1]) {
			let middlewares = match[1];
			const newMiddleware = middlewares.replace(/[ ]*\}/g, `, ${middleware} }`);
			newFactoryLine = newFactoryLine.replace(middlewares, newMiddleware);
		} else {
			newFactoryLine = newFactoryLine.replace('()', `({ middleware: { ${middleware} } })`);
		}
		editBuilder.replace(widgetFactoryLine.range, newFactoryLine);
	}
}

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
		})
	);
}
