import { parse, join } from 'path';
import { existsSync, writeFileSync } from 'fs';

import { Callback } from './interface';
import { regexFactory } from './regex';
import { findLine, getTab } from './util';

export function addMiddleware(middleware: string): Callback {
	return (editor, edit) => {
		const document = editor.document;
		const tab = getTab(editor.options);
		const regex = regexFactory();
		let importName = middleware;
		if (middleware === 'store') {
			importName = `create${importName.charAt(0).toUpperCase()}${importName.slice(
				1
			)}Middleware`;
		}

		const importStatement = `import ${importName} from \'@dojo/framework/core/middleware/${middleware}\';\r\n`;
		const importLine = findLine(document, regex.vdomImport);
		if (importLine) {
			edit.insert(importLine.rangeIncludingLineBreak.end, importStatement);
		}

		const createLine = findLine(document, regex.createLine);
		if (createLine) {
			let newCreateLine = createLine.text;
			regex.createLine.lastIndex = 0;
			const match = regex.createLine.exec(newCreateLine);
			let shouldEdit = true;
			if (match && match.length > 1 && match[1]) {
				let middlewares = match[1];
				const newMiddleware = middlewares.replace(/[ ]*\}/g, `, ${middleware} }`);
				newCreateLine = newCreateLine.replace(middlewares, newMiddleware);
			} else if (regex.createAloneLine.test(newCreateLine)) {
				shouldEdit = false;
				const tabCount = (newCreateLine.match(new RegExp(tab, 'g')) || []).length + 1;
				edit.insert(
					createLine.rangeIncludingLineBreak.end,
					`${tab.repeat(tabCount)}${middleware},\r\n`
				);
			} else {
				newCreateLine = newCreateLine.replace('create()', `create({ ${middleware} })`);
			}
			if (shouldEdit && newCreateLine !== createLine.text) {
				edit.replace(createLine.range, newCreateLine);
			}

			switch (middleware) {
				case 'store':
					edit.insert(
						createLine.range.start,
						`const ${middleware} = ${importName}();\r\n`
					);
					break;
			}
		}

		if (middleware === 'theme' || middleware === 'i18n') {
			const lastImportStatement = findLine(document, regex.importLine, { reverse: true });
			if (lastImportStatement) {
				const file = parse(document.fileName);
				switch (middleware) {
					case 'theme':
						edit.insert(
							lastImportStatement.rangeIncludingLineBreak.end,
							`import * as css from './${file.name}.m.css';\r\n`
						);
						const cssFile = join(file.dir, `${file.name}.m.css`);
						if (!existsSync(cssFile)) {
							writeFileSync(cssFile, `.root {\r\n\r\n}\r\n`);
						}
						const cssDefinitionFile = join(file.dir, `${file.name}.m.css.d.ts`);
						if (!existsSync(cssDefinitionFile)) {
							writeFileSync(cssDefinitionFile, `export const root: string;\r\n`);
						}
						break;
					case 'i18n':
						edit.insert(
							lastImportStatement.rangeIncludingLineBreak.end,
							`import bundle from './${file.name}.nls';\r\n`
						);
						const bundleFile = join(file.dir, `${file.name}.nls.ts`);
						if (!existsSync(bundleFile)) {
							writeFileSync(
								bundleFile,
								`const messages = {\r\n\r\n};\r\n\r\nexport default { messages };\r\n`
							);
						}
						break;
				}
			}
		}

		let widgetFactoryMiddlewareLine = findLine(document, regex.widgetFactoryStart);
		if (widgetFactoryMiddlewareLine) {
			if (!regex.widgetFactoryEnd.test(widgetFactoryMiddlewareLine.text)) {
				const middlewareLine = findLine(document, regex.widgetFactoryReplace, {
					startAt: widgetFactoryMiddlewareLine.lineNumber,
					endTest: regex.widgetFactoryEnd
				});
				if (middlewareLine) {
					widgetFactoryMiddlewareLine = middlewareLine;
				}
			}
			let newFactoryMiddlewareLine = widgetFactoryMiddlewareLine.text;
			regex.widgetFactoryReplace.lastIndex = 0;
			const match = regex.widgetFactoryReplace.exec(newFactoryMiddlewareLine);
			let wasEdited = true;
			if (match && match.length > 0) {
				if (match.length > 1 && match[1]) {
					let middlewares = match[1];
					const newMiddleware = middlewares.replace(/[ ]*\}/g, `, ${middleware} }`);
					newFactoryMiddlewareLine = newFactoryMiddlewareLine.replace(
						middlewares,
						newMiddleware
					);
				} else {
					wasEdited = false;
					const tabCount =
						(newFactoryMiddlewareLine.match(new RegExp(tab, 'g')) || []).length + 1;
					edit.insert(
						widgetFactoryMiddlewareLine.rangeIncludingLineBreak.end,
						`${tab.repeat(tabCount)}${middleware},\r\n`
					);
				}
			} else if (/[ ]*}[ ]*\)/g.test(newFactoryMiddlewareLine)) {
				newFactoryMiddlewareLine = newFactoryMiddlewareLine.replace(
					/[ ]*}[ ]*\)/g,
					`, middleware: { ${middleware} } })`
				);
			} else {
				newFactoryMiddlewareLine = newFactoryMiddlewareLine.replace(
					'()',
					`({ middleware: { ${middleware} } })`
				);
			}
			if (wasEdited && newFactoryMiddlewareLine !== widgetFactoryMiddlewareLine.text) {
				edit.replace(widgetFactoryMiddlewareLine.range, newFactoryMiddlewareLine);
			}

			switch (middleware) {
				case 'theme':
					edit.insert(
						widgetFactoryMiddlewareLine.rangeIncludingLineBreak.end,
						`${tab}const themedCss = theme.classes(css);\r\n`
					);
					break;
				case 'i18n':
					edit.insert(
						widgetFactoryMiddlewareLine.rangeIncludingLineBreak.end,
						`${tab}const { messages } = i18n.localize(bundle);\r\n`
					);
					break;
			}
		}
	};
}
