# CHANGELOG


## 0.9.10, origin/main 

## 0.9.9 
* 6a115e8 dev: add notice
* 9566ed8 add more stuff for gnucobol 3.2
* 9bb308f add extra lang-id's, make internal lang id's more descriptive

## 0.9.7 

## 0.9.6 
* 9a03186 fix #13

## 0.9.5 
* f342086 DEBUGGING MODE is shown as comment - Issue Fix #17
* 20654d0 flip to v3.2

## 0.9.4 
* 21940dc Update
* 68913e8 update for mac

## 0.9.3 

## 0.9.2 
* 681d966 Update
* 5f01db0 tweak

## 0.9.1 

## 0.9.0 
* 3ceb24a To quote: as `COB_SCREEN_ESC` is only active with `COB_SCREEN_EXCEPTIONS` this line may be dropped

## 0.8.9 
* 0448e42 lower
* 7730681 Update
* 3267b45 drop quotes from brackets config fix #14

## 0.8.8 
* 47af4ac tweak
* 9ebd47b avoid using module with webpack
* fc79330 add "undocumented" variable ready to be enabled whenever it gets documented, tested and supported
* 7e329d9 tweak syntax for ">> SOURCE" and add a couple more trigger keywords

## 0.8.7 
* 839785a Update
* e5a18fc Update
* 449fa22 Update
* 7318264 tweak

## 0.8.6  CHANGELOG.md
* e60a717 remove variable source format, as this is micro focus feature
* c0b3e3a split syntax into different langs for different versions
* 6a6675a just incase

## 0.8.3  CHANGELOG.md

## 0.8.2  CHANGELOG.md

## 0.8.1  CHANGELOG.md

## 0.8.0  CHANGELOG.md

## 0.7.8  CHANGELOG.md
* 6814ae5 add webpack
* 5d817c4 introduce versioned lang
* f6b64f3 update README.md
* 3ea7d5c continue refactoring
* ff05147 tweak verbs list
* 2c75a93 align keywords/lang with v3.x and when 4.0 is GA and in use, a new version can be created and this can be renamed etc..
* 1ec4bc8 remove non gnucobol related file extensions
* 2384b4b remove more things not present in gnucobol
* da3abff remove features not present in gnucobol
* 3cb68a1 remove items not present in gnucobol
* 3ee7ba1 remove items unknown to standard or not implemented
* 80d5d52 remove FUNCTION BASECONVERT,FUNCTION CONVERT, FUNCTION FIND-STRING, FUNCTION MODULE-NAME as they not part of the draft standard
* 584b692 remove B-SHIFT* as I cannot find it in the draft standard
* 1a08528 woops
* 7edc07c Remove Pro*COBOL matcher as Oracle do not document its use with GnuCOBOL
* 2d2846d remove stuff not needed in .vsix
* 31a555c continue tidyup
* 89012ef more tweaks
* db88e81 Merge branch 'main' of github.com:spgennard/vscode_cobol4gnucobol
* 12cd9e3 Add support for margin decolarations - Fix #10
* 50666fa Create stale.yml
* 1ea1a2e tweak readme
* f9db00c flip quotes and tweak linter
* 51d8f71 flip quotes
* 92ad3b6 add simple support for constant's
* f65a958 Unimplemented features are not considered as some items can still be used as variables - #7
* 183cb47 remove unsed option

## 0.7.7  CHANGELOG.md
* cb46373 add sourcedef provider

## 0.7.6  CHANGELOG.md
* 0ec40b8 update syntax

## 0.7.5  CHANGELOG.md

## 0.7.4  CHANGELOG.md
* 57d2cdd fix release problem

## 0.7.2  CHANGELOG.md
* 2b9c528 Remove acu items Remove duplicates Ensure entries include right terminators

## 0.7.1  CHANGELOG.md
* 1f59075 notify use of extensions that may conflict with this extension

## 0.7.0 add outline view
* aa4eaf4 update engine
* 3289413 add flip code back in
* 01188e0 update lock
* 405545a vscode engine now gives multiple error messages if a command is defined but is not present, so this ends the idea of being able to "soft" consume commands from other extensions

## 0.4.0 merge syntax files

## 0.3.0  CHANGELOG.md
* 5a48498 remove prefer_gnucobol_syntax

## 0.2.0 update for trusted workspace
* 76ed022 upd

## 0.1.5 default to GnuCOBOL syntax (unless turned off

## 0.1.4 add a background to the icon

## 0.1.3 tweak
* d81c845 add icon

## 0.1.2 add a basic symbol provider to help with navigation

## 0.1.0 bring forward the listing file support
* b1f1cfa enable keybindings/menus if bitlang.cobol is present
* be7d657 add laucher

## 0.0.8 add simple gnu cobol dumpfile support
* a5d0ccf add bot
* 0f659b8 Set theme jekyll-theme-hacker

## 0.0.7 not required in the vsix
* ffbb2dc Merge branch 'main' of github.com:spgennard/vscode_cobol4gnucobol into main
* 37bf375 fill out more of package.json
* 3cb3aac Set theme jekyll-theme-minimal

## 0.0.6 okay, nearly ready
* 9f5f27b tweak
* f378c23 try toref
* 5236164 test
* 2dbaf28 Add release scripts - Fix #2
* 7bf56ef bring forward the tests
* be05480 update README.md
* 929f3ac remove dependancy on bitlang.cobol, allowing any extension that provides a COBOL language to work with it.
* 3973eba update readme
* 420bd03 include MIT license
* 7028dc6 remove opencobol support, as it is superceeded by the GnuCOBOL support
* b8ad8b6 cleanup
* a5defff bring forward the gnucobol syntax
* 02df061 initial files
* ca23b79 first item
