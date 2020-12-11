import * as vscode from 'vscode';
import { extensions, OutputChannel, TextDocument, window, workspace } from 'vscode';
import util from 'util';
import os from 'os';

const COBOLOutputChannel: OutputChannel = window.createOutputChannel("GnuCOBOL");

function isBITLANGCobolExtPresent(): boolean {
	return extensions.getExtension("bitlang.cobol") !== undefined;
}

function logMessage(message: string, ...parameters: any[]): void {
	if ((parameters !== undefined || parameters !== null) && parameters.length !== 0) {
		COBOLOutputChannel.appendLine(util.format(message, parameters));
	} else {
		COBOLOutputChannel.appendLine(message);
	}
}

function flip_plaintext(doc: TextDocument) {
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
	const isBITLANGCOBOLActive = isBITLANGCobolExtPresent();

	vscode.commands.executeCommand('setContext', 'GnuCOBOL:activateOnBitlangExt', isBITLANGCOBOLActive);

	const onDidOpenTextDocumentHandler = workspace.onDidOpenTextDocument((doc) => {
		flip_plaintext(doc);
	});
	context.subscriptions.push(onDidOpenTextDocumentHandler);

	/* flip any already opened docs */
	for (let docid = 0; docid < workspace.textDocuments.length; docid++) {
		flip_plaintext(workspace.textDocuments[docid]);
	}

	COBOLOutputChannel.clear();

	const thisExtension = extensions.getExtension("bitlang.gnucobol");
	if (thisExtension !== undefined) {
		logMessage(`VSCode version : ${vscode.version}`);
		logMessage(` Platform             : ${os.platform}`);
		logMessage(` Architecture         : ${os.arch}`);
		logMessage("Extension Information:");
		logMessage(` Extension path       : ${thisExtension.extensionPath}`);
		logMessage(` Version              : ${thisExtension.packageJSON.version}`);
		logMessage(` bitlang.COBOL active : ${isBITLANGCOBOLActive}`);
	}
}
