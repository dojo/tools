import * as vscode from 'vscode';

export type Callback = (
	textEditor: vscode.TextEditor,
	edit: vscode.TextEditorEdit,
	...args: any[]
) => void;
