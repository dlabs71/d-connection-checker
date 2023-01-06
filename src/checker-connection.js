import { createConnection } from 'net';
import {
    DEFAULT_PING_TIMEOUT, DEFAULT_REPEAT, DEFAULT_RUN_TIMEOUT, HOST_STATUS,
} from './constants';
import { StoreHosts } from './store-hosts';

/**
 * Connection availability check class by IP and port
 * If a remote connection is not available, it tries to connect a few more times,
 * each time reducing the timeout in half
 */
export class CheckerConnection {
    /**
     * Connection retry setting
     * @type {number}
     */
    defaultRepeat = 0;

    /**
     * Connection timeout
     * @type {number}
     */
    pingDefaultTimeout = 0;

    /**
     * Logger
     * @type {Console | console}
     */
    $log = console;

    /**
     * Connection storage
     * @type {StoreHosts}
     */
    storeHosts = null;

    /**
     * Function to be called when the connection is unavailable
     * @param host {Object} - connection data
     * {
     *     host: "123.123.123.123",
     *     port: 123,
     *     status: "ERROR",
     *     hostId: 123
     * }
     */
    /* eslint-disable-next-line */
    rejectFunc = (host) => {
    };

    constructor(
        rejectFunc,
        logger = console,
        defaultRepeat = DEFAULT_REPEAT,
        pingDefaultTimeout = DEFAULT_PING_TIMEOUT,
    ) {
        this.defaultRepeat = defaultRepeat;
        this.pingDefaultTimeout = pingDefaultTimeout;
        this.$log = logger;
        this.rejectFunc = rejectFunc;
        this.storeHosts = new StoreHosts(logger);
    }

    /**
     * Class initialization method
     * @param hosts {Array} - list of connections to check
     * @param rejectFunc {Function} - callback function when connection is unavailable
     */
    init(hosts = [], rejectFunc = null) {
        this.$log.debug('checker-connection: init: hosts=', hosts);
        this.storeHosts.setHosts(hosts);
        if (rejectFunc) {
            this.rejectFunc = rejectFunc;
        }
    }

    /**
     * Connectivity test method
     * @param host {String} - IP connections
     * @param port {Number} - connection port
     * @param timeout {Number} - connection timeout
     * @returns {Promise<unknown>}
     * @private
     */
    __pingServer(host, port, timeout) {
        return new Promise((resolve, reject) => {
            this.$log.debug(`checker-connection: __pingServer: host=${host}; port=${port} timeout=${timeout}`);
            let socket = null;
            const timer = setTimeout(() => {
                reject(new Error('timeout'));
                this.$log.debug(`checker-connection: __pingServer: host=${host}; port=${port} end by timeout`);
                socket.end();
            }, timeout);

            socket = createConnection(port, host, () => {
                clearTimeout(timer);
                this.$log.debug(`checker-connection: __pingServer: host=${host}; port=${port} connection is active`);
                resolve();
                socket.end();
            });

            socket.on('error', (err) => {
                this.$log.debug(`checker-connection: __pingServer: host=${host}; port=${port} end by error=`, err);
                clearTimeout(timer);
                reject(err);
            });
        });
    }

    /**
     * Connectivity wrapper method {@see __pingServer}
     * @param host {String} - IP connections
     * @param port {Number} - connection port
     * @param repeat {Number} - number of connection attempts
     * @param timeout {Number} - connection timeout
     * @returns {Promise<unknown>}
     */
    checkConnection(host, port, repeat = null, timeout = null) {
        if (!repeat && repeat !== 0) {
            repeat = this.defaultRepeat;
        }
        if (!timeout) {
            timeout = this.pingDefaultTimeout;
        }
        this.$log.debug(`checker-connection: checkConnection:
                            repeat=${host};
                            port=${port};
                            timeout=${timeout};
                            repeat=${repeat}
                            `);
        return new Promise((resolve, reject) => {
            this.__pingServer(host, port, timeout)
                .then(() => {
                    resolve();
                })
                .catch(() => {
                    const storeHostId = this.storeHosts.generateId({ host, port });
                    const hostData = this.storeHosts.getHost(storeHostId);
                    if (hostData.status !== HOST_STATUS.SUCCESS) {
                        resolve();
                        return;
                    }
                    if (repeat === 0) {
                        reject();
                    } else {
                        this.checkConnection(host, port, repeat - 1, timeout / 2)
                            .then((res) => {
                                resolve(res);
                            })
                            .catch(() => {
                                reject();
                            });
                    }
                });
        });
    }

    /**
     * Connectivity check Promise list method {@see checkConnection} from the list of stored connections
     * @returns {*[]}
     */
    createCheckConnPromises() {
        const promises = [];
        Array.from(this.storeHosts.getHosts()).forEach((item) => {
            if (!item.status || item.status === HOST_STATUS.SUCCESS) {
                promises.push(this.checkConnection(item.host, item.port).catch(() => {
                    const storeHostId = this.storeHosts.generateId(item);
                    this.storeHosts.setStatusHost(storeHostId, HOST_STATUS.ERROR);
                    this.rejectFunc(item);
                }));
            }
        });
        return promises;
    }

    /**
     * Proxy method for establishing connections in storage
     * @param hosts {Array} - connection list
     */
    setHosts(hosts = []) {
        this.storeHosts.setHosts(hosts);
    }

    /**
     * Proxy method for adding a new connection to storage
     * @param host {Object} - connection information
     * {
     *     host: "123.123.123.123",
     *     port: 123,
     *     hostId: 123
     * }
     */
    addHost(host) {
        this.storeHosts.addHost(host);
    }

    /**
     * Proxy method for deleting a connection from storage
     * @param host {Object} - connection information
     * {
     *     host: "123.123.123.123",
     *     port: 123,
     *     hostId: 123
     * }
     */
    removeHost(host) {
        this.storeHosts.removeHost(host);
    }
}

/**
 * Class of periodic connection check in a loop
 * @extends CheckerConnection
 */
export class CheckerConnectionRunner extends CheckerConnection {
    /**
     * Stop flag
     * @type {boolean}
     */
    terminating = false;

    /**
     * Start interval time
     * @type {number}
     */
    runTimeout = DEFAULT_RUN_TIMEOUT;

    constructor(
        rejectFunc,
        logger = console,
        defaultRepeat = DEFAULT_REPEAT,
        pingDefaultTimeout = DEFAULT_PING_TIMEOUT,
        runTimeout = DEFAULT_RUN_TIMEOUT,
    ) {
        super(rejectFunc, logger, defaultRepeat, pingDefaultTimeout);
        this.runTimeout = runTimeout;
    }

    /**
     * Method for validating connections stored in the connection store
     * @returns {Promise<unknown>}
     * @private
     */
    _checkConnections() {
        return new Promise((resolve) => {
            Promise.all(this.createCheckConnPromises())
                .finally(() => {
                    resolve();
                });
        });
    }

    /**
     * Helper method for cyclically running the function passed in the func parameter
     * @param func - handler function
     * @param timeout - start interval time
     * @private
     */
    _loop(func, timeout) {
        const loop = () => {
            setTimeout(() => {
                func().finally(() => {
                    if (!this.terminating) {
                        loop();
                    } else {
                        this.terminating = false;
                    }
                });
            }, timeout);
        };
        return loop();
    }

    /**
     * Loop connection start method
     * @param timeout - start interval time
     */
    run(timeout = null) {
        if (!timeout) {
            timeout = this.runTimeout;
        }
        this.$log.debug('CheckerConnectionRunner: run: timeout=', timeout);
        this._loop(() => this._checkConnections(), timeout);
    }

    /**
     * Stop looping connection checks
     */
    stop() {
        this.$log.debug('CheckerConnectionRunner: stop: terminating=', this.terminating);
        if (!this.terminating) {
            this.terminating = true;
        }
    }
}