import * as path from 'path';
import Mocha from 'mocha';
import { glob } from "glob";

export async function run(): Promise<void> {
	// Create the mocha test
	const mocha = new Mocha({
		ui: 'tdd',
		color: true
	});

	const testsRoot = path.resolve(__dirname, '..');

	const files = glob.sync("**/**.test.js", { cwd: testsRoot });

	return new Promise((c, e) => {

		// Add files to the test suite
		// Add files to the test suite
		for (const f of files) {
			mocha.addFile(f);
		}
		try {
			// Run the mocha test
			mocha.run((failures: number) => {
				if (failures > 0) {
					e(new Error(`${failures} tests failed.`));
				} else {
					c();
				}
			});
		} catch (err) {
			console.error(err);
			e(err);
		}
	});
}
