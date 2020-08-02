# thread-gate
we can not use threadpool in nodejs directly , thread-gate try to handle this by controlling thread number.

对nodejs worker_threads的封装。在worker_threads的基础上，加上流量控制功能，最多开启n个子线程，达到阈值，会先缓存任务，等到有子线程退出的时候，再次创建新的子线程。这不是线程池。会有线程的创建和销毁，带有一定的开销。他只是用于控制系统中线程的数量
