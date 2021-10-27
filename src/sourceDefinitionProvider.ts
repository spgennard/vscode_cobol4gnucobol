import * as vscode from "vscode";
import COBOLSourceScanner, { COBOLTokenStyle, COBOLToken } from "./cobolsourcescanner";
import { logMessage } from "./extension";
import { cobolKeywordDictionary } from "./gnuCobolKeywords";
import { VSCOBOLSourceScanner } from "./vscobolscanner";

export class COBOLSourceDefinition implements vscode.DefinitionProvider {

    readonly sectionRegEx = new RegExp("[0-9a-zA-Z][a-zA-Z0-9-_]*");
    readonly variableRegEx = new RegExp("[#0-9a-zA-Z][a-zA-Z0-9-_]*");

    public provideDefinition( document: vscode.TextDocument,
        position: vscode.Position,
        token: vscode.CancellationToken ): vscode.ProviderResult<vscode.Definition> {
        return this.resolveDefinitions(document, position, token);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    private async resolveDefinitions(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): Promise<vscode.Definition> {
        const locations: vscode.Location[] = [];
        let loc;

        const theline = document.lineAt(position.line).text;
        if (theline.match(/.*(perform|thru|go\s*to|until|varying).*$/i)) {
            const qcp: COBOLSourceScanner | undefined = VSCOBOLSourceScanner.getCachedObject(document);
            if (qcp === undefined) {
                return locations;
            }

            loc = this.getSectionOrParaLocation(document, qcp, position);
            if (loc) {
                locations.push(loc);
                return locations;
            }
        }

        /* is it a known variable? */
        if (this.getVariableInCurrentDocument(locations, document, position)) {
            return locations;
        }

        return locations;
    }

    private getSectionOrParaLocation(document: vscode.TextDocument, sf: COBOLSourceScanner, position: vscode.Position): vscode.Location | undefined {
        const wordRange = document.getWordRangeAtPosition(position, this.sectionRegEx);
        const word = wordRange ? document.getText(wordRange) : "";
        if (word === "") {
            return undefined;
        }

        const wordLower = word.toLowerCase();

        try {

            if (sf.sections.has(wordLower)) {
                const token = sf.sections.get(wordLower);
                if (token !== undefined) {
                    const srange = new vscode.Position(token.startLine, token.startColumn);
                    const uri = vscode.Uri.file(token.filename);
                    return new vscode.Location(uri, new vscode.Range(srange, srange));
                }
            }

        }
        catch (e) {
            logMessage((e as Error).message);
        }

        try {
            if (sf.paragraphs.has(wordLower)) {
                const token = sf.paragraphs.get(wordLower);
                if (token !== undefined) {
                    const srange = new vscode.Position(token.startLine, token.startColumn);
                    const uri = vscode.Uri.file(token.filename);
                    return new vscode.Location(uri, new vscode.Range(srange, srange));
                }
            }
        }
        catch (e) {
            logMessage((e as Error).message);
        }
        return undefined;
    }

    private getVariableInCurrentDocument(locations: vscode.Location[], document: vscode.TextDocument, position: vscode.Position): boolean {
        const wordRange = document.getWordRangeAtPosition(position, this.variableRegEx);
        const word = wordRange ? document.getText(wordRange) : "";
        if (word === "") {
            return false;
        }

        const tokenLower: string = word.toLowerCase();
        if (cobolKeywordDictionary.has(tokenLower)) {
            return false;
        }

        const sf: COBOLSourceScanner | undefined = VSCOBOLSourceScanner.getCachedObject(document);
        if (sf === undefined) {
            return false;
        }

        const tokens: COBOLToken[] | undefined = sf.constantsOrVariables.get(tokenLower);
        if (tokens === undefined || tokens.length === 0) {
            return false;
        }

        for (let i = 0; i < tokens.length; i++) {
            const token: COBOLToken = tokens[i];
            if (token.tokenNameLower === "filler") {
                continue;
            }

            switch (token.tokenType) {
                case COBOLTokenStyle.Union:
                    {
                        const srange = new vscode.Position(token.startLine, token.startColumn);
                        const uri = vscode.Uri.file(token.filename);
                        locations.push(new vscode.Location(uri, srange));
                        break;
                    }
                case COBOLTokenStyle.ConditionName:
                    {
                        const srange = new vscode.Position(token.startLine, token.startColumn);
                        const uri = vscode.Uri.file(token.filename);
                        locations.push(new vscode.Location(uri, srange));
                        break;
                    }
                case COBOLTokenStyle.Variable:
                    {
                        const srange = new vscode.Position(token.startLine, token.startColumn);
                        const uri = vscode.Uri.file(token.filename);
                        locations.push(new vscode.Location(uri, srange));
                        break;
                    }
            }
        }

        if (locations.length === 0) {
            return false;
        }
        return true;
    }
}

