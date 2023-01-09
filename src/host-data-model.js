import { HOST_STATUS } from './constants';

export function generateId(host, port) {
    return `${host}:${port}`;
}

export class HostData {
    $id = null;

    $status = null;

    host = null;

    port = null;

    addedData = {};

    constructor(host, port, addedData = {}) {
        this.host = host;
        this.port = port;
        this.$id = generateId(host, port);
        this.$status = HOST_STATUS.READY;
        this.addedData = addedData;
    }

    static build(host, port, addedData = {}) {
        return new HostData(host, port, addedData);
    }
}
