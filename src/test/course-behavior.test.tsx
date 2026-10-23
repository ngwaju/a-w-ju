import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Simulator, WEEKS } from "@/components/course";
import { META } from "@/components/site-nav";

afterEach(() => { cleanup(); vi.useRealTimers(); });

describe("Course requirements", () => {
  it("uses the Thursday course time and room", () => {
    expect(META).toEqual(["THU 16:15", "HG", "SPRACHE: GERMAN"]);
  });
  it("includes every week, with Week 12 as a holiday", () => {
    expect(WEEKS.map(([week]) => week)).toEqual(["14", "13", "12", "11", "10", "09", "08", "07", "06", "05", "04", "03", "02", "01"]);
    expect(WEEKS.find(([week]) => week === "12")?.[2]).toBe("Holiday");
    expect(WEEKS.at(-1)?.[2]).toBe("Einführung in A&W");
  });
});

describe("Simulator controls", () => {
  it("advances, resets and resets progress when changing algorithms", () => {
    render(<Simulator />);
    fireEvent.click(screen.getByRole("button", { name: "01 Tarjan" }));
    fireEvent.click(screen.getByRole("button", { name: "Step" }));
    expect(screen.getByLabelText("Fortschritt").textContent).toContain("STEP 002");
    fireEvent.click(screen.getByRole("button", { name: "Reset" }));
    expect(screen.getByLabelText("Fortschritt").textContent).toContain("STEP 001");
    fireEvent.click(screen.getByRole("button", { name: "Step" }));
    fireEvent.click(screen.getByRole("button", { name: "02 Euler Tour" }));
    expect(screen.getByLabelText("Fortschritt").textContent).toContain("STEP 001");
    expect(screen.getByRole("heading", { name: "Euler Tour" })).toBeDefined();
  });
  it("plays frames and stops when paused", () => {
    vi.useFakeTimers();
    render(<Simulator />);
    fireEvent.click(screen.getByRole("button", { name: "01 Tarjan" }));
    fireEvent.click(screen.getByRole("button", { name: "Play" }));
    act(() => { vi.advanceTimersByTime(230); });
    expect(screen.getByLabelText("Fortschritt").textContent).toContain("STEP 002");
    fireEvent.click(screen.getByRole("button", { name: "Pause" }));
    act(() => { vi.advanceTimersByTime(1000); });
    expect(screen.getByLabelText("Fortschritt").textContent).toContain("STEP 002");
  });
});