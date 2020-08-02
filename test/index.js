const {
    ThreadGate,
    submit,
    CONFIG
} = require('../ThreadGate');
const path = require('path');
const threadGate = new ThreadGate();

async function testSubmit() {
    await submit(path.resolve(__dirname + '/worker.js'))
    await submit(path.resolve(__dirname + '/worker2.js'))
}

async function testThreadGate() {
    await threadGate.submit(path.resolve(__dirname + '/worker.js'))
    await threadGate.submit(path.resolve(__dirname + '/worker2.js'))
}


async function testDefaultThreadGate() {
    await submit(path.resolve(__dirname + '/worker.js'))
    await submit(path.resolve(__dirname + '/worker2.js'))
}

async function testWaitForThread() {
    CONFIG.MAX_THREAD = 3;
    await submit(path.resolve(__dirname + '/worker3.js'))
    await submit(path.resolve(__dirname + '/worker2.js'))
}
// node index 1
process.argv[2] == 1 && testSubmit();
process.argv[2] == 2 && testThreadGate();
process.argv[2] == 3 && testDefaultThreadGate();
process.argv[2] == 4 && testWaitForThread();