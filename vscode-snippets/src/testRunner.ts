import * as vscode from 'vscode';
import { sep, join } from 'path';
import { readFileSync } from 'fs';

import { findLine } from './util';

const registerSuiteRegex = /registerSuite\('([\w\W]*)',[\s]*{/g;
const internObjectInterfaceRegex = /intern\.getInterface\('object'\)/g;
const internObjectTestRegex = /^[ \t]*(?:['"]{1}([\s\S]+)['"]{1}|([a-zA-Z0-9_]+))(?:\:|\(\))[ ]*{/g;

export function runTests(all = false) {
	const editor = vscode.window.activeTextEditor;
	if (editor) {
		editor.document.save();
		const packageJson = JSON.parse(
			readFileSync(join(vscode.workspace.rootPath || '', 'package.json'), 'utf8')
		);
		let runner: 'intern' | 'jest' | 'dojo' = 'intern';
		let useNpmTest = false;
		if (packageJson.scripts && packageJson.scripts.hasOwnProperty('test')) {
			useNpmTest = true;
			if (packageJson.scripts.test.includes('jest')) {
				runner = 'jest';
			} else if (packageJson.scripts.test.includes('dojo')) {
				runner = 'dojo';
			}
		} else if (
			packageJson.devDependencies &&
			packageJson.devDependencies.hasOwnProperty('jest')
		) {
			runner = 'jest';
		}

		let terminal: vscode.Terminal | undefined;
		if (vscode.window.activeTerminal) {
			terminal = vscode.window.activeTerminal;
		} else {
			terminal = vscode.window.createTerminal();
		}
		terminal.show();
		let fileName = editor.document.fileName
			.replace(vscode.workspace.rootPath + sep || '', '')
			.replace(/\\/g, '/');

		let regex = /(it|describe|test)[ ]*\(['"]([\s\S]+)['"]/g;
		if (runner === 'intern' && findLine(editor.document, internObjectInterfaceRegex)) {
			regex = internObjectTestRegex;
		} else if (runner === 'dojo') {
			if (findLine(editor.document, internObjectInterfaceRegex)) {
				regex = internObjectTestRegex;

				const suiteLine = findLine(editor.document, registerSuiteRegex);
				if (suiteLine) {
					registerSuiteRegex.lastIndex = 0;
					const match = registerSuiteRegex.exec(suiteLine.text);
					if (match && match.length > 1) {
						fileName = `${match[1]} - `;
					} else {
						fileName = '';
					}
				} else {
					fileName = '';
				}
			} else {
				const suiteLine = findLine(editor.document, regex);
				if (suiteLine) {
					regex.lastIndex = 0;
					const match = regex.exec(suiteLine.text);
					if (match && match.length > 2) {
						fileName = `${match[2]}.*`;
					} else {
						fileName = '';
					}
				} else {
					fileName = '';
				}
			}
		}

		let test: string | undefined;
		if (!all) {
			const testLine = findLine(editor.document, regex, {
				reverse: true,
				startAt: editor.selection.anchor.line,
			});
			if (testLine) {
				regex.lastIndex = 0;
				const match = regex.exec(testLine.text);
				if (match && match.length > 2 && match[2]) {
					test = match[2];

					if ((runner === 'dojo' || runner === 'intern') && match[1] === 'describe') {
						if (`${test}.*` === fileName) {
							test = '';
						} else {
							test = `${test}.*`;
						}
					}
				} else if (match && match.length > 1) {
					test = match[1];
				}
			}
		}

		if (runner === 'intern') {
			fileName = `dist/dev/${fileName}`.replace(/\.tsx?/g, '.js');
			let commandPrefix = 'npx intern';
			if (useNpmTest) {
				commandPrefix = 'npm test --';
			}
			if (test) {
				terminal.sendText(`${commandPrefix} suites=${fileName} grep='${test}'`);
			} else {
				terminal.sendText(`${commandPrefix} suites=${fileName}`);
			}
		} else if (runner === 'dojo') {
			let commandPrefix = 'npx dojo test';
			if (useNpmTest) {
				commandPrefix = 'npm test --';
			}
			if (test) {
				terminal.sendText(`${commandPrefix} --filter '${fileName}${test}'`);
			} else {
				terminal.sendText(
					`${commandPrefix} --filter '${fileName.length > 0 ? fileName : test}'`
				);
			}
		} else {
			let commandPrefix = 'npx jest';
			if (useNpmTest) {
				commandPrefix = 'npm test --';
			}
			if (test) {
				terminal.sendText(`${commandPrefix} ${fileName} -t '${test}'`);
			} else {
				terminal.sendText(`${commandPrefix}${all ? ' --coverage' : ''} ${fileName}`);
			}
		}
	}
}
