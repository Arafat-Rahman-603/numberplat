import { describe, it, expect } from "vitest";
import { parseQuickPlateString, convertToBengaliDigits, getPlateDisplaySegments } from "../plate-parser";

describe("Smart Plate Parser Unit Tests", () => {
  it("converts English digits to Bengali digits", () => {
    expect(convertToBengaliDigits("1234")).toBe("১২৩৪");
    expect(convertToBengaliDigits("017")).toBe("০১৭");
  });

  it("parses 'Dhaka Metro LA 12 3456' properly", () => {
    const result = parseQuickPlateString("Dhaka Metro LA 12 3456");
    expect(result.metroCity).toBe("ঢাকা মেট্রো");
    expect(result.vehicleClass).toBe("ল");
    expect(result.seriesNumber).toBe("১২");
    expect(result.plateNumber).toBe("৩৪৫৬");
  });

  it("parses 'Dhaka-Ha-11-2345' properly", () => {
    const result = parseQuickPlateString("Dhaka-Ha-11-2345");
    expect(result.metroCity).toBe("ঢাকা মেট্রো");
    expect(result.vehicleClass).toBe("হ");
    expect(result.seriesNumber).toBe("১১");
    expect(result.plateNumber).toBe("২৩৪৫");
  });

  it("parses Bengali text 'ঢাকা মেট্রো-ল-১২-৩৪৫৬' properly", () => {
    const result = parseQuickPlateString("ঢাকা মেট্রো-ল-১২-৩৪৫৬");
    expect(result.metroCity).toBe("ঢাকা মেট্রো");
    expect(result.vehicleClass).toBe("ল");
    expect(result.seriesNumber).toBe("১২");
    expect(result.plateNumber).toBe("৩৪৫৬");
  });

  it("parses vehicle class 'থ' (Tho) properly", () => {
    const result = parseQuickPlateString("ঢাকা মেট্রো থ ১২ ৩৪৫৬");
    expect(result.metroCity).toBe("ঢাকা মেট্রো");
    expect(result.vehicleClass).toBe("থ");
    expect(result.seriesNumber).toBe("১২");
    expect(result.plateNumber).toBe("৩৪৫৬");
  });

  it("parses English 'Th' class properly", () => {
    const result = parseQuickPlateString("Dhaka Metro Th 15 7890");
    expect(result.metroCity).toBe("ঢাকা মেট্রো");
    expect(result.vehicleClass).toBe("থ");
    expect(result.seriesNumber).toBe("১৫");
    expect(result.plateNumber).toBe("৭৮৯০");
  });

  it("getPlateDisplaySegments returns default for empty input", () => {
    const res = getPlateDisplaySegments("");
    expect(res.city).toBe("ঢাকা মেট্রো");
    expect(res.vehicleClass).toBe("ল");
    expect(res.series).toBe("১১");
    expect(res.number).toBe("১২৩৪");
  });

  it("getPlateDisplaySegments formats English input to Bengali plate segments", () => {
    const res = getPlateDisplaySegments("Dhaka Metro LA 12 3456");
    expect(res.city).toBe("ঢাকা মেট্রো");
    expect(res.vehicleClass).toBe("ল");
    expect(res.series).toBe("১২");
    expect(res.number).toBe("৩৪৫৬");
  });

  it("getPlateDisplaySegments handles vehicle class 'থ'", () => {
    const res = getPlateDisplaySegments("Dhaka Metro Th 11 1234");
    expect(res.city).toBe("ঢাকা মেট্রো");
    expect(res.vehicleClass).toBe("থ");
    expect(res.series).toBe("১১");
    expect(res.number).toBe("১২৩৪");
  });
});

