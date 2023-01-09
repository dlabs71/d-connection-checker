import {CheckerConnectionRunner, HostData} from "../../src";
import {HOST_STATUS} from "../../src/constants";

describe("checker connection runner tests", () => {

    let originalTimeout;

    beforeEach(function () {
        originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    });

    afterEach(function () {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    });

    it("runner test 1", (done) => {
        let hosts = [
            HostData.build("ya.ru", 80),
            HostData.build("localhost", 2222),
        ];

        let count = 0;

        let rejectFunc = (host) => {
            console.log("REJECT CONNECTION: ", host);
            count++;
        };

        let REPEAT = 0;
        let PING_TIMEOUT = 2000;
        let RUN_TIMEOUT = 1000;
        let runner = new CheckerConnectionRunner(
            rejectFunc,
            console,
            REPEAT,
            PING_TIMEOUT,
            RUN_TIMEOUT
        );
        runner.setHosts(hosts);
        runner.run();

        setTimeout(() => {
            runner.stop();
        }, PING_TIMEOUT * 2 + RUN_TIMEOUT);

        setTimeout(() => {
            expect(count).toEqual(1);
            done();
        }, PING_TIMEOUT * 3 + RUN_TIMEOUT * 2);
    });

    it("runner test 2", (done) => {
        let hosts = [
            HostData.build("ya.ru", 80),
            HostData.build("localhost", 2222),
        ];

        let count = 0;

        let rejectFunc = (host) => {
            console.log("REJECT CONNECTION: ", host);
            count++;
            host.$status = HOST_STATUS.READY;
            runner.addHost(host);
        };

        let REPEAT = 0;
        let PING_TIMEOUT = 2000;
        let RUN_TIMEOUT = 1000;
        let runner = new CheckerConnectionRunner(
            rejectFunc,
            console,
            REPEAT,
            PING_TIMEOUT,
            RUN_TIMEOUT
        );
        runner.setHosts(hosts);
        runner.run();

        setTimeout(() => {
            runner.stop();
        }, RUN_TIMEOUT * 2);

        setTimeout(() => {
            expect(count).toEqual(2);
            done();
        }, RUN_TIMEOUT * 4);
    });
});