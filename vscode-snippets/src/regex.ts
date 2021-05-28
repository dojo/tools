export const regexFactory = () => ({
	vdomImport: /import \{[\w,:= ]+\} from '@dojo\/framework\/core\/vdom';/g,
	middlewareImport:
		/import [\w{},:= ]+ from ['"]@dojo\/framework\/core\/middleware\/[\w]+['"];/g,
	createLine: /create\(({[a-zA-Z0-9, ]*\})*[\)]*/g,
	createAloneLine: /create[ ]*\({/g,
	createLineEnd: /[}]*\);/g,
	widgetFactoryStart:
		/[\t]*(?:export )*(?:default|const [a-zA-Z0-9]+[ ]*=)[ ]*[a-zA-Z0-9]+\((?:function [a-zA-Z0-9]+)*\([{]*/g,
	widgetFactoryEnd: /[}]*\)[ ]*(?:\:[ ]*[\s\S]+)*(?:=>[ ]*)*{/g,
	widgetFactoryReplace: /[{]*[\s\S ]*middleware[ ]*:[ ]*(\{[a-zA-Z0-9, :]+\})*[\s\S ]*[\}]*[ ]*/g,
	widgetFactoryMiddlewareAlone: /middleware:[ ]*{[ ]*$/g,
	importLine: /import [\s\S]+ from ['"]{1}[\s\S]+['"]{1}[;]*/g,
});
