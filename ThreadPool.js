const { Worker } = require('worker_threads');

// 线程池配置，使用Proxy，可以劫持属性的读写，做点事情
const CONFIG = new Proxy({
    MAX_THREAD: 3,
}, {
    get(obj, key) {
        return obj[key];
    },
    set(obj, key, value) {
        obj[key] = value;
        return true;
    }
})
// 内部线程池类，以_开头的key属于内部属性
class ThreadPool {
    constructor() {
        // 任务队列
        this._workQueue = [];
        // 当前线程数
        this._count = 0;
        // 劫持属性存取
        return new Proxy(this, {
            get(obj, key) {
                if (['submit'].includes(key) || /^_/.test(key)) {
                    return obj[key];
                }
                return false;
            },
            set(obj, key, value) {
                if (/^_/.test(key)) {
                    obj[key] = value;
                    return true;
                } 
            }
        }) 
    }

    _newThread(...rest) {
        // todo 新建失败处理
        const worker = new Worker(...rest);
        this._count++;
        worker.on('exit', () => {
            this._count--;
            // 有名额了并且有任务在等待
            if (this._workQueue.length) {
               const {
                   resolve,
                   reject,
                   params,
               } = this._workQueue.shift();
               // 开启线程，并且通知用户
               resolve(this._newThread(...params));
            }
        });
        return worker;
    }
    // 给线程池提交一个任务
    submit(...rest) {
        return new Promise((resolve, reject) => {
            // 还没有达到阈值，则新建线程，否则缓存起来
            if (this._count < CONFIG.MAX_THREAD) {
                resolve(this._newThread(...rest));
            } else {
                this._workQueue.push({resolve, reject, params: rest});
            }
        });
    }
}

const defaultThreadPool = new ThreadPool();
module.exports = {
    ThreadPool,
    defaultThreadPool,
    submit: (...rest) => {
        return defaultThreadPool.submit(...rest);
    },
    CONFIG,
}