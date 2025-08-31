import { describe, expect, it } from "vitest";
import { generateUUID } from "./uuid.js";

const UUID_V4_LENGTH = 36;
const randomFunctionCallCount = 100;

describe("generateUUID", () => {
  it("should only return strings", () => {
    // when
    const a = "a";
    const uuids = Array.from({ length: randomFunctionCallCount }, generateUUID);

    // then
    uuids.forEach((uuid) => {
      expect(typeof uuid).toBe("string");
    });
  });

  it(`should return strings with a length of ${UUID_V4_LENGTH} characters`, () => {
    // when
    const uuids = Array.from({ length: randomFunctionCallCount }, generateUUID);

    // then
    uuids.forEach((uuid) => {
      expect(uuid).toHaveLength(UUID_V4_LENGTH);
    });
  });

  it("should return strings consisting of five blocks separated by a dash", () => {
    // when
    const uuids = Array.from({ length: randomFunctionCallCount }, generateUUID);

    // then
    uuids.forEach((uuid) => {
      const blocks = uuid.split("-");
      expect(blocks).toHaveLength(5);
    });
  });

  it("should return a string where the first block consists of eight characters", () => {
    // when
    const uuids = Array.from({ length: randomFunctionCallCount }, generateUUID);

    // then
    uuids.forEach((uuid) => {
      const blocks = uuid.split("-");
      expect(blocks[0]).toHaveLength(8);
    });
  });

  it("should return a string where the second block consists of four characters", () => {
    // when
    const uuids = Array.from({ length: randomFunctionCallCount }, generateUUID);

    // then
    uuids.forEach((uuid) => {
      const blocks = uuid.split("-");
      expect(blocks[1]).toHaveLength(4);
    });
  });

  it("should return a string where the third block consists of four characters", () => {
    // when
    const uuids = Array.from({ length: randomFunctionCallCount }, generateUUID);

    // then
    uuids.forEach((uuid) => {
      const blocks = uuid.split("-");
      expect(blocks[2]).toHaveLength(4);
    });
  });

  it("should return a string where the fourth block consists of four characters", () => {
    // when
    const uuids = Array.from({ length: randomFunctionCallCount }, generateUUID);

    // then
    uuids.forEach((uuid) => {
      const blocks = uuid.split("-");
      expect(blocks[3]).toHaveLength(4);
    });
  });

  it("should return a string where the fifth block consists of twelve characters", () => {
    // when
    const uuids = Array.from({ length: randomFunctionCallCount }, generateUUID);

    // then
    uuids.forEach((uuid) => {
      const blocks = uuid.split("-");
      expect(blocks[4]).toHaveLength(12);
    });
  });

  it("should return a string where the 15th character is the number 4", () => {
    // when
    const uuids = Array.from({ length: randomFunctionCallCount }, generateUUID);

    // then
    uuids.forEach((uuid) => {
      expect(uuid[14]).toBe("4");
    });
  });

  it("should return a string where the 20th character is one of the following characters: 8, 9, a, or b", () => {
    // when
    const uuids = Array.from({ length: randomFunctionCallCount }, generateUUID);

    // then
    uuids.forEach((uuid) => {
      expect(uuid[19]).toMatch(/[89ab]/);
    });
  });

  it("should return a string only using the following characters: 0-9, a-f, -", () => {
    // when
    const uuids = Array.from({ length: randomFunctionCallCount }, generateUUID);

    // then
    uuids.forEach((uuid) => {
      expect(uuid).toMatch(/^[0-9a-f-]+$/);
    });
  });

  it("should generate unique UUIDs across many calls", () => {
    // when
    const uuids = Array.from({ length: randomFunctionCallCount }, generateUUID);

    // then
    const uniqueUuids = new Set(uuids);
    expect(uniqueUuids.size).toBe(uuids.length);
  });
});
