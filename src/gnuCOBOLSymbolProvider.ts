import * as vscode from 'vscode';
import COBOLSourceScanner, { COBOLTokenStyle, EmptyCOBOLSourceScannerEventHandler } from './cobolsourcescanner';
import { logMessage } from './extension';
import { VSCodeSourceHandler } from './vscodesourcehandler';
import { VSExternalFeatures } from './vsexternalfeatures';


export class GnuCOBOLDocumentSymbolProvider implements vscode.DocumentSymbolProvider {

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public async provideDocumentSymbols(document: vscode.TextDocument, canceltoken: vscode.CancellationToken): Promise<vscode.SymbolInformation[]> {
        const symbols: vscode.SymbolInformation[] = [];

        const sf = COBOLSourceScanner.ParseUncached(new VSCodeSourceHandler(document,false, undefined),false, new EmptyCOBOLSourceScannerEventHandler(), new VSExternalFeatures());

        if (sf === undefined) {
            return symbols;
        }

        const ownerUri = document.uri;

        const includePara = true;
        const includeVars = true;
        const includeSections = true;

        for (const token of sf.tokensInOrder) {
            try {
                if (token.ignoreInOutlineView === false) {
                    const srange = new vscode.Range(new vscode.Position(token.startLine, token.startColumn),
                        new vscode.Position(token.endLine, token.endColumn));

                    const lrange = new vscode.Location(ownerUri, srange);

                    const container = token.parentToken !== undefined ? token.parentToken.description : "";
                    switch (token.tokenType) {
                        case COBOLTokenStyle.ProgramId:
                            symbols.push(new vscode.SymbolInformation(token.description, vscode.SymbolKind.Class, container, lrange));
                            break;
                        case COBOLTokenStyle.CopyBook:
                            symbols.push(new vscode.SymbolInformation(token.description, vscode.SymbolKind.File, container, lrange));
                            break;
                        case COBOLTokenStyle.CopyBookInOrOf:
                            symbols.push(new vscode.SymbolInformation(token.description, vscode.SymbolKind.File, container, lrange));
                            break;
                        case COBOLTokenStyle.File:
                            symbols.push(new vscode.SymbolInformation(token.description, vscode.SymbolKind.File, container, lrange));
                            break;
                        case COBOLTokenStyle.Declaratives:
                            symbols.push(new vscode.SymbolInformation(token.description, vscode.SymbolKind.Method, container, lrange));
                            break;
                        case COBOLTokenStyle.Division:
                            symbols.push(new vscode.SymbolInformation(token.description, vscode.SymbolKind.Method, container, lrange));
                            break;
                        case COBOLTokenStyle.Paragraph:
                            symbols.push(new vscode.SymbolInformation(token.description, vscode.SymbolKind.Method, container, lrange));
                            break;
                        case COBOLTokenStyle.DeclarativesSection:
                            symbols.push(new vscode.SymbolInformation(token.description, vscode.SymbolKind.Method, container, lrange));
                            break;
                        case COBOLTokenStyle.Section:
                            symbols.push(new vscode.SymbolInformation(token.description, vscode.SymbolKind.Method, container, lrange));
                            break;
                        case COBOLTokenStyle.EntryPoint:
                        case COBOLTokenStyle.FunctionId:
                            symbols.push(new vscode.SymbolInformation(token.description, vscode.SymbolKind.Function, container, lrange));
                            break;
                        case COBOLTokenStyle.Variable:
                            // drop fillers
                            if (token.tokenNameLower === "filler") {
                                continue;
                            }

                            if (token.extraInformation === 'fd' || token.extraInformation === 'sd'
                                || token.extraInformation === 'rd' || token.extraInformation === 'select') {
                                symbols.push(new vscode.SymbolInformation(token.description, vscode.SymbolKind.File, container, lrange));
                            }
                            else {
                                if (token.extraInformation.endsWith("-GROUP")) {
                                    symbols.push(new vscode.SymbolInformation(token.description, vscode.SymbolKind.Struct, container, lrange));
                                } else if (token.extraInformation.endsWith("88")) {
                                    symbols.push(new vscode.SymbolInformation(token.description, vscode.SymbolKind.EnumMember, container, lrange));
                                } else if (token.extraInformation.endsWith("-OCCURS")) {
                                    symbols.push(new vscode.SymbolInformation(token.description, vscode.SymbolKind.Array, container, lrange));
                                } else {
                                    symbols.push(new vscode.SymbolInformation(token.description, vscode.SymbolKind.Field, container, lrange));
                                }
                            }
                            break;
                        case COBOLTokenStyle.ConditionName:
                            symbols.push(new vscode.SymbolInformation(token.description, vscode.SymbolKind.TypeParameter, container, lrange));
                            break;
                        case COBOLTokenStyle.Union:
                            symbols.push(new vscode.SymbolInformation(token.description, vscode.SymbolKind.Struct, container, lrange));
                            break;
                        case COBOLTokenStyle.Constant:
                            symbols.push(new vscode.SymbolInformation(token.description, vscode.SymbolKind.Constant, container, lrange));
                            break;
                    }
                }
            }
            catch (e) {
                logMessage("Failed " + e + " on " + JSON.stringify(token));
            }
        }
        return symbols;
    }
}