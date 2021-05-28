import * as vscode from 'vscode';

import { createDocument } from './document';

import { addChildren, addProperties } from '../widget-factory';

describe('widget factory', () => {
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

	const edit = {
		replace: jest.fn(),
		insert: jest.fn(),
		delete: jest.fn(),
		setEndOfLine: jest.fn(),
	} as vscode.TextEditorEdit;

	beforeEach(() => {
		jest.resetAllMocks();
	});

	const documentEmpty = createDocument([
		"import { tsx } from '@dojo/framework/core/vdom';",
		'',
		"import * as css from './TestWidget.m.css';",
		'',
		'const factory = create();',
		'',
		'export default factory(function TestWidget() {',
		'\tconst themedCss = theme.classes(css);',
		'\treturn (',
		'\t\t<div classes={themedCss.root}>{}</div>',
		'\t);',
		');',
		'',
	]);

	const documentSingleLine = createDocument([
		"import { tsx } from '@dojo/framework/core/vdom';",
		"import theme from '@dojo/framework/core/middleware/theme';",
		'',
		"import * as css from './TestWidget.m.css';",
		'',
		'const factory = create({ theme });',
		'',
		'export default factory(function TestWidget({ middleware: { theme } }) {',
		'\tconst themedCss = theme.classes(css);',
		'\treturn (',
		'\t\t<div classes={themedCss.root}>{}</div>',
		'\t);',
		');',
		'',
	]);

	const documentMultiLine = createDocument([
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
		'\t}',
		'}) {',
		'\tconst themedCss = theme.classes(css);',
		'\treturn (',
		'\t\t<div classes={themedCss.root}>{}</div>',
		'\t);',
		');',
		'',
	]);

	const documentMultiLineCreateMultiLine = createDocument([
		"import { tsx } from '@dojo/framework/core/vdom';",
		"import theme from '@dojo/framework/core/middleware/theme';",
		'',
		"import * as css from './TestWidget.m.css';",
		'',
		'const factory = create({',
		'\ttheme',
		'});',
		'',
		'export default factory(function TestWidget({',
		'\tmiddleware: {',
		'\t\ttheme',
		'\t}',
		'}) {',
		'\tconst themedCss = theme.classes(css);',
		'\treturn (',
		'\t\t<div classes={themedCss.root}>{}</div>',
		'\t);',
		');',
		'',
	]);

	const badDocument = createDocument([
		'export function TestWidget() {',
		'\tconst themedCss = theme.classes(css);',
		'\treturn (',
		'\t\t<div classes={themedCss.root}>{}</div>',
		'\t);',
		');',
		'',
	]);

	const badFormattingDocument = createDocument([
		'const factory = create({',
		'\ttheme',
		'',
		'export default factory(function TestWidget({',
		'\t\ttheme',
		'\t}',
		'\tconst themedCss = theme.classes(css);',
		'\treturn (',
		'\t\t<div classes={themedCss.root}>{}</div>',
		'\t);',
		');',
		'',
	]);

	describe('addProperties', () => {
		it('adds properties to empty widget factory', () => {
			(editor as any).document = documentEmpty;

			addProperties(editor, edit);

			expect(edit.replace).toHaveBeenNthCalledWith(
				1,
				documentEmpty.lineAt(4).range,
				'const factory = create().properties<TestWidgetProperties>();'
			);
			expect(edit.replace).toHaveBeenNthCalledWith(
				2,
				documentEmpty.lineAt(6).range,
				'export default factory(function TestWidget({ properties }) {'
			);
			expect(edit.replace).toHaveBeenCalledTimes(2);
			expect(edit.insert).toHaveBeenNthCalledWith(
				1,
				documentEmpty.lineAt(2).rangeIncludingLineBreak.end,
				`\r\ninterface TestWidgetProperties {\r\n\r\n}\r\n`
			);
			expect(edit.insert).toHaveBeenNthCalledWith(
				2,
				documentEmpty.lineAt(6).rangeIncludingLineBreak.end,
				'\tconst {  } = properties();\r\n'
			);
			expect(edit.insert).toHaveBeenCalledTimes(2);
		});

		it('adds properties to single line widget factory', () => {
			(editor as any).document = documentSingleLine;

			addProperties(editor, edit);

			expect(edit.replace).toHaveBeenNthCalledWith(
				1,
				documentSingleLine.lineAt(5).range,
				'const factory = create({ theme }).properties<TestWidgetProperties>();'
			);
			expect(edit.replace).toHaveBeenNthCalledWith(
				2,
				documentSingleLine.lineAt(7).range,
				'export default factory(function TestWidget({ middleware: { theme }, properties }) {'
			);
			expect(edit.replace).toHaveBeenCalledTimes(2);
			expect(edit.insert).toHaveBeenNthCalledWith(
				1,
				documentSingleLine.lineAt(3).rangeIncludingLineBreak.end,
				`\r\ninterface TestWidgetProperties {\r\n\r\n}\r\n`
			);
			expect(edit.insert).toHaveBeenNthCalledWith(
				2,
				documentSingleLine.lineAt(7).rangeIncludingLineBreak.end,
				'\tconst {  } = properties();\r\n'
			);
			expect(edit.insert).toHaveBeenCalledTimes(2);
		});

		it('adds properties to multi line widget factory', () => {
			(editor as any).document = documentMultiLine;

			addProperties(editor, edit);

			expect(edit.replace).toHaveBeenNthCalledWith(
				1,
				documentMultiLine.lineAt(5).range,
				'const factory = create({ theme }).properties<TestWidgetProperties>();'
			);
			expect(edit.replace).toHaveBeenCalledTimes(1);

			expect(edit.insert).toHaveBeenNthCalledWith(
				1,
				documentMultiLine.lineAt(3).rangeIncludingLineBreak.end,
				`\r\ninterface TestWidgetProperties {\r\n\r\n}\r\n`
			);
			expect(edit.insert).toHaveBeenNthCalledWith(
				2,
				documentMultiLine.lineAt(10).range.end,
				','
			);
			expect(edit.insert).toHaveBeenNthCalledWith(
				3,
				documentMultiLine.lineAt(11).rangeIncludingLineBreak.start,
				`\tproperties\r\n`
			);
			expect(edit.insert).toHaveBeenNthCalledWith(
				4,
				documentMultiLine.lineAt(11).rangeIncludingLineBreak.end,
				'\tconst {  } = properties();\r\n'
			);
			expect(edit.insert).toHaveBeenCalledTimes(4);
		});

		it('adds properties to multi line widget factory and multi line create', () => {
			(editor as any).document = documentMultiLineCreateMultiLine;

			addProperties(editor, edit);

			expect(edit.replace).toHaveBeenNthCalledWith(
				1,
				documentMultiLineCreateMultiLine.lineAt(7).range,
				'}).properties<TestWidgetProperties>();'
			);
			expect(edit.replace).toHaveBeenCalledTimes(1);

			expect(edit.insert).toHaveBeenNthCalledWith(
				1,
				documentMultiLineCreateMultiLine.lineAt(3).rangeIncludingLineBreak.end,
				`\r\ninterface TestWidgetProperties {\r\n\r\n}\r\n`
			);
			expect(edit.insert).toHaveBeenNthCalledWith(
				2,
				documentMultiLineCreateMultiLine.lineAt(12).range.end,
				','
			);
			expect(edit.insert).toHaveBeenNthCalledWith(
				3,
				documentMultiLineCreateMultiLine.lineAt(13).rangeIncludingLineBreak.start,
				`\tproperties\r\n`
			);
			expect(edit.insert).toHaveBeenNthCalledWith(
				4,
				documentMultiLineCreateMultiLine.lineAt(13).rangeIncludingLineBreak.end,
				'\tconst {  } = properties();\r\n'
			);
			expect(edit.insert).toHaveBeenCalledTimes(4);
		});

		it('does not add anything if import/create/factory lines not found', () => {
			(editor as any).document = badDocument;

			addProperties(editor, edit);

			expect(edit.replace).toHaveBeenCalledTimes(0);
			expect(edit.insert).toHaveBeenCalledTimes(0);
		});

		it('does not add anything if import/create/factory are multiline but missing end lines', () => {
			(editor as any).document = badFormattingDocument;

			addProperties(editor, edit);

			expect(edit.replace).toHaveBeenCalledTimes(0);
			expect(edit.insert).toHaveBeenCalledTimes(0);
		});
	});

	describe('addChildren', () => {
		it('adds children to empty widget factory', () => {
			(editor as any).document = documentEmpty;

			addChildren(editor, edit);

			expect(edit.replace).toHaveBeenNthCalledWith(
				1,
				documentEmpty.lineAt(6).range,
				'export default factory(function TestWidget({ children }) {'
			);
			expect(edit.replace).toHaveBeenCalledTimes(1);
			expect(edit.insert).toHaveBeenNthCalledWith(1, editor.selection.anchor, 'children()');
			expect(edit.insert).toHaveBeenCalledTimes(1);
		});

		it('adds children to single line widget factory', () => {
			(editor as any).document = documentSingleLine;

			addChildren(editor, edit);
			expect(edit.replace).toHaveBeenNthCalledWith(
				1,
				documentSingleLine.lineAt(7).range,
				'export default factory(function TestWidget({ middleware: { theme }, children }) {'
			);
			expect(edit.replace).toHaveBeenCalledTimes(1);
			expect(edit.insert).toHaveBeenNthCalledWith(1, editor.selection.anchor, 'children()');
			expect(edit.insert).toHaveBeenCalledTimes(1);
		});

		it('adds children to multi line widget factory', () => {
			(editor as any).document = documentMultiLine;

			addChildren(editor, edit);

			expect(edit.insert).toHaveBeenNthCalledWith(
				1,
				documentMultiLine.lineAt(10).range.end,
				','
			);
			expect(edit.insert).toHaveBeenNthCalledWith(
				2,
				documentMultiLine.lineAt(11).rangeIncludingLineBreak.start,
				`\tchildren\r\n`
			);
			expect(edit.insert).toHaveBeenNthCalledWith(3, editor.selection.anchor, 'children()');
			expect(edit.insert).toHaveBeenCalledTimes(3);
		});

		it('does not add anything if import/create/factory lines not found', () => {
			(editor as any).document = badDocument;

			addChildren(editor, edit);

			expect(edit.replace).toHaveBeenCalledTimes(0);
			expect(edit.insert).toHaveBeenCalledTimes(0);
		});
	});
});
