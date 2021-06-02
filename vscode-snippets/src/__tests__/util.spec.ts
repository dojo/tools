import * as vscode from 'vscode';

import { regexFactory } from '../regex';

import { createDocument } from './document';

import {
	findEndOfCreateLine,
	findLastMiddlewareInCreateLine,
	findLastMiddlewareInWidgetFactoryLine,
	findLine,
	getTab,
} from '../util';
import {
	documentEmpty,
	documentSingleLine,
	documentMultiLineCreateMultiLine,
	badDocument,
	badFormattingDocument,
	documentMultiLineCreateTrailingComma,
	documentMultiLineCreateCompoundMiddlewareLine,
	missingDocument,
	documentMultiLineCreateMultiLineEmpty,
} from './fixtures/test-documents';

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

	describe('findEndOfCreateLine', () => {
		const editor = {
			options: {
				insertSpaces: false,
				tabSize: 2,
			},
			selection: {
				anchor: {
					line: 14,
					character: 32,
				},
			},
		} as vscode.TextEditor;

		it('finds end of create in empty create line', () => {
			(editor as any).document = documentEmpty;

			expect(findEndOfCreateLine(editor)).toEqual({
				firstNonWhitespaceCharacterIndex: 0,
				isEmptyOrWhitespace: true,
				lineNumber: 4,
				range: {
					end: {
						character: 25,
						line: 4,
					},
					isEmpty: true,
					isSingleLine: true,
					start: {
						character: 0,
						line: 4,
					},
				},
				rangeIncludingLineBreak: {
					end: {
						character: 26,
						line: 4,
					},
					isEmpty: true,
					isSingleLine: true,
					start: {
						character: 0,
						line: 4,
					},
				},
				text: 'const factory = create();',
			});
		});

		it('finds end of create in single line create line', () => {
			(editor as any).document = documentSingleLine;

			expect(findEndOfCreateLine(editor)).toEqual({
				firstNonWhitespaceCharacterIndex: 0,
				isEmptyOrWhitespace: true,
				lineNumber: 5,
				range: {
					end: {
						character: 34,
						line: 5,
					},
					isEmpty: true,
					isSingleLine: true,
					start: {
						character: 0,
						line: 5,
					},
				},
				rangeIncludingLineBreak: {
					end: {
						character: 35,
						line: 5,
					},
					isEmpty: true,
					isSingleLine: true,
					start: {
						character: 0,
						line: 5,
					},
				},
				text: 'const factory = create({ theme });',
			});
		});

		it('finds end of create in multi line create line', () => {
			(editor as any).document = documentMultiLineCreateMultiLine;

			expect(findEndOfCreateLine(editor)).toEqual({
				firstNonWhitespaceCharacterIndex: 0,
				isEmptyOrWhitespace: true,
				lineNumber: 7,
				range: {
					end: {
						character: 3,
						line: 7,
					},
					isEmpty: true,
					isSingleLine: true,
					start: {
						character: 0,
						line: 7,
					},
				},
				rangeIncludingLineBreak: {
					end: {
						character: 4,
						line: 7,
					},
					isEmpty: true,
					isSingleLine: true,
					start: {
						character: 0,
						line: 7,
					},
				},
				text: '});',
			});
		});

		it('does not find end of create when create lines not found', () => {
			(editor as any).document = badDocument;

			expect(findEndOfCreateLine(editor)).toBeUndefined();
		});

		it('does not find end of create when missing end of create line', () => {
			(editor as any).document = badFormattingDocument;

			expect(findEndOfCreateLine(editor)).toBeUndefined();
		});
	});

	describe('findLastMiddlewareInCreateLine', () => {
		const editor = {
			options: {
				insertSpaces: false,
				tabSize: 2,
			},
			selection: {
				anchor: {
					line: 14,
					character: 32,
				},
			},
		} as vscode.TextEditor;

		it('does not find last middleware line in empty create line', () => {
			(editor as any).document = documentEmpty;

			expect(findLastMiddlewareInCreateLine(editor)).toBeUndefined();
		});

		it('does not find last middleware line in single line create line', () => {
			(editor as any).document = documentSingleLine;

			expect(findLastMiddlewareInCreateLine(editor)).toBeUndefined();
		});

		it('finds last middleware line in multi line create line', () => {
			(editor as any).document = documentMultiLineCreateMultiLine;

			expect(findLastMiddlewareInCreateLine(editor)).toEqual({
				firstNonWhitespaceCharacterIndex: 1,
				isEmptyOrWhitespace: true,
				lineNumber: 6,
				range: {
					end: {
						character: 6,
						line: 6,
					},
					isEmpty: true,
					isSingleLine: true,
					start: {
						character: 0,
						line: 6,
					},
				},
				rangeIncludingLineBreak: {
					end: {
						character: 7,
						line: 6,
					},
					isEmpty: true,
					isSingleLine: true,
					start: {
						character: 0,
						line: 6,
					},
				},
				text: '	theme',
			});
		});

		it('finds last middleware line in multi line create line and trailing comma', () => {
			(editor as any).document = documentMultiLineCreateTrailingComma;

			expect(findLastMiddlewareInCreateLine(editor)).toEqual({
				firstNonWhitespaceCharacterIndex: 1,
				isEmptyOrWhitespace: true,
				lineNumber: 6,
				range: {
					end: {
						character: 7,
						line: 6,
					},
					isEmpty: true,
					isSingleLine: true,
					start: {
						character: 0,
						line: 6,
					},
				},
				rangeIncludingLineBreak: {
					end: {
						character: 8,
						line: 6,
					},
					isEmpty: true,
					isSingleLine: true,
					start: {
						character: 0,
						line: 6,
					},
				},
				text: '	theme,',
			});
		});

		it('finds last middleware line in multi line create line and compound last middleware line', () => {
			(editor as any).document = documentMultiLineCreateCompoundMiddlewareLine;

			expect(findLastMiddlewareInCreateLine(editor)).toEqual({
				firstNonWhitespaceCharacterIndex: 1,
				isEmptyOrWhitespace: true,
				lineNumber: 7,
				range: {
					end: {
						character: 19,
						line: 7,
					},
					isEmpty: true,
					isSingleLine: true,
					start: {
						character: 0,
						line: 7,
					},
				},
				rangeIncludingLineBreak: {
					end: {
						character: 20,
						line: 7,
					},
					isEmpty: true,
					isSingleLine: true,
					start: {
						character: 0,
						line: 7,
					},
				},
				text: '	something2, theme,',
			});
		});

		it('does not find last middleware when create lines not found', () => {
			(editor as any).document = badDocument;

			expect(findLastMiddlewareInCreateLine(editor)).toBeUndefined();
		});

		it('does not find last middleware when missing end of create line', () => {
			(editor as any).document = badFormattingDocument;

			expect(findLastMiddlewareInCreateLine(editor)).toBeUndefined();
		});

		it('does not find last middleware when create line is missing', () => {
			(editor as any).document = missingDocument;

			expect(findLastMiddlewareInCreateLine(editor)).toBeUndefined();
		});

		it('does not find last middleware when create line is multiline and empty', () => {
			(editor as any).document = documentMultiLineCreateMultiLineEmpty;

			expect(findLastMiddlewareInCreateLine(editor)).toBeUndefined();
		});
	});

	describe('findLastMiddlewareInWidgetFactoryLine', () => {
		const editor = {
			options: {
				insertSpaces: false,
				tabSize: 2,
			},
			selection: {
				anchor: {
					line: 14,
					character: 32,
				},
			},
		} as vscode.TextEditor;

		it('does not find last middleware line in empty widget factory line', () => {
			(editor as any).document = documentEmpty;

			expect(findLastMiddlewareInWidgetFactoryLine(editor)).toBeUndefined();
		});

		it('does not find last middleware line in single line widget factory line', () => {
			(editor as any).document = documentSingleLine;

			expect(findLastMiddlewareInWidgetFactoryLine(editor)).toBeUndefined();
		});

		it('finds last middleware line in multi line widget factory line', () => {
			(editor as any).document = documentMultiLineCreateMultiLine;

			expect(findLastMiddlewareInWidgetFactoryLine(editor)).toEqual({
				firstNonWhitespaceCharacterIndex: 2,
				isEmptyOrWhitespace: true,
				lineNumber: 11,
				range: {
					end: {
						character: 7,
						line: 11,
					},
					isEmpty: true,
					isSingleLine: true,
					start: {
						character: 0,
						line: 11,
					},
				},
				rangeIncludingLineBreak: {
					end: {
						character: 8,
						line: 11,
					},
					isEmpty: true,
					isSingleLine: true,
					start: {
						character: 0,
						line: 11,
					},
				},
				text: '		theme',
			});
		});

		it('finds last middleware line in multi line widget factory line and trailing comma', () => {
			(editor as any).document = documentMultiLineCreateTrailingComma;

			expect(findLastMiddlewareInWidgetFactoryLine(editor)).toEqual({
				firstNonWhitespaceCharacterIndex: 2,
				isEmptyOrWhitespace: true,
				lineNumber: 11,
				range: {
					end: {
						character: 8,
						line: 11,
					},
					isEmpty: true,
					isSingleLine: true,
					start: {
						character: 0,
						line: 11,
					},
				},
				rangeIncludingLineBreak: {
					end: {
						character: 9,
						line: 11,
					},
					isEmpty: true,
					isSingleLine: true,
					start: {
						character: 0,
						line: 11,
					},
				},
				text: '		theme,',
			});
		});

		it('finds last middleware line in multi line widget factory line and compound last middleware line', () => {
			(editor as any).document = documentMultiLineCreateCompoundMiddlewareLine;

			expect(findLastMiddlewareInWidgetFactoryLine(editor)).toEqual({
				firstNonWhitespaceCharacterIndex: 2,
				isEmptyOrWhitespace: true,
				lineNumber: 13,
				range: {
					end: {
						character: 20,
						line: 13,
					},
					isEmpty: true,
					isSingleLine: true,
					start: {
						character: 0,
						line: 13,
					},
				},
				rangeIncludingLineBreak: {
					end: {
						character: 21,
						line: 13,
					},
					isEmpty: true,
					isSingleLine: true,
					start: {
						character: 0,
						line: 13,
					},
				},
				text: '		something2, theme,',
			});
		});

		it('does not find last middleware when widget factory lines not found', () => {
			(editor as any).document = badDocument;

			expect(findLastMiddlewareInWidgetFactoryLine(editor)).toBeUndefined();
		});

		it('does not find last middleware when missing end of widget factory line', () => {
			(editor as any).document = badFormattingDocument;

			expect(findLastMiddlewareInWidgetFactoryLine(editor)).toBeUndefined();
		});

		it('does not find last middleware when widget factory line is missing', () => {
			(editor as any).document = missingDocument;

			expect(findLastMiddlewareInWidgetFactoryLine(editor)).toBeUndefined();
		});

		it('does not find last middleware when widget factory line is multiline and empty', () => {
			(editor as any).document = documentMultiLineCreateMultiLineEmpty;

			expect(findLastMiddlewareInWidgetFactoryLine(editor)).toBeUndefined();
		});
	});
});
