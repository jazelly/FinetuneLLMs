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
      const expect = ["d4.txt", "d3.txt", "dummy2.txt", "dummyText.txt"].sort();
      assert.strictEqual(JSON.stringify(sortedResult), JSON.stringify(expect));
    });
  });
});
