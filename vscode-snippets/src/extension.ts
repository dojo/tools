import * as vscode from 'vscode';
import { sep, join } from 'path';
import { readJsonSync } from 'fs-extra';

import { addMiddleware } from './middleware';
import { addProperties, addChildren } from './widget-factory';
import { findLine } from './util';

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
		vscode.commands.registerCommand('dojo.runTests', () => {
			const editor = vscode.window.activeTextEditor;
			if (editor) {
				const packageJson = readJsonSync(join(vscode.workspace.rootPath || '', 'package.json'));
				let runner = 'intern';
				if (packageJson.devDependencies.hasOwnProperty('jest')) {
					runner = 'jest';
				}

				let terminal: vscode.Terminal | undefined;
				if (vscode.window.activeTerminal) {
					terminal = vscode.window.activeTerminal;
				}
				else {
					terminal = vscode.window.createTerminal();
				}
				terminal.show();
				let fileName = editor.document.fileName
					.replace(vscode.workspace.rootPath + sep || '', '')
					.replace(/\\/g, '/');

				let regex = /(?:it|describe)[ ]*\(['"]([\s\S]+)['"]/g;
				if (runner === 'intern' && findLine(editor.document, /intern\.getInterface\('object'\)/g)) {
					regex = /^[ \t]*(?:['"]{1}([\s\S]+)['"]{1}|([a-zA-Z0-9_]+))(?:\:|\(\))[ ]*{/g;
				}

				const testLine = findLine(editor.document, regex, {
					reverse: true,
					startAt: editor.selection.anchor.line
				});
				let test: string | undefined;
				if (testLine) {
					regex.lastIndex = 0;
					const match = regex.exec(testLine.text);
					if (match && match.length > 1) {
						test = match[1];
					}
				}

				if (runner === 'intern') {
					fileName = `dist/dev/${fileName}`.replace(/\.tsx?/g, '.js')
					if (test) {
						terminal.sendText(`npx intern suites=${fileName} grep='${test}'`);
					} else {
						terminal.sendText(`npx intern suites=${fileName}`);
					}
				}
				else {
					if (test) {
						terminal.sendText(`npx jest ${fileName} -t '${test}'`);
					} else {
						terminal.sendText(`npx jest ${fileName}`);
					}
				}
			}
		})
	);
}
