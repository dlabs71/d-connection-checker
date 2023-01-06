/**
 * A class that implements a connection store
 */
export class StoreHosts {
    /**
     * Connection storage
     * @type {{}}
     */
    hosts = {};

    /**
     * Logger
     * @type {Console | console}
     */
    $log = console;

    constructor(logger) {
        this.$log = logger;
    }

    /**
     * Connection store ID generation method
     * @param hostData {{host, port}} - data of connection
     * @returns {string} - connection store ID
     */
    generateId(hostData) {
        return `${hostData.host}:${hostData.port}`;
    }

    /**
     * Connection store initialization method
     * @param hosts {Array} - connection list
     */
    setHosts(hosts) {
        this.$log.debug('checker-connection: addHosts: hosts=', hosts);
        this.hosts = hosts.reduce((acc, value) => {
            acc[this.generateId(value)] = value;
            return acc;
        }, {});
    }

    /**
     * Method for adding one connection to storage
     * @param host {{host, port}} - data of connection
     */
    addHost(host) {
        this.$log.debug('checker-connection: addHost: host=', host);
        if (!this.hosts) {
            this.hosts = {
                [this.generateId(host)]: host,
            };
        } else {
            this.hosts[this.generateId(host)] = host;
        }
    }

    /**
     * Method for deleting a connection from storage
     * @param host {{host, port}} - data of connection
     */
    removeHost(host) {
        this.$log.debug('checker-connection: removeHost: host=', host);
        if (this.hosts) {
            delete this.hosts[this.generateId(host)];
        }
    }

    /**
     * Method for getting a list of all stored connections
     * @returns {Object[]}
     */
    getHosts() {
        this.$log.debug('checker-connection: getHosts');
        return Object.values(this.hosts);
    }

    /**
     * Method of obtaining connection by IP and port
     * @param storeId {String} - storage connection ID {@see generateId}
     * @returns {Object}
     */
    getHost(storeId) {
        return this.hosts[storeId];
    }

    /**
     * Method for setting connection status
     * @param storeId {String} - storage connection ID {@see generateId}
     * @param status {String} - connection status
     */
    setStatusHost(storeId, status) {
        const storedHost = this.hosts[storeId];
        if (storedHost) {
            storedHost.status = status;
        }
    }
}
