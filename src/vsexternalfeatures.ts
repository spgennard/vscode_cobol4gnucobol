/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { logMessage } from "./extension";
import { ESourceFormat, IExternalFeatures } from "./externalfeatures";
import ISourceHandler from "./isourcehandler";
import { getCOBOLSourceFormat } from "./sourceformat";
import { VSCOBOLFileUtils } from "./vsfileutils";

export class VSExternalFeatures implements IExternalFeatures{
    public logMessage(message: string): void {
        logMessage(message);
    }

    public logException(message: string, ex: Error): void {
        logMessage(message);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public logTimedMessage(timeTaken: number, message: string, ...parameters: any[]): boolean {
        return false;
    }

    public performance_now(): number {
        return 0;
    }

    public expandLogicalCopyBookToFilenameOrEmpty(filename: string, inDirectory: string): string {
        return "";
    }

    public getCOBOLSourceFormat(doc: ISourceHandler): ESourceFormat {
        return getCOBOLSourceFormat(doc);
    }

    public getFullWorkspaceFilename(sdir: string, sdirMs: BigInt): string | undefined {
        return VSCOBOLFileUtils.getFullWorkspaceFilename(sdir, sdirMs);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public setWorkspaceFolders(_folders: string[]) {
        //
    }

    public getWorkspaceFolders(): string[] {
        return [];
    }
}