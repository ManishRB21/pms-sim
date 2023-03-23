const fs = require('fs');
const path = require('path');
const cp = require('child_process');
const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';

function init() {
  const configPath = path.join(process.cwd(), '/resource/pms/config.json');

  const args = [];
  args.push('run');
  args.push('init');

  if (!fs.existsSync(configPath)) {
    console.log('\033[1;36m*** Configuration initializing... \033[0;0m');

    const result = cp.spawnSync(npm, args, {
      stdio: 'inherit',
    });

    if (result.error || result.status !== 0) {
      process.exit(1);
    }
  }
}

function build() {
  console.log('\033[1;36m*** Build pms-simulator... \033[0;0m');

  const args = [];
  args.push('run');
  args.push('build');

  const result = cp.spawnSync(npm, args, {
    stdio: 'inherit',
  });

  if (result.error || result.status !== 0) {
    process.exit(1);
  }
}

init();
build();
