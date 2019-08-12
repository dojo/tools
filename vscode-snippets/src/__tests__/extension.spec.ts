import * as vscode from 'vscode';

import { activate } from '../extension';

jest.mock('vscode');

describe('extension', () => {
	it('activate', () => {
    const context: vscode.ExtensionContext = {
      subscriptions: [],
    } as any;
		activate(context);

		expect(vscode.commands.registerTextEditorCommand).toHaveBeenNthCalledWith(1, 'dojo.addi18n', expect.anything());
		expect(vscode.commands.registerTextEditorCommand).toHaveBeenNthCalledWith(2, 'dojo.addTheme', expect.anything());
		expect(vscode.commands.registerTextEditorCommand).toHaveBeenNthCalledWith(3, 'dojo.addBlock', expect.anything());
		expect(vscode.commands.registerTextEditorCommand).toHaveBeenNthCalledWith(4, 'dojo.addBreakpoint', expect.anything());
		expect(vscode.commands.registerTextEditorCommand).toHaveBeenNthCalledWith(5, 'dojo.addCache', expect.anything());
		expect(vscode.commands.registerTextEditorCommand).toHaveBeenNthCalledWith(6, 'dojo.addIcache', expect.anything());
		expect(vscode.commands.registerTextEditorCommand).toHaveBeenNthCalledWith(7, 'dojo.addFocus', expect.anything());
		expect(vscode.commands.registerTextEditorCommand).toHaveBeenNthCalledWith(8, 'dojo.addIntersection', expect.anything());
		expect(vscode.commands.registerTextEditorCommand).toHaveBeenNthCalledWith(9, 'dojo.addResize', expect.anything());
		expect(vscode.commands.registerTextEditorCommand).toHaveBeenNthCalledWith(10, 'dojo.addValidity', expect.anything());
		expect(vscode.commands.registerTextEditorCommand).toHaveBeenNthCalledWith(11, 'dojo.addStore', expect.anything());
		expect(vscode.commands.registerTextEditorCommand).toHaveBeenNthCalledWith(12, 'dojo.addDimensions', expect.anything());
		expect(vscode.commands.registerTextEditorCommand).toHaveBeenNthCalledWith(13, 'dojo.addProperties', expect.anything());
		expect(vscode.commands.registerTextEditorCommand).toHaveBeenNthCalledWith(14, 'dojo.addChildren', expect.anything());

		expect(vscode.commands.registerTextEditorCommand).toHaveBeenCalledTimes(14);
	});
});
