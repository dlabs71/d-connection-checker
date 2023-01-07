import {generateId, HostData} from "../../src/host-data-model";
import {HOST_STATUS} from "../../src/constants";

describe("host data model tests", () => {

    it("generateId", () => {
        let host = "host";
        let port = 12344;
        let id = generateId(host, port);
        expect(id).toEqual("host:12344");
    });

    it("HostData class", () => {
        let host = "host";
        let port = 12344;
        let hostData = new HostData(host, port);
        expect(hostData).toBeDefined();
        expect(hostData.host).toEqual(host);
        expect(hostData.port).toEqual(port);
        expect(hostData.$id).toEqual("host:12344");
        expect(hostData.$status).toEqual(HOST_STATUS.READY)
    });
});