import * as vscode from 'vscode';

export type Callback = (args: { document: vscode.TextDocument, editBuilder: vscode.TextEditorEdit, selection: vscode.Selection, options: vscode.TextEditorOptions }) => void;
