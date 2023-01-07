import {StoreHosts} from "../../src/store-hosts";
import {HostData} from "../../src";
import {HOST_STATUS} from "../../src/constants";

describe("store host tests", () => {

    it("setHosts", () => {
        let hosts = [
            new HostData("host", "1111"),
            new HostData("host", "2222"),
            new HostData("host", "3333")
        ];

        let store = new StoreHosts();
        store.setHosts(hosts);
        expect(store.hosts).toBeDefined();
        expect(store.hosts).toBeInstanceOf(Object);

        let keys = Object.keys(store.hosts);
        expect(keys.length).toEqual(3);
        expect(keys[0]).toEqual(hosts[0].$id);

        let values = Object.values(store.hosts);
        expect(values.length).toEqual(3);
        expect(values[0]).toEqual(hosts[0]);
    });

    it("addHost", () => {
        let hosts = [
            HostData.build("host", "1111"),
            HostData.build("host", "2222"),
            HostData.build("host", "3333")
        ];

        let store = new StoreHosts();
        store.setHosts(hosts);
        let newHost = HostData.build("host", "4444");
        store.addHost(newHost);

        let keys = Object.keys(store.hosts);
        expect(keys.length).toEqual(4);
        expect(keys[3]).toEqual(newHost.$id);

        let values = Object.values(store.hosts);
        expect(values.length).toEqual(4);
        expect(values[3]).toEqual(newHost);
    });

    it("removeHost", () => {
        let firstHost = HostData.build("host", "1111");
        let hosts = [
            firstHost,
            HostData.build("host", "2222"),
            HostData.build("host", "3333")
        ];

        let store = new StoreHosts();
        store.setHosts(hosts);
        store.removeHost(firstHost.$id);

        let keys = Object.keys(store.hosts);
        expect(keys.length).toEqual(2);
        expect(keys[0]).toEqual(hosts[1].$id);
    });

    it("getHosts", () => {
        let hosts = [
            HostData.build("host", "1111"),
            HostData.build("host", "2222"),
            HostData.build("host", "3333")
        ];

        let store = new StoreHosts();
        store.setHosts(hosts);

        let gotHosts = store.getHosts();
        expect(gotHosts).toBeInstanceOf(Array);
        expect(JSON.stringify(gotHosts)).toEqual(JSON.stringify(hosts));
    });

    it("getHost", () => {
        let hosts = [
            HostData.build("host", "1111"),
            HostData.build("host", "2222"),
            HostData.build("host", "3333")
        ];

        let store = new StoreHosts();
        store.setHosts(hosts);

        let host = store.getHost(hosts[1].$id);
        expect(host).toBeInstanceOf(HostData);
        expect(host).toEqual(hosts[1]);
    });

    it("setStatusHost", () => {
        let hosts = [
            HostData.build("host", "1111"),
            HostData.build("host", "2222"),
            HostData.build("host", "3333")
        ];

        let store = new StoreHosts();
        store.setHosts(hosts);

        store.setStatusHost(hosts[1].$id, HOST_STATUS.ERROR);
        let host = store.getHost(hosts[1].$id);
        expect(host).toBeInstanceOf(HostData);
        expect(host.$status).toEqual(HOST_STATUS.ERROR);
    });
});