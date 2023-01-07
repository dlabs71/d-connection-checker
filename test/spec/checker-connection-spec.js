import {CheckerConnection, HostData} from "../../src";
import {HOST_STATUS} from "../../src/constants";

describe("checker connection tests", () => {

    it("__pingServer", (done) => {
        let checkerConnection = new CheckerConnection();
        checkerConnection.__pingServer("ya.ru", 80, 2000)
            .then(() => {
                console.log("CONNECTION SUCCESS");
                done();
            })
            .catch((err) => {
                console.log("CONNECTION REFUSE");
                done.fail(err);
            });
    });

    it("checkConnectionByHost 1", (done) => {
        let hosts = [
            HostData.build("ya.ru", 80),
            HostData.build("localhost", 2222),
        ];
        let checkerConnection = new CheckerConnection();
        checkerConnection.setHosts(hosts);

        checkerConnection.checkConnectionByHost(hosts[0])
            .then(() => {
                console.log("CONNECTION SUCCESS");
                done();
            })
            .catch((err) => {
                console.log("CONNECTION REFUSE");
                done.fail(err);
            });
    });

    it("checkConnectionByHost 2", (done) => {
        let hosts = [
            HostData.build("ya.ru", 80),
            HostData.build("localhost", 2222),
        ];
        let checkerConnection = new CheckerConnection();
        checkerConnection.setHosts(hosts);

        checkerConnection.checkConnectionByHost(hosts[1])
            .then(() => {
                console.log("CONNECTION SUCCESS");
                done.fail();
            })
            .catch((err) => {
                console.log("CONNECTION REFUSE");
                done();
            });
    });

    it("checkConnectionById 1", (done) => {
        let hosts = [
            HostData.build("ya.ru", 80),
            HostData.build("localhost", 2222),
        ];
        let checkerConnection = new CheckerConnection();
        checkerConnection.setHosts(hosts);

        checkerConnection.checkConnectionById(hosts[0].$id)
            .then(() => {
                console.log("CONNECTION SUCCESS");
                done();
            })
            .catch((err) => {
                console.log("CONNECTION REFUSE");
                done.fail(err);
            });
    });

    it("checkConnectionById 2", (done) => {
        let hosts = [
            HostData.build("ya.ru", 80),
            HostData.build("localhost", 2222),
        ];
        let checkerConnection = new CheckerConnection();
        checkerConnection.setHosts(hosts);

        checkerConnection.checkConnectionById(hosts[1].$id)
            .then(() => {
                console.log("CONNECTION SUCCESS");
                done.fail();
            })
            .catch((err) => {
                console.log("CONNECTION REFUSE");
                done();
            });
    });

    it("checkConnections", (done) => {
        let hosts = [
            HostData.build("ya.ru", 80),
            HostData.build("localhost", 2222),
        ];
        let checkerConnection = new CheckerConnection();
        checkerConnection.setHosts(hosts);

        let rejectFunc = (host) => {
            console.log("REJECT CONNECTION: ", host);
        };

        checkerConnection.checkConnections(rejectFunc)
            .finally(() => {
                console.log("ALL CONNECTION WAS CHECKED");
                let storedHosts = checkerConnection.getHosts();
                expect(storedHosts[0].$status).toEqual(HOST_STATUS.SUCCESS);
                expect(storedHosts[1].$status).toEqual(HOST_STATUS.ERROR);
                done();
            });
    });
});