import * as vscode from 'vscode';

import { Callback } from './interface';
import { addMiddleware } from './middleware';
import { addProperties, addChildren } from './widget-factory';

function addEditorCommand(callback: Callback) {
	return () => {
		const editor = vscode.window.activeTextEditor;
		if (editor) {
			editor.edit((editBuilder) => callback({
				document: editor.document,
				editBuilder,
				selection: editor.selection,
				options: editor.options
			}));
		}
	};
}

export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(
		vscode.commands.registerCommand('dojo.addi18n', addEditorCommand(addMiddleware('i18n'))),
		vscode.commands.registerCommand('dojo.addTheme', addEditorCommand(addMiddleware('theme'))),
		vscode.commands.registerCommand('dojo.addBlock', addEditorCommand(addMiddleware('block'))),
		vscode.commands.registerCommand('dojo.addBreakpoint', addEditorCommand(addMiddleware('breakpoint'))),
		vscode.commands.registerCommand('dojo.addCache', addEditorCommand(addMiddleware('cache'))),
		vscode.commands.registerCommand('dojo.addIcache', addEditorCommand(addMiddleware('icache'))),
		vscode.commands.registerCommand('dojo.addFocus', addEditorCommand(addMiddleware('focus'))),
		vscode.commands.registerCommand('dojo.addIntersection', addEditorCommand(addMiddleware('intersection'))),
		vscode.commands.registerCommand('dojo.addResize', addEditorCommand(addMiddleware('resize'))),
		vscode.commands.registerCommand('dojo.addValidity', addEditorCommand(addMiddleware('validity'))),
		vscode.commands.registerCommand('dojo.addStore', addEditorCommand(addMiddleware('store'))),
		vscode.commands.registerCommand('dojo.addDimensions', addEditorCommand(addMiddleware('dimensions'))),
		vscode.commands.registerCommand('dojo.addProperties', addEditorCommand(addProperties)),
		vscode.commands.registerCommand('dojo.addChildren', addEditorCommand(addChildren))
	);
}
