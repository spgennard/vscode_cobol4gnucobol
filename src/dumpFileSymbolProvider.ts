import * as vscode from 'vscode';


export class DumpFileSymbolProvider implements vscode.DocumentSymbolProvider {

    private getSymbol(container: string, name: string, line: number, lastLine: number, lastLineColumn: number, ownerUri: vscode.Uri): vscode.SymbolInformation {

        const srange = new vscode.Range(new vscode.Position(line, 0), new vscode.Position(lastLine, lastLineColumn));
        const lrange = new vscode.Location(ownerUri, srange);

        return new vscode.SymbolInformation(name, vscode.SymbolKind.Field, container, lrange);

    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public async provideDocumentSymbols(document: vscode.TextDocument, canceltoken: vscode.CancellationToken): Promise<vscode.SymbolInformation[]> {
        const symbols: vscode.SymbolInformation[] = [];

        const ownerUri = document.uri;

        const lastLine = document.lineCount;
        const lastLineColumn = document.lineAt(lastLine - 1).text.length;
        let container = "";
        let lastProgram: vscode.SymbolInformation|undefined = undefined;
        let lastSymbolLine: vscode.SymbolInformation|undefined = undefined;
        for (let i = 0; i < document.lineCount; i++) {
            const line = document.lineAt(i);
            const textText = line.text;

            // small lines or comment lines..
            if (textText.startsWith("*") || textText.length <= 2) {
                continue;
            }

            // new area..
            if (textText.startsWith("Dump Program-Id")) {
                const textWords = textText.split(" ");
                if (textText.length > 5) {
                    container = textWords[2] + "@" + textWords[4];
                    lastProgram = this.getSymbol(container, textWords[2] + "@" + textWords[4], i, i, 1, ownerUri);
                    symbols.push(lastProgram);
                }
                continue;
            }

            // include these items as second level items
            if (textText.startsWith("WORKING-STORAGE") ||
                textText.startsWith("LINKAGE") ||
                textText.startsWith("FD ")) {

                const p = this.getSymbol(container, textText, i, i, 1, ownerUri);
                lastSymbolLine = p;
                symbols.push(p);
                continue;
            }

            // use the "end of dump", as a marker
            if (textText.startsWith("END OF DUMP")) {
                if (lastProgram !== undefined) {
                    const srange = new vscode.Range(new vscode.Position(lastProgram.location.range.start.line, 0), new vscode.Position(i, textText.length));
                    const lrange = new vscode.Location(ownerUri, srange);

                    lastProgram.location = lrange;
                    lastProgram = undefined;
                }
                continue;
            }

            if (lastSymbolLine !== undefined && textText.length > 1) {
                const srange = new vscode.Range(new vscode.Position(lastSymbolLine.location.range.start.line, 0), new vscode.Position(i, textText.length - 1));
                const lrange = new vscode.Location(ownerUri, srange);

                lastSymbolLine.location = lrange;
            }
        }

        return symbols;
    }
}
