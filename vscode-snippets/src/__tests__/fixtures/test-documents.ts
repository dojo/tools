import { createDocument } from '../document';

export const documentEmpty = createDocument([
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

export const documentSingleLine = createDocument([
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

export const documentMultiLine = createDocument([
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

export const documentMultiLineCreateMultiLine = createDocument([
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

export const documentMultiLineCreateMultiLineEmpty = createDocument([
	"import { tsx } from '@dojo/framework/core/vdom';",
	"import theme from '@dojo/framework/core/middleware/theme';",
	'',
	"import * as css from './TestWidget.m.css';",
	'',
	'const factory = create({',
	'});',
	'',
	'export default factory(function TestWidget({',
	'\tmiddleware: {',
	'\t}',
	'}) {',
	'\tconst themedCss = theme.classes(css);',
	'\treturn (',
	'\t\t<div classes={themedCss.root}>{}</div>',
	'\t);',
	');',
	'',
]);

export const documentMultiLineCreateTrailingComma = createDocument([
	"import { tsx } from '@dojo/framework/core/vdom';",
	"import theme from '@dojo/framework/core/middleware/theme';",
	'',
	"import * as css from './TestWidget.m.css';",
	'',
	'const factory = create({',
	'\ttheme,',
	'});',
	'',
	'export default factory(function TestWidget({',
	'\tmiddleware: {',
	'\t\ttheme,',
	'\t}',
	'}) {',
	'\tconst themedCss = theme.classes(css);',
	'\treturn (',
	'\t\t<div classes={themedCss.root}>{}</div>',
	'\t);',
	');',
	'',
]);

export const documentMultiLineCreateCompoundMiddlewareLine = createDocument([
	"import { tsx } from '@dojo/framework/core/vdom';",
	"import theme from '@dojo/framework/core/middleware/theme';",
	'',
	"import * as css from './TestWidget.m.css';",
	'',
	'const factory = create({',
	'\tsomething1,',
	'\tsomething2, theme,',
	'});',
	'',
	'export default factory(function TestWidget({',
	'\tmiddleware: {',
	'\t\tsomething1',
	'\t\tsomething2, theme,',
	'\t}',
	'}) {',
	'\tconst themedCss = theme.classes(css);',
	'\treturn (',
	'\t\t<div classes={themedCss.root}>{}</div>',
	'\t);',
	');',
	'',
]);

export const badDocument = createDocument([
	'export function TestWidget() {',
	'\tconst themedCss = theme.classes(css);',
	'\treturn (',
	'\t\t<div classes={themedCss.root}>{}</div>',
	'\t);',
	');',
	'',
]);

export const badFormattingDocument = createDocument([
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

export const missingDocument = createDocument(['', '']);
