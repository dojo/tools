import { regexFactory } from '../regex';

describe('regex', () => {
	let regex: ReturnType<typeof regexFactory>;
	beforeEach(() => {
		regex = regexFactory();
	});

	describe('vdom import', () => {
		it('matches single import', () => {
			expect(
				regex.vdomImport.test("import { create } from '@dojo/framework/core/vdom';")
			).toBeTruthy();
		});
		it('matches multi import', () => {
			expect(
				regex.vdomImport.test("import { create, tsx } from '@dojo/framework/core/vdom';")
			).toBeTruthy();
		});
		it('matches renamed import', () => {
			expect(
				regex.vdomImport.test(
					"import { create, tsx: something } from '@dojo/framework/core/vdom';"
				)
			).toBeTruthy();
		});
	});

	describe('middleware import', () => {
		it('matches default import', () => {
			expect(
				regex.middlewareImport.test(
					"import middlewareDefault from '@dojo/framework/core/middleware/middlewareName';"
				)
			).toBeTruthy();
		});

		it('matches named import', () => {
			expect(
				regex.middlewareImport.test(
					"import { middlewareNamed } from '@dojo/framework/core/middleware/middlewareName';"
				)
			).toBeTruthy();
		});

		it('matches multi import', () => {
			expect(
				regex.middlewareImport.test(
					"import { middlewareNamed, somethingElse } from '@dojo/framework/core/middleware/middlewareName';"
				)
			).toBeTruthy();
		});

		it('matches renamed import', () => {
			expect(
				regex.middlewareImport.test(
					"import { middlewareNamed, somethingElse: named } from '@dojo/framework/core/middleware/middlewareName';"
				)
			).toBeTruthy();
		});
	});

	describe('import', () => {
		const singleImport = "import { create } from '@dojo/framework/core/vdom';";
		const multiImport = "import { create, tsx } from '@dojo/framework/core/vdom';";
		const defaultImport = "import theme from '@dojo/framework/core/middleware/theme';";
		const mixedImport =
			"import theme, { ThemedProperties } from '@dojo/framework/core/middleware/theme';";

		it('matches single import', () => {
			expect(regex.importLine.test(singleImport)).toBeTruthy();
		});
		it('matches multi import', () => {
			expect(regex.importLine.test(multiImport)).toBeTruthy();
		});
		it('matches default import', () => {
			expect(regex.importLine.test(defaultImport)).toBeTruthy();
		});
		it('matches mixed import', () => {
			expect(regex.importLine.test(mixedImport)).toBeTruthy();
		});
	});

	describe('create', () => {
		const emptyCreate = `const factory = create();`;
		const flatCreate = `const factory = create({ i18n });`;
		const multiLineCreate = `const factory = create({`;
		const createEndLine = `});`;

		describe('createLine', () => {
			it('matches empty create line', () => {
				expect(regex.createLine.test(emptyCreate)).toBeTruthy();
			});
			it('matches flat create line', () => {
				expect(regex.createLine.test(flatCreate)).toBeTruthy();
			});
			it('matches multiline create starting line', () => {
				expect(regex.createLine.test(multiLineCreate)).toBeTruthy();
			});
			it('does not match create end line', () => {
				expect(regex.createLine.test(createEndLine)).toBeFalsy();
			});
		});

		describe('createAloneLine', () => {
			it('does not match empty create line', () => {
				expect(regex.createAloneLine.test(emptyCreate)).toBeFalsy();
			});
			it('matches flat create line', () => {
				expect(regex.createAloneLine.test(flatCreate)).toBeTruthy();
			});
			it('matches multiline create starting line', () => {
				expect(regex.createAloneLine.test(multiLineCreate)).toBeTruthy();
			});
			it('does not match create end line', () => {
				expect(regex.createAloneLine.test(createEndLine)).toBeFalsy();
			});
		});

		describe('createLineEnd', () => {
			it('matches empty create line', () => {
				expect(regex.createLineEnd.test(emptyCreate)).toBeTruthy();
			});
			it('matches flat create line', () => {
				expect(regex.createLineEnd.test(flatCreate)).toBeTruthy();
			});
			it('does not match multiline create starting line', () => {
				expect(regex.createLineEnd.test(multiLineCreate)).toBeFalsy();
			});
			it('matches create end line', () => {
				expect(regex.createLineEnd.test(createEndLine)).toBeTruthy();
			});
		});
	});

	describe('widget factory', () => {
		const defaultExportSingleLine = `export default factory(function WidgetName({ middleware: { theme }, children }) {`;
		const renamedMiddlewareLine = `export default factory(function WidgetName({ middleware: { theme: themeMiddleware, i18n }, properties }) {`;
		const defaultExportSingleLineNoMiddleware = `export default factory(function WidgetName({ children }) {`;
		const defaultExportMultiLine = `export default factory(function WidgetName({`;
		const exportVerboseSingleLine = `export const WidgetName = factory(function WidgetName({ middleware: { theme }, children }) {`;
		const exportVerboseSingleLineNoMiddleware = `export const WidgetName = factory(function WidgetName({ children }) {`;
		const exportVerboseMultiLine = `export const WidgetName = factory(function WidgetName({`;
		const exportSingleLine = `export const WidgetName = factory(({ middleware: { theme }, children }) => {`;
		const exportSingleLineNoMiddleware = `export const WidgetName = factory(({ children }) => {`;
		const exportMultiLine = `export const WidgetName = factory(({`;
		const middlewareAlone = `\tmiddleware: { theme },`;
		const middlewareAloneMultiLine = `\tmiddleware: {`;
		const nonExportSingleLine = `\tconst formMiddleware = factory(function Form({ middleware: { icache } }): FormMiddleware<S> {`;
		const nonExportSingleLineNoMiddleware = `\tconst formMiddleware = factory(function Form(): FormMiddleware<S> {`;
		const nonExportMultiLine = `\tconst formMiddleware = factory(function Form({`;

		describe('widgetFactoryStart', () => {
			it('matches default export single line', () => {
				expect(regex.widgetFactoryStart.test(defaultExportSingleLine)).toBeTruthy();
			});
			it('matches default export renamed middleware line', () => {
				expect(regex.widgetFactoryStart.test(renamedMiddlewareLine)).toBeTruthy();
			});
			it('matches default export single line with no middleware', () => {
				expect(
					regex.widgetFactoryStart.test(defaultExportSingleLineNoMiddleware)
				).toBeTruthy();
			});
			it('matches default export multi line', () => {
				expect(regex.widgetFactoryStart.test(defaultExportMultiLine)).toBeTruthy();
			});
			it('matches verbose export single line', () => {
				expect(regex.widgetFactoryStart.test(exportVerboseSingleLine)).toBeTruthy();
			});
			it('matches verbose export single line with no middleware', () => {
				expect(
					regex.widgetFactoryStart.test(exportVerboseSingleLineNoMiddleware)
				).toBeTruthy();
			});
			it('matches verbose export multi line', () => {
				expect(regex.widgetFactoryStart.test(exportVerboseMultiLine)).toBeTruthy();
			});
			it('matches export single line', () => {
				expect(regex.widgetFactoryStart.test(exportSingleLine)).toBeTruthy();
			});
			it('matches export single line with no middleware', () => {
				expect(regex.widgetFactoryStart.test(exportSingleLineNoMiddleware)).toBeTruthy();
			});
			it('matches export multi line', () => {
				expect(regex.widgetFactoryStart.test(exportMultiLine)).toBeTruthy();
			});
			it('does not match middleware alone single line', () => {
				expect(regex.widgetFactoryStart.test(middlewareAlone)).toBeFalsy();
			});
			it('does not match middleware alone multi line', () => {
				expect(regex.widgetFactoryStart.test(middlewareAloneMultiLine)).toBeFalsy();
			});
			it('matches non-export single line', () => {
				expect(regex.widgetFactoryStart.test(nonExportSingleLine)).toBeTruthy();
			});
			it('matches non-export single line with no middleware', () => {
				expect(regex.widgetFactoryStart.test(nonExportSingleLineNoMiddleware)).toBeTruthy();
			});
			it('matches non-export multi line', () => {
				expect(regex.widgetFactoryStart.test(nonExportMultiLine)).toBeTruthy();
			});
		});

		describe('widgetFactoryEnd', () => {
			it('matches default export single line', () => {
				expect(regex.widgetFactoryEnd.test(defaultExportSingleLine)).toBeTruthy();
			});
			it('matches default export renamed middleware line', () => {
				expect(regex.widgetFactoryEnd.test(renamedMiddlewareLine)).toBeTruthy();
			});
			it('matches default export single line with no middleware', () => {
				expect(
					regex.widgetFactoryEnd.test(defaultExportSingleLineNoMiddleware)
				).toBeTruthy();
			});
			it('does not match default export multi line', () => {
				expect(regex.widgetFactoryEnd.test(defaultExportMultiLine)).toBeFalsy();
			});
			it('matches verbose export single line', () => {
				expect(regex.widgetFactoryEnd.test(exportVerboseSingleLine)).toBeTruthy();
			});
			it('matches verbose export single line with no middleware', () => {
				expect(
					regex.widgetFactoryEnd.test(exportVerboseSingleLineNoMiddleware)
				).toBeTruthy();
			});
			it('does not match verbose export multi line', () => {
				expect(regex.widgetFactoryEnd.test(exportVerboseMultiLine)).toBeFalsy();
			});
			it('matches export single line', () => {
				expect(regex.widgetFactoryEnd.test(exportSingleLine)).toBeTruthy();
			});
			it('matches export single line with no middleware', () => {
				expect(regex.widgetFactoryEnd.test(exportSingleLineNoMiddleware)).toBeTruthy();
			});
			it('does not match export multi line', () => {
				expect(regex.widgetFactoryEnd.test(exportMultiLine)).toBeFalsy();
			});
			it('does not match middleware alone single line', () => {
				expect(regex.widgetFactoryEnd.test(middlewareAlone)).toBeFalsy();
			});
			it('does not match middleware alone multi line', () => {
				expect(regex.widgetFactoryEnd.test(middlewareAloneMultiLine)).toBeFalsy();
			});
			it('matches non-export single line', () => {
				expect(regex.widgetFactoryEnd.test(nonExportSingleLine)).toBeTruthy();
			});
			it('matches non-export single line with no middleware', () => {
				expect(regex.widgetFactoryEnd.test(nonExportSingleLineNoMiddleware)).toBeTruthy();
			});
			it('does not match non-export multi line', () => {
				expect(regex.widgetFactoryEnd.test(nonExportMultiLine)).toBeFalsy();
			});
		});

		describe('widgetFactoryReplace', () => {
			it('matches default export single line', () => {
				expect(regex.widgetFactoryReplace.test(defaultExportSingleLine)).toBeTruthy();
				regex.widgetFactoryReplace.lastIndex = 0;
				expect(regex.widgetFactoryReplace.exec(defaultExportSingleLine)).toHaveLength(2);
			});
			it('matches default export renamed middleware line', () => {
				expect(regex.widgetFactoryReplace.test(renamedMiddlewareLine)).toBeTruthy();
				regex.widgetFactoryReplace.lastIndex = 0;
				expect(regex.widgetFactoryReplace.exec(renamedMiddlewareLine)).toHaveLength(2);
			});
			it('does not match default export single line with no middleware', () => {
				expect(
					regex.widgetFactoryReplace.test(defaultExportSingleLineNoMiddleware)
				).toBeFalsy();
			});
			it('does not match default export multi line', () => {
				expect(regex.widgetFactoryReplace.test(defaultExportMultiLine)).toBeFalsy();
			});
			it('matches verbose export single line', () => {
				expect(regex.widgetFactoryReplace.test(exportVerboseSingleLine)).toBeTruthy();
				regex.widgetFactoryReplace.lastIndex = 0;
				expect(regex.widgetFactoryReplace.exec(exportVerboseSingleLine)).toHaveLength(2);
			});
			it('does not match verbose export single line with no middleware', () => {
				expect(
					regex.widgetFactoryReplace.test(exportVerboseSingleLineNoMiddleware)
				).toBeFalsy();
			});
			it('does not match verbose export multi line', () => {
				expect(regex.widgetFactoryReplace.test(exportVerboseMultiLine)).toBeFalsy();
			});
			it('matches export single line', () => {
				expect(regex.widgetFactoryReplace.test(exportSingleLine)).toBeTruthy();
				regex.widgetFactoryReplace.lastIndex = 0;
				expect(regex.widgetFactoryReplace.exec(exportSingleLine)).toHaveLength(2);
			});
			it('does not match export single line with no middleware', () => {
				expect(regex.widgetFactoryReplace.test(exportSingleLineNoMiddleware)).toBeFalsy();
			});
			it('does not match export multi line', () => {
				expect(regex.widgetFactoryReplace.test(exportMultiLine)).toBeFalsy();
			});
			it('matches middleware alone single line', () => {
				expect(regex.widgetFactoryReplace.test(middlewareAlone)).toBeTruthy();
				regex.widgetFactoryReplace.lastIndex = 0;
				expect(regex.widgetFactoryReplace.exec(middlewareAlone)).toHaveLength(2);
			});
			it('matches middleware alone multi line', () => {
				expect(regex.widgetFactoryReplace.test(middlewareAloneMultiLine)).toBeTruthy();
				regex.widgetFactoryReplace.lastIndex = 0;
				expect(regex.widgetFactoryReplace.exec(middlewareAloneMultiLine)).toHaveLength(2);
			});
			it('matches non-export single line', () => {
				expect(regex.widgetFactoryReplace.test(nonExportSingleLine)).toBeTruthy();
				regex.widgetFactoryReplace.lastIndex = 0;
				expect(regex.widgetFactoryReplace.exec(nonExportSingleLine)).toHaveLength(2);
			});
			it('does not match non-export single line with no middleware', () => {
				expect(
					regex.widgetFactoryReplace.test(nonExportSingleLineNoMiddleware)
				).toBeFalsy();
			});
			it('does not match non-export multi line', () => {
				expect(regex.widgetFactoryReplace.test(nonExportMultiLine)).toBeFalsy();
			});
		});

		describe('widgetFactoryMiddlewareAlone', () => {
			it('does not match default export single line', () => {
				expect(
					regex.widgetFactoryMiddlewareAlone.test(defaultExportSingleLine)
				).toBeFalsy();
			});
			it('does not match default export renamed middleware line', () => {
				expect(regex.widgetFactoryMiddlewareAlone.test(renamedMiddlewareLine)).toBeFalsy();
			});
			it('does not match default export single line with no middleware', () => {
				expect(
					regex.widgetFactoryMiddlewareAlone.test(defaultExportSingleLineNoMiddleware)
				).toBeFalsy();
			});
			it('does not match default export multi line', () => {
				expect(regex.widgetFactoryMiddlewareAlone.test(defaultExportMultiLine)).toBeFalsy();
			});
			it('does not match verbose export single line', () => {
				expect(
					regex.widgetFactoryMiddlewareAlone.test(exportVerboseSingleLine)
				).toBeFalsy();
			});
			it('does not match verbose export single line with no middleware', () => {
				expect(
					regex.widgetFactoryMiddlewareAlone.test(exportVerboseSingleLineNoMiddleware)
				).toBeFalsy();
			});
			it('does not match verbose export multi line', () => {
				expect(regex.widgetFactoryMiddlewareAlone.test(exportVerboseMultiLine)).toBeFalsy();
			});
			it('does not match export single line', () => {
				expect(regex.widgetFactoryMiddlewareAlone.test(exportSingleLine)).toBeFalsy();
			});
			it('does not match export single line with no middleware', () => {
				expect(
					regex.widgetFactoryMiddlewareAlone.test(exportSingleLineNoMiddleware)
				).toBeFalsy();
			});
			it('does not match export multi line', () => {
				expect(regex.widgetFactoryMiddlewareAlone.test(exportMultiLine)).toBeFalsy();
			});
			it('does not match middleware alone single line', () => {
				expect(regex.widgetFactoryMiddlewareAlone.test(middlewareAlone)).toBeFalsy();
			});
			it('matches middleware alone multi line', () => {
				expect(
					regex.widgetFactoryMiddlewareAlone.test(middlewareAloneMultiLine)
				).toBeTruthy();
			});
			it('does not match non-export single line', () => {
				expect(regex.widgetFactoryMiddlewareAlone.test(nonExportSingleLine)).toBeFalsy();
			});
			it('does not match non-export single line with no middleware', () => {
				expect(
					regex.widgetFactoryMiddlewareAlone.test(nonExportSingleLineNoMiddleware)
				).toBeFalsy();
			});
			it('does not match non-export multi line', () => {
				expect(regex.widgetFactoryMiddlewareAlone.test(nonExportMultiLine)).toBeFalsy();
			});
		});
	});

	describe('test runner', () => {
		describe('registerSuiteRegex', () => {
			it('matches register suite call', () => {
				expect(regex.registerSuiteRegex.test("registerSuite('TextInput', {")).toBeTruthy();
			});
		});

		describe('internObjectInterfaceRegex', () => {
			it('matches intern object import', () => {
				expect(
					regex.internObjectInterfaceRegex.test("intern.getInterface('object')")
				).toBeTruthy();
			});
		});

		describe('internObjectTestRegex', () => {
			it('matches test function', () => {
				expect(regex.internObjectTestRegex.test('testName() {')).toBeTruthy();
			});

			it('matches quoted test function', () => {
				expect(regex.internObjectTestRegex.test("'test name'() {")).toBeTruthy();
			});

			it('matches double quoted test function', () => {
				expect(regex.internObjectTestRegex.test('"test name"() {')).toBeTruthy();
			});

			it('handles tabs at start of test function', () => {
				expect(regex.internObjectTestRegex.test('	"test name"() {')).toBeTruthy();
			});

			it('handle spaces at start of test function', () => {
				expect(regex.internObjectTestRegex.test('   "test name"() {')).toBeTruthy();
			});

			it('does not match test suites', () => {
				expect(regex.internObjectTestRegex.test('testSuite: {')).toBeFalsy();
			});

			it('does not match quoted test suites', () => {
				expect(regex.internObjectTestRegex.test("'test suite': {")).toBeFalsy();
			});

			it('does not match double quoted test suites', () => {
				expect(regex.internObjectTestRegex.test('"test suite": {')).toBeFalsy();
			});

			it('handles tabs at start of test suites', () => {
				expect(regex.internObjectTestRegex.test('	"test suite": {')).toBeFalsy();
			});

			it('handle spaces at start of test suites', () => {
				expect(regex.internObjectTestRegex.test('   "test suite": {')).toBeFalsy();
			});
		});

		describe('testRegex', () => {
			it('matches describe', () => {
				const line = "describe('test name', () => {";
				expect(regex.testRegex.test(line)).toBeTruthy();
				regex.testRegex.lastIndex = 0;
				const match = regex.testRegex.exec(line);
				expect(match).toHaveLength(3);
				expect(match?.[1]).toBe('describe');
				expect(match?.[2]).toBe('test name');
			});

			it('matches it', () => {
				const line = "it('test name', () => {";
				expect(regex.testRegex.test(line)).toBeTruthy();
				regex.testRegex.lastIndex = 0;
				const match = regex.testRegex.exec(line);
				expect(match).toHaveLength(3);
				expect(match?.[1]).toBe('it');
				expect(match?.[2]).toBe('test name');
			});

			it('matches test', () => {
				const line = "test('test name', () => {";
				expect(regex.testRegex.test(line)).toBeTruthy();
				regex.testRegex.lastIndex = 0;
				const match = regex.testRegex.exec(line);
				expect(match).toHaveLength(3);
				expect(match?.[1]).toBe('test');
				expect(match?.[2]).toBe('test name');
			});

			it('should not match if has leading characters', () => {
				const line = "const parts = input.split('|');";
				expect(regex.testRegex.test(line)).toBeFalsy();
			});
		});
	});
});
