const express = require('express');
const childProcess = require('child_process');

const app = express();

app.use(express.static('storybook-static'));

app.listen(6006);

const [node, script, ...args] = process.argv;

const result = childProcess.spawn('jest', args, {
  cwd: process.cwd(),
  env: process.env,
  stdio: 'inherit',
});
result.addListener('close', () => {
  process.exit(result.exitCode);
});
