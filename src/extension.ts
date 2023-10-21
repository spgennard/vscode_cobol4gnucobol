import * as vscode from "vscode";
import { extensions, languages, OutputChannel, TextDocument, window, workspace } from "vscode";
import util from "util";
import os from "os";
import { DumpFileSymbolProvider } from "./dumpFileSymbolProvider";
import { GnuCOBOLDocumentSymbolProvider } from "./gnuCOBOLSymbolProvider";
import { COBOLSourceDefinition } from "./sourceDefinitionProvider";
import { updateDecorations } from "./margindecorations";

const COBOLOutputChannel: OutputChannel = window.createOutputChannel("GnuCOBOL");

export function logMessage(message: string, ...parameters: any[]): void {
	if ((parameters !== undefined || parameters !== null) && parameters.length !== 0) {
		COBOLOutputChannel.appendLine(util.format(message, parameters));
	} else {
		COBOLOutputChannel.appendLine(message);
	}
}

//assumes an exact match
const gnuCOBOLSpecific: string[] = [
	">>SOURCE FORMAT",
	">> SOURCE FORMAT",
	">>SET SOURCEFORMAT",
	">> SET SOURCEFORMAT",
	"CBL_GC_FORK",
	"CBL_GC_GETOPT",
	"CBL_GC_HOSTED",
	"CBL_GC_NANOSLEEP",
	"CBL_GC_WAITPID",
	"CBL_OC_GETOPT",
	"CBL_OC_HOSTED",
	"CBL_OC_NANOSLEEP",
	"CBL_OC_CTK",
	"GNU COBOL",
	"GNUCOBOL", 				// constant
	"OPENCOBOL",				// constant
	"COB_SCREEN_EXCEPTIONS",
	"COB_SCREEN_ESC",
	"FUNCTION CONCATENATE",
	"COBC"
];

function isSourceGnuCOBOL(doc: TextDocument): boolean {
	// never want to stop the open... so ensure it always works
	try {
		const maxLines = doc.lineCount < 1024 ? doc.lineCount : 1024;

		for (let lineCount = 0; lineCount < maxLines; lineCount++) {
			const line = doc.lineAt(lineCount).text;
			for (const gnuItem of gnuCOBOLSpecific) {
				if (line.indexOf(gnuItem) !== -1) {
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
		case "ACUCOBOL":
		case "RMCOBOL":
		case "COBOLIT":
		case "COBOL":
		case "BITLANG-COBOL":
			if (isSourceGnuCOBOL(doc)) {
				vscode.languages.setTextDocumentLanguage(doc, "GnuCOBOL");
				return;
			}
	}

	if (doc.languageId === "plaintext" || doc.languageId === "tsql") {  // one tsql ext grabs .lst!
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


// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getExtensionInformation(grab_info_for_ext: vscode.Extension<any>, reasons: string[]): string {
	let dupExtensionMessage = "";

	dupExtensionMessage += `\nThe extension ${grab_info_for_ext.packageJSON.name} from ${grab_info_for_ext.packageJSON.publisher} has conflicting functionality\n`;
	if (reasons.length !== 0) {
		for (const reason of reasons) {
			dupExtensionMessage += ` Reason        : ${reason}\n`;
		}
	}

	if (grab_info_for_ext.packageJSON.id !== undefined) {
		dupExtensionMessage += ` Id            : ${grab_info_for_ext.packageJSON.id}\n`;

		if (grab_info_for_ext.packageJSON.description !== undefined) {
			dupExtensionMessage += ` Description   : ${grab_info_for_ext.packageJSON.description}\n`;
		}
		if (grab_info_for_ext.packageJSON.version !== undefined) {
			dupExtensionMessage += ` Version       : ${grab_info_for_ext.packageJSON.version}\n`;
		}
		if (grab_info_for_ext.packageJSON.repository !== undefined && grab_info_for_ext.packageJSON.repository.url !== undefined) {
			dupExtensionMessage += ` Repository    : ${grab_info_for_ext.packageJSON.repository.url}\n`;
		}
		if (grab_info_for_ext.packageJSON.bugs !== undefined && grab_info_for_ext.packageJSON.bugs.url !== undefined) {
			dupExtensionMessage += ` Bug Reporting : ${grab_info_for_ext.packageJSON.bugs.url}\n`;
		}
		if (grab_info_for_ext.packageJSON.bugs !== undefined && grab_info_for_ext.packageJSON.bugs.email !== undefined) {
			dupExtensionMessage += ` Bug Email     : ${grab_info_for_ext.packageJSON.bugs.email}\n`;
		}
		if (dupExtensionMessage.length !== 0) {
			dupExtensionMessage += "\n";
		}
	}

	return dupExtensionMessage;
}

function checkForExtensionConflicts(): string {
	let dupExtensionMessage = "";

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	for (const ext of extensions.all) {
		const reason = [];
		if (ext !== undefined && ext.packageJSON !== undefined) {
			if (ext.packageJSON.id !== undefined) {
				if (ext.packageJSON.id === "bitlang.gnucobol") {
					continue;
				}
			}

			let extMarkedAsDebugger = false;
			//categories

			if (ext.packageJSON.categories !== undefined) {
				const categoriesBody = ext.packageJSON.categories;
				if (categoriesBody !== undefined && categoriesBody instanceof Object) {
					for (const key in categoriesBody) {
						try {
							const element = categoriesBody[key];
							if (element !== undefined) {
								const l = `${element}`.toUpperCase();
								if (l === "DEBUGGERS") {
									extMarkedAsDebugger = true;
								}
							}
						} catch {
							// just incase
						}
					}
				}
			}

			if (ext.packageJSON.contributes !== undefined) {
				const grammarsBody = ext.packageJSON.contributes.grammars;
				const languagesBody = ext.packageJSON.contributes.languages;

				// check for unexpected duplicate COBOL language
				if (grammarsBody !== undefined && grammarsBody instanceof Object) {
					for (const key in grammarsBody) {
						try {
							const element = grammarsBody[key];
							if (element !== undefined && element.language !== undefined) {
								const l = `${element.language}`.toUpperCase();
								if (l === "COBOL") {
									reason.push("contributes conflicting grammar");
								}
							}
						} catch {
							// just incase
						}
					}
				}

				// check for language id
				if (languagesBody !== undefined && languagesBody instanceof Object) {
					for (const key in languagesBody) {
						const languageElement = languagesBody[key];
						try {

							if (languageElement !== undefined && languageElement.id !== undefined) {
								const l = `${languageElement.id}`.toUpperCase();
								if (l === "COBOL") {
									reason.push("contributes language id");
								}
							}
						}
						catch {
							// just incase
						}
					}
				}
			}
		}

		if (reason.length !== 0) {
			dupExtensionMessage += getExtensionInformation(ext, reason);
		}

	}

	return dupExtensionMessage;
}


export function activate(context: vscode.ExtensionContext) {
	COBOLOutputChannel.clear();
	const cobolSelectors = [
		{ scheme: "file", language: "GnuCOBOL" },
		{ scheme: "file", language: "GnuCOBOL3.1" },
		{ scheme: "file", language: "GnuCOBOL3.2" }
	];
	const onDidOpenTextDocumentHandler = workspace.onDidOpenTextDocument((doc) => {
		flip_plaintext(doc);
	});
	context.subscriptions.push(onDidOpenTextDocumentHandler);

	/* flip any already opened docs */
	for (let docid = 0; docid < workspace.textDocuments.length; docid++) {
		flip_plaintext(workspace.textDocuments[docid]);
	}

	const documentSymbolProvider = new GnuCOBOLDocumentSymbolProvider();
	context.subscriptions.push(languages.registerDocumentSymbolProvider(cobolSelectors, documentSymbolProvider));

	const cobolSourceDefinitionProvider = new COBOLSourceDefinition();
	context.subscriptions.push(languages.registerDefinitionProvider(cobolSelectors, cobolSourceDefinitionProvider));
	
	const dumpfileSelector = [
		{ scheme: "file", language: "COBOL_GNU_DUMPFILE" }
	];
	const dumpfileSymbolProvider = new DumpFileSymbolProvider();
	context.subscriptions.push(languages.registerDocumentSymbolProvider(dumpfileSelector, dumpfileSymbolProvider));

	window.onDidChangeActiveTextEditor(editor => {
        if (!editor) {
            return;
        }
        updateDecorations(editor);

    }, null, context.subscriptions);

    window.onDidChangeTextEditorSelection(event => {
        if (!event.textEditor) {
            return;
        }
        updateDecorations(event.textEditor);
    }, null, context.subscriptions);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    workspace.onDidChangeTextDocument(event => {
        if (!window.activeTextEditor) {
            return;
        }
        updateDecorations(window.activeTextEditor);
    }, null, context.subscriptions);

    if (window.activeTextEditor !== undefined) {
        updateDecorations(window.activeTextEditor);
    }
	
	const thisExtension = extensions.getExtension("bitlang.gnucobol");
	if (thisExtension !== undefined) {
		logMessage(`VSCode version          : ${vscode.version}`);
		logMessage(` Platform               : ${os.platform}`);
		logMessage(` Architecture           : ${os.arch}`);
		logMessage("Extension Information:");
		logMessage(` Extension path         : ${thisExtension.extensionPath}`);
		logMessage(` Version                : ${thisExtension.packageJSON.version}`);
	}

	const checkForExtensionConflictsMessage = checkForExtensionConflicts();

	// display the message
	if (checkForExtensionConflictsMessage.length !== 0) {
		logMessage(checkForExtensionConflictsMessage);
		COBOLOutputChannel.show(false);
	}
}
