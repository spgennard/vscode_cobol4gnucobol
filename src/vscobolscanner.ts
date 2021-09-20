import * as vscode from 'vscode';

import COBOLSourceScanner, { EmptyCOBOLSourceScannerEventHandler } from './cobolsourcescanner';
import { VSCodeSourceHandler } from './vscodesourcehandler';
import { VSExternalFeatures } from './vsexternalfeatures';

export class VSCOBOLSourceScanner {
    private static cache = new Map<string,COBOLSourceScanner>();

     public static getCachedObject(document: vscode.TextDocument): COBOLSourceScanner|undefined {
        let cachedSource = VSCOBOLSourceScanner.cache.get(document.fileName);
        if (cachedSource !== undefined) {
            if (cachedSource.sourceHandler.getDocumentVersionId() ===  BigInt(document.version)) {
                return cachedSource;
            }

            VSCOBOLSourceScanner.cache.delete(document.fileName);
            cachedSource = undefined;
        }

        const sf = COBOLSourceScanner.ParseUncached(new VSCodeSourceHandler(document,false, undefined),false, new EmptyCOBOLSourceScannerEventHandler(), new VSExternalFeatures());
        VSCOBOLSourceScanner.cache.set(document.fileName, sf);
        return sf;
    }
}