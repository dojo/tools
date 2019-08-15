import * as vscode from 'vscode';

import { addMiddleware } from './middleware';
import { addProperties, addChildren } from './widget-factory';
import { runTests } from './testRunner';

export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(
		vscode.commands.registerTextEditorCommand('dojo.addi18n', addMiddleware('i18n')),
		vscode.commands.registerTextEditorCommand('dojo.addTheme', addMiddleware('theme')),
		vscode.commands.registerTextEditorCommand('dojo.addBlock', addMiddleware('block')),
		vscode.commands.registerTextEditorCommand('dojo.addBreakpoint', addMiddleware('breakpoint')),
		vscode.commands.registerTextEditorCommand('dojo.addCache', addMiddleware('cache')),
		vscode.commands.registerTextEditorCommand('dojo.addIcache', addMiddleware('icache')),
		vscode.commands.registerTextEditorCommand('dojo.addFocus', addMiddleware('focus')),
		vscode.commands.registerTextEditorCommand('dojo.addIntersection', addMiddleware('intersection')),
		vscode.commands.registerTextEditorCommand('dojo.addResize', addMiddleware('resize')),
		vscode.commands.registerTextEditorCommand('dojo.addValidity', addMiddleware('validity')),
		vscode.commands.registerTextEditorCommand('dojo.addStore', addMiddleware('store')),
		vscode.commands.registerTextEditorCommand('dojo.addDimensions', addMiddleware('dimensions')),
		vscode.commands.registerTextEditorCommand('dojo.addProperties', addProperties),
		vscode.commands.registerTextEditorCommand('dojo.addChildren', addChildren),
		vscode.commands.registerCommand('dojo.runAllTests', () => runTests(true)),
		vscode.commands.registerCommand('dojo.runTest', () => runTests())
	);
}
