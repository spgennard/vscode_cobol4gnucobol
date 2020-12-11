import * as vscode from 'vscode';
import { extensions, OutputChannel, window } from 'vscode';
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
export function activate(context: vscode.ExtensionContext) {
	const isBITLANGCOBOLActive = isBITLANGCobolExtPresent();

	vscode.commands.executeCommand('setContext', 'GnuCOBOL:activateOnBitlangExt', isBITLANGCOBOLActive);

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
