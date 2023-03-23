let err = false;

const major = parseInt(/^(\d+)\./.exec(process.versions.node)[1]);

if (major < 6) {
  console.error('\033[1;31m*** Please use node>=6.\033[0;0m');
  err = true;
}

if (!/yarn\.js$|yarnpkg$/.test(process.env['npm_execpath'])) {
  console.error('\033[1;31m*** Please use \'yarn\' to install dependencies.\033[0;0m');
  err = true;
}

if (err) {
  console.error('');
  process.exit(1);
}
