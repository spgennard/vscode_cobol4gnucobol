"use strict";

import { DecorationOptions, Range, TextEditor, Position, window, ThemeColor, TextDocument, workspace, TextEditorDecorationType } from "vscode";
import { ESourceFormat } from "./externalfeatures";
import { VSCOBOLSourceScanner } from "./vscobolscanner";

const trailingSpacesDecoration: TextEditorDecorationType = window.createTextEditorDecorationType({
    light: {
        // backgroundColor: "rgba(255,0,0,1)",
        // color: "rgba(0,0,0,1)",
        color: new ThemeColor("editorLineNumber.foreground"),
        backgroundColor: new ThemeColor("editor.background"),
        textDecoration: "solid"
    },
    dark: {
        // backgroundColor: "rgba(255,0,0,1)",
        // color: "rgba(0,0,0,1)"
        color: new ThemeColor("editorLineNumber.foreground"),
        backgroundColor: new ThemeColor("editor.background"),
        textDecoration: "solid"
    }

});

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export async function updateDecorations(activeTextEditor: TextEditor | undefined) {
    if (!activeTextEditor) {
        return;
    }

    const doc: TextDocument = activeTextEditor.document;
    const decorationOptions: DecorationOptions[] = [];

    if (activeTextEditor.document.languageId !== "GnuCOBOL") {
        activeTextEditor.setDecorations(trailingSpacesDecoration, decorationOptions);
        return;
    }

    const gcp = VSCOBOLSourceScanner.getCachedObject(doc);
    let sf: ESourceFormat = ESourceFormat.unknown;
    if (gcp === undefined) {
        return;
    }
    sf = gcp.sourceFormat;

    // use the known file format from the scan itself
    switch (sf) {
        case ESourceFormat.free:
        case ESourceFormat.variable:
        case ESourceFormat.unknown:
            activeTextEditor.setDecorations(trailingSpacesDecoration, decorationOptions);
            return;
    }


    // fixed format from here onwards...
    const lineLimit = workspace.getConfiguration("editor").get<number>("maxTokenizationLineLength", 20000);
    const maxLinesInFile = doc.lineCount;
    let maxLines = maxLinesInFile;
    if (maxLines > lineLimit) {
        maxLines = lineLimit;
    }

    for (let i = 0; i < maxLines; i++) {
        const lineText = doc.lineAt(i);
        const line = lineText.text;

        // only do it, if we have no tabs on the line..
        const containsTab = line.indexOf("\t");

        if (containsTab === -1) {
            if (line.length >= 6) {
                const startPos = new Position(i, 0);
                const endPos = new Position(i, 6);
                const decoration = { range: new Range(startPos, endPos) };
                decorationOptions.push(decoration);
            }

            if (line.length > 72) {
                const startPos = new Position(i, 72);
                // only colour 72-80
                const endPos = new Position(i, (line.length < 80 ? line.length : 80));
                const decoration = { range: new Range(startPos, endPos) };
                decorationOptions.push(decoration);
            }
        }
    }

    activeTextEditor.setDecorations(trailingSpacesDecoration, decorationOptions);
}

