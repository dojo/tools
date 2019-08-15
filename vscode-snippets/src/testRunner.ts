import * as vscode from 'vscode';
import { sep, join } from 'path';
import { readFileSync } from 'fs';

import { findLine } from './util';

export function runTests(all = false) {
	const editor = vscode.window.activeTextEditor;
	if (editor) {
		const packageJson = JSON.parse(readFileSync(join(vscode.workspace.rootPath || '', 'package.json'), 'utf8'));
		let runner = 'intern';
		let useNpmTest = false;
		if (packageJson.scripts && packageJson.scripts.hasOwnProperty('test')) {
			useNpmTest = true;
			if (packageJson.scripts.test.includes('jest')) {
				runner = 'jest';
			}
		}
		else if (packageJson.devDependencies && packageJson.devDependencies.hasOwnProperty('jest')) {
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

		let test: string | undefined;
		if (!all) {
			const testLine = findLine(editor.document, regex, {
				reverse: true,
				startAt: editor.selection.anchor.line
			});
			if (testLine) {
				regex.lastIndex = 0;
				const match = regex.exec(testLine.text);
				if (match && match.length > 1) {
					test = match[1];
				}
			}
		}

		if (runner === 'intern') {
			fileName = `dist/dev/${fileName}`.replace(/\.tsx?/g, '.js')
			let commandPrefix = 'npx intern';
			if (useNpmTest) {
				commandPrefix = 'npm run test --';
			}
			if (test) {
				terminal.sendText(`${commandPrefix} suites=${fileName} grep='${test}'`);
			} else {
				terminal.sendText(`${commandPrefix} suites=${fileName}`);
			}
		}
		else {
			let commandPrefix = 'npx jest';
			if (useNpmTest) {
				commandPrefix = 'npm run test --';
			}
			if (test) {
				terminal.sendText(`${commandPrefix} ${fileName} -t '${test}'`);
			} else {
				terminal.sendText(`${commandPrefix}${all ? ' --coverage' : ''} ${fileName}`);
			}
		}
	}
}
