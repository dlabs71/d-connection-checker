import { HOST_STATUS } from './constants';

export function generateId(host, port) {
    return `${host}:${port}`;
}

export class HostData {
    $id = null;

    $status = null;

    host = null;

    port = null;

    constructor(host, port) {
        this.host = host;
        this.port = port;
        this.$id = generateId(host, port);
        this.$status = HOST_STATUS.READY;
    }

    static build(host, port) {
        return new HostData(host, port);
    }
}
