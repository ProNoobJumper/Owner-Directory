import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router";
import { OwnerDetail } from "./OwnerDetail";
import { api } from "../lib/api";
import "@testing-library/jest-dom";

vi.mock("../lib/api", () => ({
  api: {
    getOwnerById: vi.fn(),
  },
}));

describe("OwnerDetail Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders loading state", () => {
    (api.getOwnerById as any).mockImplementation(() => new Promise(() => {}));

    render(
      <MemoryRouter initialEntries={["/owner/1"]}>
        <Routes>
          <Route path="/owner/:id" element={<OwnerDetail />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  });

  it("renders owner not found", async () => {
    (api.getOwnerById as any).mockRejectedValueOnce(new Error("fail"));

    render(
      <MemoryRouter initialEntries={["/owner/1"]}>
        <Routes>
          <Route path="/owner/:id" element={<OwnerDetail />} />
        </Routes>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText("Owner not found")).toBeInTheDocument();
    });
  });

  it("renders owner information", async () => {
    const mockOwner = {
      id: "1",
      name: "John Doe",
      businessName: "Doe Plumbing",
      category: "Plumbing",
      city: "Mumbai",
      state: "MH",
      address: "45 MG Road, Andheri West",
      zipCode: "400058",
      phone: "9876543210",
      email: "john@doe.com",
      rating: 4.5,
      reviewCount: 12,
      createdAt: new Date().toISOString(),
    };

    (api.getOwnerById as any).mockResolvedValueOnce(mockOwner);

    render(
      <MemoryRouter initialEntries={["/owner/1"]}>
        <Routes>
          <Route path="/owner/:id" element={<OwnerDetail />} />
        </Routes>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText("Doe Plumbing")).toBeInTheDocument();
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getAllByText("Plumbing").length).toBeGreaterThan(0);
    });
  });
});
