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

    constructor(logger = null) {
        if (logger) {
            this.$log = logger;
        }
    }

    /**
     * Connection store initialization method
     * @param hosts {HostData[]} - connection list
     */
    setHosts(hosts) {
        this.$log.debug('checker-connection: addHosts: hosts=', hosts);
        this.hosts = hosts.reduce((acc, value) => {
            acc[value.$id] = value;
            return acc;
        }, {});
    }

    /**
     * Method for adding one connection to storage
     * @param host {HostData} - data of connection
     */
    addHost(host) {
        this.$log.debug('checker-connection: addHost: host=', host);
        if (!this.hosts) {
            this.hosts = {
                [host.$id]: host,
            };
        } else {
            this.hosts[host.$id] = host;
        }
    }

    /**
     * Method for deleting a connection from storage
     * @param storeId {String} - storage connection ID {@see generateId}
     */
    removeHost(storeId) {
        this.$log.debug('checker-connection: removeHost: storeId=', storeId);
        if (this.hosts) {
            delete this.hosts[storeId];
        }
    }

    /**
     * Method for getting a list of all stored connections
     * @returns {HostData[]}
     */
    getHosts() {
        this.$log.debug('checker-connection: getHosts');
        return Object.values(this.hosts);
    }

    /**
     * Method of obtaining connection by IP and port
     * @param storeId {String} - storage connection ID {@see generateId}
     * @returns {HostData}
     */
    getHost(storeId) {
        return this.hosts[storeId];
    }

    /**
     * Method for setting connection status
     * @param storeId {String} - storage connection ID {@see generateId}
     * @param status {String} - connection status {@see HOST_STATUS}
     */
    setStatusHost(storeId, status) {
        const storedHost = this.hosts[storeId];
        if (storedHost) {
            storedHost.$status = status;
        }
    }
}
