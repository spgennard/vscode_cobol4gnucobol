import { ESourceFormat } from "./externalfeatures";
import ISourceHandler from "./isourcehandler";

function isNumber(value: string | number): boolean {
    if (value.toString().length === 0) {
        return false;
    }
    return !isNaN(Number(value.toString()));
}


const inline_sourceformat: string[] = [">>source format"];

function isValidFixedLine(line: string): boolean {
    if (line.length >= 7) {
        switch (line[6]) {
            case "*": return true;
            case "D": return true;
            case "/": return true;
            case " ": return true;
            case "-": return true;
        }
    }

    return false;
}


const undocumented_feature = false;

export function getCOBOLSourceFormat(doc: ISourceHandler): ESourceFormat {
    const langid = doc.getLanguageId();

    let linesWithJustNumbers = 0;
    let linesWithIdenticalAreaB = 0;
    const maxLines = doc.getLineCount() > 10 ? 10 : doc.getLineCount();
    let defFormat = ESourceFormat.unknown;

    let prevRightMargin = "";
    let validFixedLines = 0;
    let skippedLines = 0;
    let linesGT80 = 0;

    for (let i = 0; i < maxLines; i++) {

        let lineText = doc.getLineTabExpanded(i);
        if (lineText === undefined) {
            break;
        }
        
        lineText = lineText.trimRight();
        if (lineText.length === 0) {
            skippedLines++;
            continue;
        }

        const line = lineText.toLowerCase();
        const validFixedLine = isValidFixedLine(line);
        if (validFixedLine) {
            validFixedLines++;
        }

        // non-acu
        if (defFormat === ESourceFormat.unknown) {
            const newcommentPos = line.indexOf("*>");
            if (newcommentPos !== -1 && defFormat === ESourceFormat.unknown) {
                defFormat = ESourceFormat.unknown;
            }
        }

        let pos4sourceformat_after = 0;
        for (let isf = 0; isf < inline_sourceformat.length; isf++) {
            const pos4sourceformat = line.indexOf(inline_sourceformat[isf]);
            if (pos4sourceformat !== -1) {
                pos4sourceformat_after = pos4sourceformat + inline_sourceformat[isf].length + 1;
                break;
            }
        }

        // does it contain a inline comments? no
        if (pos4sourceformat_after === 0) {
            if (line.length > 80) {
                defFormat = ESourceFormat.free;
                linesGT80++;
                continue;
            } else {
                if (isValidFixedLine(line)) {
                    if (line.length > 72) {
                        const rightMargin = line.substr(72).trim();

                        if (prevRightMargin === rightMargin) {
                            linesWithIdenticalAreaB++;
                        } else {
                            if (isNumber(rightMargin)) {
                                linesWithJustNumbers++;
                            }
                        }

                        prevRightMargin = rightMargin;
                    }
                } else {
                    // if we cannot be sure, then let the default be variable
                    defFormat = ESourceFormat.free;
                }
            }
            continue;
        } else {
            // got a inline comment,yes
            const line2right = line.substr(pos4sourceformat_after);

            if (line2right.indexOf("fixed") !== -1) {
                return ESourceFormat.fixed;
            }
            if (line2right.indexOf("free") !== -1) {
                return ESourceFormat.free;
            }
            if (undocumented_feature && line2right.indexOf("variable") !== -1) {
                return ESourceFormat.variable;
            }
        }
    }

    if (linesGT80 === 0 && (validFixedLines + skippedLines === maxLines)) {
        return ESourceFormat.fixed;
    }

    //it might well be...
    if (linesWithJustNumbers > 7 || linesWithIdenticalAreaB > 7) {
        return ESourceFormat.fixed;
    }

    return defFormat;
}

