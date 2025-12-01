import { describe, expect, it } from "vitest";
import { generateUUIDv4 } from "./uuid.js";
import { RANDOM_FUNCTION_TEST_CALL_COUNT } from "../misc/testgenConstants.js";

const UUID_V4_LENGTH = 36;

describe("generateUUIDv4", () => {
  it("should only return strings", { repeats: RANDOM_FUNCTION_TEST_CALL_COUNT }, () => {
    // when
    const uuid = generateUUIDv4();

    // then
    expect(typeof uuid).toBe("string");
  });

  it(
    `should return strings with a length of ${UUID_V4_LENGTH} characters`,
    { repeats: RANDOM_FUNCTION_TEST_CALL_COUNT },
    () => {
      // when
      const uuid = generateUUIDv4();

      // then
      expect(uuid).toHaveLength(UUID_V4_LENGTH);
    }
  );

  it(
    "should return strings consisting of five blocks separated by a dash",
    { repeats: RANDOM_FUNCTION_TEST_CALL_COUNT },
    () => {
      // when
      const uuid = generateUUIDv4();

      // then
      const blocks = uuid.split("-");
      expect(blocks).toHaveLength(5);
    }
  );

  it(
    "should return a string where the first block consists of eight characters",
    { repeats: RANDOM_FUNCTION_TEST_CALL_COUNT },
    () => {
      // when
      const uuid = generateUUIDv4();

      // then
      const blocks = uuid.split("-");
      expect(blocks[0]).toHaveLength(8);
    }
  );

  it(
    "should return a string where the second block consists of four characters",
    { repeats: RANDOM_FUNCTION_TEST_CALL_COUNT },
    () => {
      // when
      const uuid = generateUUIDv4();

      // then
      const blocks = uuid.split("-");
      expect(blocks[1]).toHaveLength(4);
    }
  );

  it(
    "should return a string where the third block consists of four characters",
    { repeats: RANDOM_FUNCTION_TEST_CALL_COUNT },
    () => {
      // when
      const uuid = generateUUIDv4();

      // then
      const blocks = uuid.split("-");
      expect(blocks[2]).toHaveLength(4);
    }
  );

  it(
    "should return a string where the fourth block consists of four characters",
    { repeats: RANDOM_FUNCTION_TEST_CALL_COUNT },
    () => {
      // when
      const uuid = generateUUIDv4();

      // then
      const blocks = uuid.split("-");
      expect(blocks[3]).toHaveLength(4);
    }
  );

  it(
    "should return a string where the fifth block consists of twelve characters",
    { repeats: RANDOM_FUNCTION_TEST_CALL_COUNT },
    () => {
      // when
      const uuid = generateUUIDv4();

      // then
      const blocks = uuid.split("-");
      expect(blocks[4]).toHaveLength(12);
    }
  );

  it(
    "should return a string where the 15th character is the number 4",
    { repeats: RANDOM_FUNCTION_TEST_CALL_COUNT },
    () => {
      // when
      const uuid = generateUUIDv4();

      // then
      expect(uuid[14]).toBe("4");
    }
  );

  it(
    "should return a string where the 20th character is one of the following characters: 8, 9, a, or b",
    { repeats: RANDOM_FUNCTION_TEST_CALL_COUNT },
    () => {
      // when
      const uuid = generateUUIDv4();

      // then
      expect(uuid[19]).toMatch(/[89ab]/);
    }
  );

  it(
    "should return a string only using the following characters: 0-9, a-f, -",
    { repeats: RANDOM_FUNCTION_TEST_CALL_COUNT },
    () => {
      // when
      const uuid = generateUUIDv4();

      // then
      expect(uuid).toMatch(/^[0-9a-f-]+$/);
    }
  );

  it("should generate unique UUIDs across many calls", () => {
    // when
    const uuids = Array.from({ length: RANDOM_FUNCTION_TEST_CALL_COUNT }, generateUUIDv4);

    // then
    const uniqueUuids = new Set(uuids);
    expect(uniqueUuids.size).toBe(uuids.length);
  });
});
