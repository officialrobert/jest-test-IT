const { spawn } = require('child_process');

class Core {
  onSystem = (cmd, op) => {
    return new Promise((resolve, reject) => {
      const result = { state: 0, value: null };
      try {
        if (cmd === 0) {
          result.msg = 'Error: No command parameter received';
          reject(result);
        }
        const forJest = !op.inherit && op.jestTest;
        const child = spawn(cmd, {
          shell: true,
          env: { ...process.env, ...(forJest && { TEST_URL: op.url }) },
          ...(op.inherit && { stdio: 'inherit' }),
        });

        child.on('error', errdata => {
          result.state = 1;
          result.value = errdata;
          reject(result);
        });

        child.on('exit', (code, signal) => {
          result.value = { code, signal };
          result.msg = 'Success: Process on exit';
          resolve(result);
        });

        if (forJest) {
          /**
           * Only for jest related commands
           */

          child.stderr.setEncoding('utf8');

          child.stderr.on('data', data => {
            if (!result.jestData) result.jestData = [data];
            else result.jestData.push(data);
          });
        }
      } catch (err) {
        result.state = 1;
        result.value = err;
        result.msg = 'Error: Caught via exception handling';
        reject(result);
      }
    });
  };
}

export default new Core();
