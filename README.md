# GnuCOBOL Extension

```
#     #
##    #   ####    #####     #     ####   ######
# #   #  #    #     #       #    #    #  #
#  #  #  #    #     #       #    #       #####
#   # #  #    #     #       #    #       #
#    ##  #    #     #       #    #    #  #
#     #   ####      #       #     ####   ######


  #####   ####
    #    #    #
    #    #    #
    #    #    #
    #    #    #
    #     ####


 #####   ######  #####   #####   ######   ####      #      ##     #####  ######
 #    #  #       #    #  #    #  #       #    #     #     #  #      #    #
 #    #  #####   #    #  #    #  #####   #          #    #    #     #    #####
 #    #  #       #####   #####   #       #          #    ######     #    #
 #    #  #       #       #   #   #       #    #     #    #    #     #    #
 #####   ######  #       #    #  ######   ####      #    #    #     #    ######


 #    #   ####    ####    ####   #####   ######
 #    #  #       #    #  #    #  #    #  #
 #    #   ####   #       #    #  #    #  #####
 #    #       #  #       #    #  #    #  #
  #  #   #    #  #    #  #    #  #    #  #
   ##     ####    ####    ####   #####   ######


 ######  #    #   #####  ######  #    #   ####      #     ####   #    #
 #        #  #      #    #       ##   #  #          #    #    #  ##   #
 #####     ##       #    #####   # #  #   ####      #    #    #  # #  #
 #         ##       #    #       #  # #       #     #    #    #  #  # #
 #        #  #      #    #       #   ##  #    #     #    #    #  #   ##
 ######  #    #     #    ######  #    #   ####      #     ####   #    #
```

This extension provide support for the GnuCOBOL language.

To summarize, this extension provides:

- Problem matchers for GnuCOBOL
- COBOL language based on the GnuCOBOL dialect

## GnuCOBOL

The GnuCOBOL syntax is based on the reserved word list from current version, which is v3.1.2 as of 28th November 2021

## Task: Single file compile using GnuCOBOL

The example below shows you how you can create a single task to compile one program using the `cobc` command.

This example is for GnuCOBOL 1-2.x, for GnuCOBOL use $gnucobol3-cob

```json
{
    "version": "2.0.0",
    "tasks": [
        {
            "label": "Compile: cobc (single file)",
            "type": "shell",
            "command": "cobc",
            "args": [
                "-fsyntax-only",
                "-I${workspaceFolder}\\CopyBooks",
                "-I${workspaceFolder}\\CopyBooks\\Public",
                "${file}"
            ],
            "problemMatcher" : "$gnucobol-cobc"
        }
    ]
}
```

## Task: Breakdown of problem matchers

| Product and Version                           | Tools                                                            | Problem matcher(s)                                                     |
|-----------------------------------------------|------------------------------------------------------------------|------------------------------------------------------------------------|
| GnuCOBOL 1-2                                  | *cobc*                                                           | $gnucobol-cobc                                                         |
| GnuCOBOL 3                                    | *cobc*                                                           | $gnucobol3-cobc                                                        |
| GnuCOBOL 3                                    | *cobc* for warnings/errors/notes                                 | $gnucobol3-warning-cobc + $gnucobol3-error-cobc + $gnucobol3-note-cobc |

## Online resources

- Online communities

- [GnuCOBOL Community](https://sourceforge.net/p/gnucobol/discussion/)

- Stack Overflow topics/tags:
  - [COBOL](https://stackoverflow.com/questions/tagged/cobol)
  - [GnuCOBOL](https://stackoverflow.com/questions/tagged/gnucobol)
- [COBOL Programming Language Articles on Reddit](https://www.reddit.com/r/cobol/)
- [Linkedin Learning COBOL Resources](https://www.linkedin.com/learning/topics/cobol)

- wikipedia
  - [COBOL](https://en.wikipedia.org/wiki/COBOL)

## Contributors

I would like to thank the follow contributors for providing patches, fixes, kind words of wisdom and enhancements.

- Kevin Abel of Lincoln, NE, USA
- Simon Sobisch of Germany
