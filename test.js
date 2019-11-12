/* global describe, it */
const assert = require("assert");
const { processTopLevelAwait } = require(".");

describe("processTopLevelAwait", () => {
    it("should process statements with leading await keywords", () => {
        assert.strictEqual(processTopLevelAwait("await 123"), "(async () => { return (await 123) })()");
        assert.strictEqual(processTopLevelAwait("await 123;"), "(async () => { return (await 123); })()");
    });

    it("should process statements with await keywords in the middle", () => {
        assert.strictEqual(processTopLevelAwait("foo = await 123"), "(async () => { return (foo = await 123) })()");
        assert.strictEqual(processTopLevelAwait("foo = await 123;"), "(async () => { return (foo = await 123); })()");
        assert.strictEqual(processTopLevelAwait("let foo; foo = await 123;"), "(async () => { void (foo=undefined); return (foo = await 123); })()");
    });

    it("should not process any statement without top level await keyword", () => {
        assert.strictEqual(processTopLevelAwait("let foo = 123"), null);
        assert.strictEqual(processTopLevelAwait("async function () { await 123; }"), null);
    });
});