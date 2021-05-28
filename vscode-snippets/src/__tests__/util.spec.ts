import * as vscode from 'vscode';

import { regexFactory } from '../regex';

import { createDocument } from './document';

import { findLine, getTab } from '../util';

describe('util', () => {
	describe('findLine', () => {
		let regex: ReturnType<typeof regexFactory>;
		const document = createDocument([
			"import { tsx } from '@dojo/framework/core/vdom';",
			"import theme from '@dojo/framework/core/middleware/theme';",
			'',
			"import * as css from './TestWidget.m.css';",
			'',
			'const factory = create({ theme });',
			'',
			'export default factory(function TestWidget({',
			'\tmiddleware: {',
			'\t\ttheme',
			'\t},',
			'\tchildren',
			'}) {',
			'\tconst themedCss = theme.classes(css);',
			'\treturn (',
			'\t\t<div classes={themedCss.root}>{children()}</div>',
			'\t);',
			');',
			'',
		]);

		beforeEach(() => {
			regex = regexFactory();
		});

		it('finds line', () => {
			const result = findLine(document, regex.vdomImport);
			expect(result).toEqual(document.lineAt(0));
		});

		it('finds line in reverse', () => {
			const result = findLine(document, regex.importLine, { reverse: true });
			expect(result).toEqual(document.lineAt(3));
		});

		it('does not find line', () => {
			const result = findLine(document, /NOT ON ANY LINE/g);
			expect(result).toBeUndefined();
		});

		it('finds line with end test', () => {
			const result = findLine(document, regex.widgetFactoryMiddlewareAlone, {
				endTest: regex.widgetFactoryEnd,
			});
			expect(result).toEqual(document.lineAt(8));
		});

		it('does not find line with end test', () => {
			const result = findLine(document, /NOT ON ANY LINE/g, {
				endTest: regex.widgetFactoryEnd,
			});
			expect(result).toEqual(document.lineAt(12));
		});
	});

	describe('getTab', () => {
		test('tab indentation', () => {
			expect(getTab({ insertSpaces: false, tabSize: 2 } as vscode.TextEditorOptions)).toBe(
				'\t'
			);
			expect(getTab({ insertSpaces: false, tabSize: 4 } as vscode.TextEditorOptions)).toBe(
				'\t'
			);
		});

		test('space indentation', () => {
			expect(getTab({ insertSpaces: true, tabSize: 2 } as vscode.TextEditorOptions)).toBe(
				'  '
			);
			expect(getTab({ insertSpaces: true, tabSize: 4 } as vscode.TextEditorOptions)).toBe(
				'    '
			);
		});
	});
});
