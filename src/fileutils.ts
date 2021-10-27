import * as fs from "fs";

export class COBOLFileUtils {
    static readonly isWin32 = process.platform === "win32";

    public static isFile(sdir: string): boolean {
        try {
            if (fs.existsSync(sdir)) {
                return true;
            }
        }
        catch {
            return false;
        }
        return false;
    }
}
