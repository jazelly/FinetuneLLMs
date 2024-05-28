const { describe, it } = require("node:test");
const assert = require("node:assert");
const path = require("path");
const { readFilesRecursively } = require("../../utils/files");

const dummyPath = path.resolve(__dirname, "../fixtures/dummyFolder");

describe("utils/files", () => {
  describe("readFilesRecursively", () => {
    it("it must return all files under datasets folder", () => {
      const result = readFilesRecursively(dummyPath);

      const sortedResult = result.slice().sort();

      const expected = [
        {
          name: "dummy2.txt",
          extension: ".txt",
          size: 0,
          lastUpdatedAt: 1716931798397.915,
        },
        {
          name: "dummyText.txt",
          extension: ".txt",
          size: 0,
          lastUpdatedAt: 1716931791098.3196,
        },
        {
          name: "d3.txt",
          extension: ".txt",
          size: 9,
          lastUpdatedAt: 1716933951051.3662,
        },
        {
          name: "d4.txt",
          extension: ".txt",
          size: 0,
          lastUpdatedAt: 1716931818187.9438,
        },
      ];
      const expect = expected.sort();
      assert.strictEqual(JSON.stringify(sortedResult), JSON.stringify(expect));
    });
  });
});
