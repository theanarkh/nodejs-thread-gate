const {
    ThreadPool,
    submit,
    CONFIG
} = require('../ThreadPool');
const path = require('path');
const threadPool = new ThreadPool();

async function testSubmit() {
    await submit(path.resolve(__dirname + '/worker.js'))
    await submit(path.resolve(__dirname + '/worker2.js'))
}

async function testThreadPool() {
    await threadPool.submit(path.resolve(__dirname + '/worker.js'))
    await threadPool.submit(path.resolve(__dirname + '/worker2.js'))
}


async function testDefaultThreadPool() {
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
process.argv[2] == 2 && testThreadPool();
process.argv[2] == 3 && testDefaultThreadPool();
process.argv[2] == 4 && testWaitForThread();