import path from "path";
import fs from "fs";
import { COBOLFileUtils } from "./fileutils";
import { workspace } from "vscode";

export class VSCOBOLFileUtils {
    public static getFullWorkspaceFilename(sdir: string, sdirMs: BigInt): string | undefined {
        const ws = workspace.workspaceFolders;
        if (workspace === undefined || ws === undefined) {
            return undefined;
        }
        for (const folder of ws) {
            if (folder.uri.scheme === 'file') {
                const folderPath = folder.uri.path;
                const possibleFile = path.join(folderPath, sdir);
                if (COBOLFileUtils.isFile(possibleFile)) {
                    const stat4src = fs.statSync(possibleFile, { bigint: true });
                    if (sdirMs === stat4src.mtimeMs) {
                        return possibleFile;
                    }
                }
            }
        }

        return undefined;
    }

    public static getShortWorkspaceFilename(ddir: string): string | undefined {
        const ws = workspace.workspaceFolders;
        if (workspace === undefined || ws === undefined) {
            return undefined;
        }

        const fullPath = path.normalize(ddir);
        let bestShortName = "";
        for (const folder of ws) {
            if (folder.uri.scheme === 'file') {
                const folderPath = folder.uri.path;
                if (fullPath.startsWith(folderPath)) {
                    const possibleShortPath = fullPath.substr(1 + folderPath.length);
                    if (bestShortName.length === 0) {
                        bestShortName = possibleShortPath;
                    } else {
                        if (possibleShortPath.length < possibleShortPath.length) {
                            bestShortName = possibleShortPath;
                        }
                    }
                }
            }
        }

        return bestShortName.length === 0 ? undefined : bestShortName;
    }
}