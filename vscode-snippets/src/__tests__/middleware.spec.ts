import * as vscode from 'vscode';
import { sep } from 'path';
import { existsSync, writeFileSync } from 'fs';

import { createDocument } from './document';

import { addMiddleware } from '../middleware';

jest.mock('fs');

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
		"import { create, tsx } from '@dojo/framework/core/vdom';",
		'',
		'const factory = create();',
		'',
		'export default factory(function TestWidget() {',
		'\treturn (',
		'\t\t<div>Content</div>',
		'\t);',
		');',
		'',
	]);

	const documentNoImports = createDocument([
		'const factory = create();',
		'',
		'export default factory(function TestWidget() {',
		'\treturn (',
		'\t\t<div>Content</div>',
		'\t);',
		');',
		'',
	]);

	const documentNoMiddleware = createDocument([
		"import { create, tsx } from '@dojo/framework/core/vdom';",
		'',
		'const factory = create();',
		'',
		'export default factory(function TestWidget({ children }) {',
		'\treturn (',
		'\t\t<div>{children()}</div>',
		'\t);',
		');',
		'',
	]);

	const documentPropertiesNoMiddleware = createDocument([
		"import { create, tsx } from '@dojo/framework/core/vdom';",
		'',
		'interface TestWidgetProperties {',
		'\tshow: boolean;',
		'}',
		'',
		'const factory = create().properties<TestWidgetProperties>();',
		'',
		'export default factory(function TestWidget({ properties }) {',
		'\tconst { show } = properties();',
		'\treturn (',
		'\t\tshow && <div>Content</div>',
		'\t);',
		');',
		'',
	]);

	const documentSingleLine = createDocument([
		"import { create, tsx } from '@dojo/framework/core/vdom';",
		"import focus from '@dojo/framework/core/middleware/focus';",
		'',
		'const factory = create({ focus });',
		'',
		'export default factory(function TestWidget({ middleware: { focus }, properties }) {',
		'\treturn (',
		'\t\t<div>Content</div>',
		'\t);',
		');',
		'',
	]);

	const documentSingleLineRenamed = createDocument([
		"import { create, tsx } from '@dojo/framework/core/vdom';",
		"import focus from '@dojo/framework/core/middleware/focus';",
		'',
		'const factory = create({ focus });',
		'',
		'export default factory(function TestWidget({ middleware: { focus: focusMiddleware }, properties }) {',
		'\treturn (',
		'\t\t<div>Content</div>',
		'\t);',
		');',
		'',
	]);

	const documentMultiLine = createDocument([
		"import { create, tsx } from '@dojo/framework/core/vdom';",
		"import focus from '@dojo/framework/core/middleware/focus';",
		'',
		'const factory = create({ focus });',
		'',
		'export default factory(function TestWidget({',
		'\tmiddleware: {',
		'\t\tfocus',
		'\t},',
		'\tproperties',
		'}) {',
		'\treturn (',
		'\t\t<div>Content</div>',
		'\t);',
		');',
		'',
	]);

	const documentMultiLineSingleLineMiddleware = createDocument([
		"import { create, tsx } from '@dojo/framework/core/vdom';",
		"import focus from '@dojo/framework/core/middleware/focus';",
		'',
		'const factory = create({ focus });',
		'',
		'export default factory(function TestWidget({',
		'\tmiddleware: { focus },',
		'\tproperties',
		'}) {',
		'\treturn (',
		'\t\t<div>Content</div>',
		'\t);',
		');',
		'',
	]);

	const documentMultiLineCreateMultiLine = createDocument([
		"import { create, tsx } from '@dojo/framework/core/vdom';",
		"import focus from '@dojo/framework/core/middleware/focus';",
		'',
		"import * as css from './TestWidget.m.css';",
		'',
		'const factory = create({',
		'\tfocus',
		'});',
		'',
		'export default factory(function TestWidget({',
		'\tmiddleware: {',
		'\t\tfocus',
		'\t},',
		'\tproperties',
		'}) {',
		'\treturn (',
		'\t\t<div>Content</div>',
		'\t);',
		');',
		'',
	]);

	const documentMultiLineCreateMultiLineNoTabs = createDocument([
		"import { create, tsx } from '@dojo/framework/core/vdom';",
		"import focus from '@dojo/framework/core/middleware/focus';",
		'',
		"import * as css from './TestWidget.m.css';",
		'',
		'const factory = create({',
		'focus',
		'});',
		'',
		'export default factory(function TestWidget({',
		'middleware: {',
		'focus',
		'},',
		'properties',
		'}) {',
		'return (',
		'<div>Content</div>',
		');',
		');',
		'',
	]);

	const badDocument = createDocument([
		'export function TestWidget() {',
		'\treturn (',
		'\t\t<div>Content</div>',
		'\t);',
		');',
		'',
	]);

	const badFormattingDocument = createDocument([
		'const factory = no({',
		'\tfocus',
		'',
		'export default factory(function TestWidget({',
		'\t\tfocus',
		'\t},',
		'\tproperties',
		'\treturn (',
		'\t\t<div>Content</div>',
		'\t);',
		');',
		'',
	]);

	const documentEmptyMultiline = createDocument([
		"import { create, tsx } from '@dojo/framework/core/vdom';",
		'',
		'const factory = create({',
		'});',
		'',
		'export default factory(function TestWidget({ middleware: {',
		'} }) {',
		'\treturn (',
		'\t\t<div>Content</div>',
		'\t);',
		');',
		'',
	]);

	describe('addMiddleware', () => {
		it('adds middleware to empty widget factory', () => {
			(editor as any).document = documentEmpty;

			addMiddleware('dimensions')(editor, edit);

			expect(edit.replace).toHaveBeenNthCalledWith(
				1,
				documentEmpty.lineAt(2).range,
				'const factory = create({ dimensions });'
			);
			expect(edit.replace).toHaveBeenNthCalledWith(
				2,
				documentEmpty.lineAt(4).range,
				'export default factory(function TestWidget({ middleware: { dimensions } }) {'
			);
			expect(edit.replace).toHaveBeenCalledTimes(2);
			expect(edit.insert).toHaveBeenNthCalledWith(
				1,
				documentEmpty.lineAt(0).rangeIncludingLineBreak.end,
				"import dimensions from '@dojo/framework/core/middleware/dimensions';\r\n"
			);
			expect(edit.insert).toHaveBeenCalledTimes(1);
		});

		it('adds middleware to empty widget factory with no imports', () => {
			(editor as any).document = documentNoImports;

			addMiddleware('dimensions')(editor, edit);

			expect(edit.replace).toHaveBeenNthCalledWith(
				1,
				documentNoImports.lineAt(0).range,
				'const factory = create({ dimensions });'
			);
			expect(edit.replace).toHaveBeenNthCalledWith(
				2,
				documentNoImports.lineAt(2).range,
				'export default factory(function TestWidget({ middleware: { dimensions } }) {'
			);
			expect(edit.replace).toHaveBeenCalledTimes(2);
			expect(edit.insert).toHaveBeenNthCalledWith(
				1,
				documentNoImports.lineAt(0).rangeIncludingLineBreak.end,
				"import dimensions from '@dojo/framework/core/middleware/dimensions';\r\n"
			);
			expect(edit.insert).toHaveBeenCalledTimes(1);
		});

		it('adds middleware to empty and multiline widget factory', () => {
			(editor as any).document = documentEmptyMultiline;

			addMiddleware('dimensions')(editor, edit);

			expect(edit.replace).toHaveBeenCalledTimes(0);
			expect(edit.insert).toHaveBeenNthCalledWith(
				1,
				documentEmptyMultiline.lineAt(0).rangeIncludingLineBreak.end,
				"import dimensions from '@dojo/framework/core/middleware/dimensions';\r\n"
			);
			expect(edit.insert).toHaveBeenNthCalledWith(
				2,
				documentEmptyMultiline.lineAt(2).rangeIncludingLineBreak.end,
				'\tdimensions\r\n'
			);
			expect(edit.insert).toHaveBeenNthCalledWith(
				3,
				documentEmptyMultiline.lineAt(5).rangeIncludingLineBreak.end,
				'\tdimensions\r\n'
			);
			expect(edit.insert).toHaveBeenCalledTimes(3);
		});

		it('adds middleware to non-empty widget factory with no middleware yet', () => {
			(editor as any).document = documentNoMiddleware;

			addMiddleware('dimensions')(editor, edit);

			expect(edit.replace).toHaveBeenNthCalledWith(
				1,
				documentNoMiddleware.lineAt(2).range,
				'const factory = create({ dimensions });'
			);
			expect(edit.replace).toHaveBeenNthCalledWith(
				2,
				documentNoMiddleware.lineAt(4).range,
				'export default factory(function TestWidget({ children, middleware: { dimensions } }) {'
			);
			expect(edit.replace).toHaveBeenCalledTimes(2);
			expect(edit.insert).toHaveBeenNthCalledWith(
				1,
				documentNoMiddleware.lineAt(0).rangeIncludingLineBreak.end,
				"import dimensions from '@dojo/framework/core/middleware/dimensions';\r\n"
			);
			expect(edit.insert).toHaveBeenCalledTimes(1);
		});

		it('adds middleware to non-empty widget factory with properties but no middleware yet', () => {
			(editor as any).document = documentPropertiesNoMiddleware;

			addMiddleware('dimensions')(editor, edit);

			expect(edit.replace).toHaveBeenNthCalledWith(
				1,
				documentPropertiesNoMiddleware.lineAt(6).range,
				'const factory = create({ dimensions }).properties<TestWidgetProperties>();'
			);
			expect(edit.replace).toHaveBeenNthCalledWith(
				2,
				documentPropertiesNoMiddleware.lineAt(8).range,
				'export default factory(function TestWidget({ properties, middleware: { dimensions } }) {'
			);
			expect(edit.replace).toHaveBeenCalledTimes(2);
			expect(edit.insert).toHaveBeenNthCalledWith(
				1,
				documentPropertiesNoMiddleware.lineAt(0).rangeIncludingLineBreak.end,
				"import dimensions from '@dojo/framework/core/middleware/dimensions';\r\n"
			);
			expect(edit.insert).toHaveBeenCalledTimes(1);
		});

		it('adds middleware to single line widget factory', () => {
			(editor as any).document = documentSingleLine;

			addMiddleware('dimensions')(editor, edit);

			expect(edit.replace).toHaveBeenNthCalledWith(
				1,
				documentSingleLine.lineAt(3).range,
				'const factory = create({ focus, dimensions });'
			);
			expect(edit.replace).toHaveBeenNthCalledWith(
				2,
				documentSingleLine.lineAt(5).range,
				'export default factory(function TestWidget({ middleware: { focus, dimensions }, properties }) {'
			);
			expect(edit.replace).toHaveBeenCalledTimes(2);
			expect(edit.insert).toHaveBeenNthCalledWith(
				1,
				documentSingleLine.lineAt(1).rangeIncludingLineBreak.end,
				"import dimensions from '@dojo/framework/core/middleware/dimensions';\r\n"
			);
			expect(edit.insert).toHaveBeenCalledTimes(1);
		});

		it('adds middleware to single line renamed widget factory', () => {
			(editor as any).document = documentSingleLineRenamed;

			addMiddleware('dimensions')(editor, edit);

			expect(edit.replace).toHaveBeenNthCalledWith(
				1,
				documentSingleLineRenamed.lineAt(3).range,
				'const factory = create({ focus, dimensions });'
			);
			expect(edit.replace).toHaveBeenNthCalledWith(
				2,
				documentSingleLineRenamed.lineAt(5).range,
				'export default factory(function TestWidget({ middleware: { focus: focusMiddleware, dimensions }, properties }) {'
			);
			expect(edit.replace).toHaveBeenCalledTimes(2);
			expect(edit.insert).toHaveBeenNthCalledWith(
				1,
				documentSingleLineRenamed.lineAt(1).rangeIncludingLineBreak.end,
				"import dimensions from '@dojo/framework/core/middleware/dimensions';\r\n"
			);
			expect(edit.insert).toHaveBeenCalledTimes(1);
		});

		it('adds middleware to multi line widget factory', () => {
			(editor as any).document = documentMultiLine;

			addMiddleware('dimensions')(editor, edit);

			expect(edit.replace).toHaveBeenNthCalledWith(
				1,
				documentMultiLine.lineAt(3).range,
				'const factory = create({ focus, dimensions });'
			);
			expect(edit.insert).toHaveBeenNthCalledWith(
				1,
				documentMultiLine.lineAt(1).rangeIncludingLineBreak.end,
				"import dimensions from '@dojo/framework/core/middleware/dimensions';\r\n"
			);
			expect(edit.replace).toHaveBeenNthCalledWith(
				2,
				documentMultiLine.lineAt(7).range,
				'\t\tfocus,'
			);
			expect(edit.insert).toHaveBeenNthCalledWith(
				2,
				documentMultiLine.lineAt(7).rangeIncludingLineBreak.end,
				'\t\tdimensions\r\n'
			);
			expect(edit.replace).toHaveBeenCalledTimes(2);
			expect(edit.insert).toHaveBeenCalledTimes(2);
		});

		it('adds middleware to multi line widget factory and multi line create', () => {
			(editor as any).document = documentMultiLineCreateMultiLine;

			addMiddleware('dimensions')(editor, edit);

			expect(edit.insert).toHaveBeenNthCalledWith(
				1,
				documentMultiLineCreateMultiLine.lineAt(1).rangeIncludingLineBreak.end,
				"import dimensions from '@dojo/framework/core/middleware/dimensions';\r\n"
			);
			expect(edit.replace).toHaveBeenNthCalledWith(
				1,
				documentMultiLineCreateMultiLine.lineAt(6).range,
				'	focus,'
			);
			expect(edit.insert).toHaveBeenNthCalledWith(
				2,
				documentMultiLineCreateMultiLine.lineAt(6).rangeIncludingLineBreak.end,
				'\tdimensions\r\n'
			);
			expect(edit.replace).toHaveBeenNthCalledWith(
				2,
				documentMultiLineCreateMultiLine.lineAt(11).range,
				'		focus,'
			);
			expect(edit.insert).toHaveBeenNthCalledWith(
				3,
				documentMultiLineCreateMultiLine.lineAt(11).rangeIncludingLineBreak.end,
				'\t\tdimensions\r\n'
			);
			expect(edit.replace).toHaveBeenCalledTimes(2);
			expect(edit.insert).toHaveBeenCalledTimes(3);
		});

		it('adds middleware to multi line widget factory and multi line create and bad tabbing', () => {
			(editor as any).document = documentMultiLineCreateMultiLineNoTabs;

			addMiddleware('dimensions')(editor, edit);

			expect(edit.insert).toHaveBeenNthCalledWith(
				1,
				documentMultiLineCreateMultiLineNoTabs.lineAt(1).rangeIncludingLineBreak.end,
				"import dimensions from '@dojo/framework/core/middleware/dimensions';\r\n"
			);
			expect(edit.replace).toHaveBeenNthCalledWith(
				1,
				documentMultiLineCreateMultiLineNoTabs.lineAt(6).range,
				'focus,'
			);
			expect(edit.insert).toHaveBeenNthCalledWith(
				2,
				documentMultiLineCreateMultiLineNoTabs.lineAt(6).rangeIncludingLineBreak.end,
				'\tdimensions\r\n'
			);
			expect(edit.replace).toHaveBeenNthCalledWith(
				2,
				documentMultiLineCreateMultiLineNoTabs.lineAt(11).range,
				'focus,'
			);
			expect(edit.insert).toHaveBeenNthCalledWith(
				3,
				documentMultiLineCreateMultiLineNoTabs.lineAt(11).rangeIncludingLineBreak.end,
				'\tdimensions\r\n'
			);
			expect(edit.replace).toHaveBeenCalledTimes(2);
			expect(edit.insert).toHaveBeenCalledTimes(3);
		});

		it('inserts only import if import/create/factory lines not found', () => {
			(editor as any).document = badDocument;

			addMiddleware('dimensions')(editor, edit);

			expect(edit.replace).not.toHaveBeenCalled();
			expect(edit.insert).toHaveBeenNthCalledWith(
				1,
				badDocument.lineAt(0).rangeIncludingLineBreak.end,
				"import dimensions from '@dojo/framework/core/middleware/dimensions';\r\n"
			);
			expect(edit.insert).toHaveBeenCalledTimes(1);
		});

		it('inserts only import if import/create/factory are multiline but missing end lines', () => {
			(editor as any).document = badFormattingDocument;

			addMiddleware('dimensions')(editor, edit);

			expect(edit.replace).not.toHaveBeenCalled();
			expect(edit.insert).toHaveBeenNthCalledWith(
				1,
				badFormattingDocument.lineAt(0).rangeIncludingLineBreak.end,
				"import dimensions from '@dojo/framework/core/middleware/dimensions';\r\n"
			);
			expect(edit.insert).toHaveBeenCalledTimes(1);
		});

		describe('theme', () => {
			it('creates and imports css module and definition files', () => {
				(editor as any).document = documentEmpty;

				addMiddleware('theme')(editor, edit);

				expect(edit.replace).toHaveBeenNthCalledWith(
					1,
					documentEmpty.lineAt(2).range,
					'const factory = create({ theme });'
				);
				expect(edit.replace).toHaveBeenNthCalledWith(
					2,
					documentEmpty.lineAt(4).range,
					'export default factory(function TestWidget({ middleware: { theme } }) {'
				);
				expect(edit.replace).toHaveBeenCalledTimes(2);
				expect(edit.insert).toHaveBeenNthCalledWith(
					1,
					documentEmpty.lineAt(0).rangeIncludingLineBreak.end,
					"import theme from '@dojo/framework/core/middleware/theme';\r\n"
				);
				expect(edit.insert).toHaveBeenNthCalledWith(
					2,
					documentEmpty.lineAt(0).rangeIncludingLineBreak.end,
					"import * as css from './TestWidget.m.css';\r\n"
				);
				expect(edit.insert).toHaveBeenNthCalledWith(
					3,
					documentEmpty.lineAt(4).rangeIncludingLineBreak.end,
					'\tconst themedCss = theme.classes(css);\r\n'
				);
				expect(edit.insert).toHaveBeenCalledTimes(3);

				expect(existsSync).toHaveBeenNthCalledWith(
					1,
					`${sep}path${sep}to${sep}TestWidget.m.css`
				);
				expect(writeFileSync).toHaveBeenNthCalledWith(
					1,
					`${sep}path${sep}to${sep}TestWidget.m.css`,
					'.root {\r\n\r\n}\r\n'
				);
				expect(existsSync).toHaveBeenNthCalledWith(
					2,
					`${sep}path${sep}to${sep}TestWidget.m.css.d.ts`
				);
				expect(writeFileSync).toHaveBeenNthCalledWith(
					2,
					`${sep}path${sep}to${sep}TestWidget.m.css.d.ts`,
					'export const root: string;\r\n'
				);
			});

			it('does not create files if already exist', () => {
				(editor as any).document = documentEmpty;
				(existsSync as jest.Mock).mockReturnValue(true);

				addMiddleware('theme')(editor, edit);

				expect(writeFileSync).not.toHaveBeenCalled();
			});

			it('does not create files if no imports exist', () => {
				(editor as any).document = badFormattingDocument;

				addMiddleware('theme')(editor, edit);

				expect(writeFileSync).not.toHaveBeenCalled();
			});

			it('adds theme.classes line correctly to multi line create widget with single line middleware', () => {
				(editor as any).document = documentMultiLineSingleLineMiddleware;

				addMiddleware('theme')(editor, edit);

				expect(edit.replace).toHaveBeenNthCalledWith(
					1,
					documentMultiLineSingleLineMiddleware.lineAt(3).range,
					'const factory = create({ focus, theme });'
				);
				expect(edit.replace).toHaveBeenNthCalledWith(
					2,
					documentMultiLineSingleLineMiddleware.lineAt(6).range,
					'\tmiddleware: { focus, theme },'
				);
				expect(edit.replace).toHaveBeenCalledTimes(2);
				expect(edit.insert).toHaveBeenNthCalledWith(
					1,
					documentMultiLineSingleLineMiddleware.lineAt(1).rangeIncludingLineBreak.end,
					"import theme from '@dojo/framework/core/middleware/theme';\r\n"
				);
				expect(edit.insert).toHaveBeenNthCalledWith(
					2,
					documentMultiLineSingleLineMiddleware.lineAt(1).rangeIncludingLineBreak.end,
					"import * as css from './TestWidget.m.css';\r\n"
				);
				expect(edit.insert).toHaveBeenNthCalledWith(
					3,
					documentMultiLineSingleLineMiddleware.lineAt(8).rangeIncludingLineBreak.end,
					'\tconst themedCss = theme.classes(css);\r\n'
				);
				expect(edit.insert).toHaveBeenCalledTimes(3);
			});
		});

		describe('i18n', () => {
			it('creates and imports nls message file', () => {
				(editor as any).document = documentEmpty;

				addMiddleware('i18n')(editor, edit);

				expect(edit.replace).toHaveBeenNthCalledWith(
					1,
					documentEmpty.lineAt(2).range,
					'const factory = create({ i18n });'
				);
				expect(edit.replace).toHaveBeenNthCalledWith(
					2,
					documentEmpty.lineAt(4).range,
					'export default factory(function TestWidget({ middleware: { i18n } }) {'
				);
				expect(edit.replace).toHaveBeenCalledTimes(2);
				expect(edit.insert).toHaveBeenNthCalledWith(
					1,
					documentEmpty.lineAt(0).rangeIncludingLineBreak.end,
					"import i18n from '@dojo/framework/core/middleware/i18n';\r\n"
				);
				expect(edit.insert).toHaveBeenNthCalledWith(
					2,
					documentEmpty.lineAt(0).rangeIncludingLineBreak.end,
					"import bundle from './TestWidget.nls';\r\n"
				);
				expect(edit.insert).toHaveBeenNthCalledWith(
					3,
					documentEmpty.lineAt(4).rangeIncludingLineBreak.end,
					'\tconst { messages } = i18n.localize(bundle);\r\n'
				);
				expect(edit.insert).toHaveBeenCalledTimes(3);

				expect(existsSync).toHaveBeenNthCalledWith(
					1,
					`${sep}path${sep}to${sep}TestWidget.nls.ts`
				);
				expect(writeFileSync).toHaveBeenNthCalledWith(
					1,
					`${sep}path${sep}to${sep}TestWidget.nls.ts`,
					'const messages = {\r\n\r\n};\r\n\r\nexport default { messages };\r\n'
				);
			});

			it('does not create files if already exist', () => {
				(editor as any).document = documentEmpty;
				(existsSync as jest.Mock).mockReturnValue(true);

				addMiddleware('i18n')(editor, edit);

				expect(writeFileSync).not.toHaveBeenCalled();
			});

			it('does not create files if no imports exist', () => {
				(editor as any).document = badFormattingDocument;

				addMiddleware('i18n')(editor, edit);

				expect(writeFileSync).not.toHaveBeenCalled();
			});

			it('adds bundle line correctly to multi line create widget with single line middleware', () => {
				(editor as any).document = documentMultiLineSingleLineMiddleware;

				addMiddleware('i18n')(editor, edit);

				expect(edit.replace).toHaveBeenNthCalledWith(
					1,
					documentMultiLineSingleLineMiddleware.lineAt(3).range,
					'const factory = create({ focus, i18n });'
				);
				expect(edit.replace).toHaveBeenNthCalledWith(
					2,
					documentMultiLineSingleLineMiddleware.lineAt(6).range,
					'\tmiddleware: { focus, i18n },'
				);
				expect(edit.replace).toHaveBeenCalledTimes(2);
				expect(edit.insert).toHaveBeenNthCalledWith(
					1,
					documentMultiLineSingleLineMiddleware.lineAt(1).rangeIncludingLineBreak.end,
					"import i18n from '@dojo/framework/core/middleware/i18n';\r\n"
				);
				expect(edit.insert).toHaveBeenNthCalledWith(
					2,
					documentMultiLineSingleLineMiddleware.lineAt(1).rangeIncludingLineBreak.end,
					"import bundle from './TestWidget.nls';\r\n"
				);
				expect(edit.insert).toHaveBeenNthCalledWith(
					3,
					documentMultiLineSingleLineMiddleware.lineAt(8).rangeIncludingLineBreak.end,
					'\tconst { messages } = i18n.localize(bundle);\r\n'
				);
				expect(edit.insert).toHaveBeenCalledTimes(3);
			});
		});

		describe('store', () => {
			it('creates store middleware factory and configures middleware', () => {
				(editor as any).document = documentEmpty;

				addMiddleware('store')(editor, edit);

				expect(edit.replace).toHaveBeenNthCalledWith(
					1,
					documentEmpty.lineAt(2).range,
					'const factory = create({ store });'
				);
				expect(edit.replace).toHaveBeenNthCalledWith(
					2,
					documentEmpty.lineAt(4).range,
					'export default factory(function TestWidget({ middleware: { store } }) {'
				);
				expect(edit.replace).toHaveBeenCalledTimes(2);
				expect(edit.insert).toHaveBeenNthCalledWith(
					1,
					documentEmpty.lineAt(0).rangeIncludingLineBreak.end,
					"import createStoreMiddleware from '@dojo/framework/core/middleware/store';\r\n"
				);
				expect(edit.insert).toHaveBeenNthCalledWith(
					2,
					documentEmpty.lineAt(2).range.start,
					'const store = createStoreMiddleware();\r\n'
				);
				expect(edit.insert).toHaveBeenCalledTimes(2);
			});
		});

		describe('resources', () => {
			it('creates resources middleware factory and configures middleware', () => {
				(editor as any).document = documentEmpty;

				addMiddleware('resources')(editor, edit);

				expect(edit.replace).toHaveBeenNthCalledWith(
					1,
					documentEmpty.lineAt(2).range,
					'const factory = create({ resources });'
				);
				expect(edit.replace).toHaveBeenNthCalledWith(
					2,
					documentEmpty.lineAt(4).range,
					'export default factory(function TestWidget({ middleware: { resources } }) {'
				);
				expect(edit.replace).toHaveBeenCalledTimes(2);
				expect(edit.insert).toHaveBeenNthCalledWith(
					1,
					documentEmpty.lineAt(0).rangeIncludingLineBreak.end,
					"import { createResourceMiddleware } from '@dojo/framework/core/middleware/resources';\r\n"
				);
				expect(edit.insert).toHaveBeenNthCalledWith(
					2,
					documentEmpty.lineAt(2).range.start,
					'const resources = createResourceMiddleware<REPLACE_ME>();\r\n'
				);
				expect(edit.insert).toHaveBeenCalledTimes(2);
			});
		});

		describe('icache', () => {
			it('creates resources middleware factory and configures middleware', () => {
				(editor as any).document = documentEmpty;

				addMiddleware('icache')(editor, edit);

				expect(edit.replace).toHaveBeenNthCalledWith(
					1,
					documentEmpty.lineAt(2).range,
					'const factory = create({ icache });'
				);
				expect(edit.replace).toHaveBeenNthCalledWith(
					2,
					documentEmpty.lineAt(4).range,
					'export default factory(function TestWidget({ middleware: { icache } }) {'
				);
				expect(edit.replace).toHaveBeenCalledTimes(2);
				expect(edit.insert).toHaveBeenNthCalledWith(
					1,
					documentEmpty.lineAt(0).rangeIncludingLineBreak.end,
					"import { createICacheMiddleware } from '@dojo/framework/core/middleware/icache';\r\n"
				);
				expect(edit.insert).toHaveBeenNthCalledWith(
					2,
					documentEmpty.lineAt(0).rangeIncludingLineBreak.end,
					'\r\ninterface TestWidgetState {\r\n\r\n}\r\n\r\n'
				);
				expect(edit.insert).toHaveBeenNthCalledWith(
					3,
					documentEmpty.lineAt(2).range.start,
					'const icache = createICacheMiddleware<TestWidgetState>();\r\n'
				);
				expect(edit.insert).toHaveBeenCalledTimes(3);
			});

			it('defaults to first line if no imports exist when adding icache', () => {
				(editor as any).document = documentNoImports;

				addMiddleware('icache')(editor, edit);

				expect(edit.replace).toHaveBeenNthCalledWith(
					1,
					documentNoImports.lineAt(0).range,
					'const factory = create({ icache });'
				);
				expect(edit.replace).toHaveBeenNthCalledWith(
					2,
					documentNoImports.lineAt(2).range,
					'export default factory(function TestWidget({ middleware: { icache } }) {'
				);
				expect(edit.replace).toHaveBeenCalledTimes(2);
				expect(edit.insert).toHaveBeenNthCalledWith(
					1,
					documentNoImports.lineAt(0).rangeIncludingLineBreak.end,
					"import { createICacheMiddleware } from '@dojo/framework/core/middleware/icache';\r\n"
				);
				expect(edit.insert).toHaveBeenNthCalledWith(
					2,
					documentNoImports.lineAt(0).rangeIncludingLineBreak.end,
					'\r\ninterface TestWidgetState {\r\n\r\n}\r\n\r\n'
				);
				expect(edit.insert).toHaveBeenNthCalledWith(
					3,
					documentNoImports.lineAt(0).range.start,
					'const icache = createICacheMiddleware<TestWidgetState>();\r\n'
				);
				expect(edit.insert).toHaveBeenCalledTimes(3);
			});
		});
	});
});
