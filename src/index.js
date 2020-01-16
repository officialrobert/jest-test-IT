import Core from './lib/Core';
import * as confRaw from '../config/test-config.json';
import paths from './commons/paths';

const supportedPlatforms = ['win32'];

class Main {
  config = null;

  constructor() {
    if (confRaw.default) this.config = confRaw.default;
    else {
      console.log(
        'Error: please check `test-config.json` file and modify for correct config formatting'
      );
      process.exit(1);
    }
  }

  getTestPaths = () => {
    if (!this.config) return;

    const toTests = this.config.tests;
    let fullPAth = '';

    if (toTests.length > 0) {
      paths.testPaths.forEach(obj => {
        if (toTests.includes(obj.key)) fullPAth += `${obj.path} `;
      });
    }

    return fullPAth.length === 0 ? null : fullPAth;
  };

  start = async () => {
    try {
      const testPaths = this.getTestPaths();
      await Core.onSystem('cls', { inherit: true, jestTest: false });
      await Core.onSystem(
        `echo ${'doing tests on file paths'.toUpperCase()}- ${testPaths}`,
        { inherit: true, jestTest: false }
      );

      if (testPaths === null) {
        console.log('Please provide a valid value(s) for tests in your config');
        process.exit(1);
      } else {
        const res = await Core.onSystem(
          `jest ${testPaths} --json --useStderr --no-color > results.json`,
          {
            inherit: false,
            jestTest: true,
            url: this.config.url || 'https://www.google.com/', // default url === google search homepage
          }
        );

        if (res.jestData) {
          await Core.onSystem(
            `echo TEST RESULTS (please see results.json in FW's directory) -`,
            {
              inherit: true,
              jestTest: false,
            }
          );

          if (this.config.verbose) {
            console.log('VERBOSE IS SET TO TRUE\n\n');
            console.log(res);
          }
        }
      }
    } catch (err) {
      await Core.onSystem(
        `echo ERROR on start - ${
          typeof err === 'object' && err !== null
            ? Object.keys(err).length > 0
              ? JSON.stringify(err)
              : err
            : err
        }`,
        { inherit: true, jestTest: false }
      );
    }
  };
}

if (supportedPlatforms.includes(process.platform))
  (() => {
    const obj = new Main();

    obj.start();
  })();
else {
  console.log('We only have support for OS given - ', supportedPlatforms);
  process.exit(1);
}
