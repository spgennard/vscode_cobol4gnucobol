/* eslint-disable class-methods-use-this */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import ISourceHandler from "./isourcehandler";

export interface IExternalFeatures {
    logMessage(message: string): void;
    logException(message: string, ex: Error): void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    logTimedMessage(timeTaken: number, message: string, ...parameters: any[]): boolean;
    performance_now(): number;
    expandLogicalCopyBookToFilenameOrEmpty(filename: string, inDirectory: string): string;
    getCOBOLSourceFormat(doc: ISourceHandler): ESourceFormat;
    getFullWorkspaceFilename(sdir: string, sdirMs: BigInt): string | undefined;
    setWorkspaceFolders(folders: string[]):void;
    getWorkspaceFolders(): string[];
}

export enum ESourceFormat {
    unknown = "unknown",
    fixed = "fixed",
    variable = "variable",
    free = "free"
}

export class EmptyExternalFeature implements IExternalFeatures {
    public static readonly Default = new EmptyExternalFeature();


    public logMessage(message: string): void {
        return;
    }

    public logException(message: string, ex: Error): void {
        return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public logTimedMessage(timeTaken: number, message: string, ...parameters: any[]): boolean {
        return false;
    }

    public performance_now(): number {
        return Date.now();
    }

    public expandLogicalCopyBookToFilenameOrEmpty(filename: string, inDirectory: string): string {
        return "";
    }

    public getCOBOLSourceFormat(doc: ISourceHandler): ESourceFormat {
        return ESourceFormat.unknown;
    }

    public getFullWorkspaceFilename(sdir: string, sdirMs: BigInt): string | undefined {
        return undefined;
    }

    public setWorkspaceFolders(_folders: string[]) {
        //
    }

    public getWorkspaceFolders(): string[] {
        return [];
    }
}
