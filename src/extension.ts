import * as vscode from 'vscode';
import { extensions, languages, OutputChannel, TextDocument, window, workspace } from 'vscode';
import util from 'util';
import os from 'os';
import { DumpFileSymbolProvider } from './dumpFileSymbolProvider';

const COBOLOutputChannel: OutputChannel = window.createOutputChannel("GnuCOBOL");

function logMessage(message: string, ...parameters: any[]): void {
	if ((parameters !== undefined || parameters !== null) && parameters.length !== 0) {
		COBOLOutputChannel.appendLine(util.format(message, parameters));
	} else {
		COBOLOutputChannel.appendLine(message);
	}
}

const gnuCOBOLSpecific: string[] = [
	">>SOURCE FORMAT",
	">>SET SOURCEFORMAT",
	"CBL_GC_FORK",
	"CBL_GC_GETOPT",
	"CBL_GC_HOSTED",
	"CBL_GC_NANOSLEEP",
	"CBL_GC_WAITPID",
	"CBL_OC_GETOPT",
	"CBL_OC_HOSTED",
	"CBL_OC_NANOSLEEP",
	"CBL_OC_CTK",
	"GNUCOBOL", 				// constant
	"OPENCOBOL",				// constant
	"COB_SCREEN_EXCEPTIONS",
	"COB_SCREEN_EXCEPTIONS",
	"FUNCTION CONCATENATE",
	"COBC"
];

function isSourceGnuCOBOL(doc: TextDocument): boolean {
	// never want to stop the open... so ensure it always works
	try {
		const maxLines = doc.lineCount < 128 ? doc.lineCount : 128;

		for (let lineCount = 0; lineCount < maxLines; lineCount++) {
			const line = doc.lineAt(lineCount).text;
			const lineUpper = line.toUpperCase();
			for (const gnuItem of gnuCOBOLSpecific) {
				if (lineUpper.indexOf(gnuItem) !== -1) {
					return true;
				}
			}
		}
	} catch {
		//
	}

	return false;
}

function flip_plaintext(doc: TextDocument) {

	switch (doc.languageId) {
		case 'COBOLIT':
		case 'COBOL':
			if (isSourceGnuCOBOL(doc)) {
				vscode.languages.setTextDocumentLanguage(doc, "GnuCOBOL");
				return;
			}
	}

	if (doc.languageId === 'plaintext' || doc.languageId === 'tsql') {  // one tsql ext grabs .lst!
		const lcount = doc.lineCount;
		if (lcount >= 2) {
			const firstLine = doc.lineAt((0)).text;

			if (firstLine.startsWith("GnuCOBOL ")) {
				vscode.languages.setTextDocumentLanguage(doc, "COBOL_GNU_LISTFILE");
				return;
			}
		}
	}
}

export function activate(context: vscode.ExtensionContext) {
	const onDidOpenTextDocumentHandler = workspace.onDidOpenTextDocument((doc) => {
		flip_plaintext(doc);
	});
	context.subscriptions.push(onDidOpenTextDocumentHandler);

	/* flip any already opened docs */
	for (let docid = 0; docid < workspace.textDocuments.length; docid++) {
		flip_plaintext(workspace.textDocuments[docid]);
	}

	const dumpfileSelector = [
		{ scheme: 'file', language: 'COBOL_GNU_DUMPFILE' }
	];
	const dumpfileSymbolProvider = new DumpFileSymbolProvider();
	context.subscriptions.push(languages.registerDocumentSymbolProvider(dumpfileSelector, dumpfileSymbolProvider));
	COBOLOutputChannel.clear();

	const thisExtension = extensions.getExtension("bitlang.gnucobol");
	if (thisExtension !== undefined) {
		logMessage(`VSCode version          : ${vscode.version}`);
		logMessage(` Platform               : ${os.platform}`);
		logMessage(` Architecture           : ${os.arch}`);
		logMessage("Extension Information:");
		logMessage(` Extension path         : ${thisExtension.extensionPath}`);
		logMessage(` Version                : ${thisExtension.packageJSON.version}`);
	}
}
