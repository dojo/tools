import * as vscode from 'vscode';

export function createDocument(lines: string[], details: Partial<vscode.TextDocument> = {}): vscode.TextDocument {
	return {
		...details,
		fileName: '/path/to/TestWidget.tsx',
		lineCount: lines.length,
		lineAt(lineNumber: number): vscode.TextLine {
			const line = lines[lineNumber];
			return {
				lineNumber,
				text: line,
				range: {
					start: {
						line: lineNumber,
						character: 0
					} as vscode.Position,
					end: {
						line: lineNumber,
						character: line.length
					} as vscode.Position,
					isEmpty: Boolean(line.trim().length),
					isSingleLine: true
				} as vscode.Range,
				rangeIncludingLineBreak: {
					start: {
						line: lineNumber,
						character: 0
					} as vscode.Position,
					end: {
						line: lineNumber,
						character: line.length + 1
					} as vscode.Position,
					isEmpty: Boolean(line.trim().length),
					isSingleLine: true
				} as vscode.Range, 
				firstNonWhitespaceCharacterIndex: line.length - line.trimLeft().length,
				isEmptyOrWhitespace: Boolean(line.trim().length)
			} as vscode.TextLine;
		}
	} as vscode.TextDocument;
}
