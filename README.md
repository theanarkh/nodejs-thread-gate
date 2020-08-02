# thread-gate
we can not use threadpool in nodejs directly , thread-gate try to handle this by controlling thread number.

对nodejs worker_threads的封装。在worker_threads的基础上，加上流量控制功能，最多开启n个子线程，达到阈值，会先缓存任务，等到有子线程退出的时候，再次创建新的子线程。这不是线程池。会有线程的创建和销毁，带有一定的开销。他只是用于控制系统中线程的数量

导出的功能
```
module.exports = {
    // 新建一个流量控制期
    ThreadGate,
    // 默认的流量控制期
    defaultThreadGate,
    // 快捷方式
    submit: (...rest) => {
        return defaultThreadGate.submit(...rest);
    },
    // 最多开启多少个线程等配置
    CONFIG,
}
```

使用例子
```
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
```