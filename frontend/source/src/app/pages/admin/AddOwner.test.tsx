import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { AddOwner } from "./AddOwner";
import { api } from "../../../lib/api";
import "@testing-library/jest-dom";

vi.mock("../../../lib/api", () => ({
  api: {
    createOwner: vi.fn(),
  },
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe("AddOwner Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the form correctly", () => {
    render(
      <MemoryRouter>
        <AddOwner />
      </MemoryRouter>,
    );

    expect(screen.getByText("Add New Owner")).toBeInTheDocument();
    expect(
      screen.getByText("Create a new business owner listing in the directory"),
    ).toBeInTheDocument();
  });
});
