import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router";
import { EditOwner } from "./EditOwner";
import { api } from "../../lib/api";
import "@testing-library/jest-dom";

vi.mock("../../lib/api", () => ({
  api: {
    getOwnerById: vi.fn(),
    updateOwner: vi.fn(),
  },
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe("EditOwner Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders loading initially", () => {
    (api.getOwnerById as any).mockImplementation(() => new Promise(() => {}));

    render(
      <MemoryRouter initialEntries={["/admin/edit/1"]}>
        <Routes>
          <Route path="/admin/edit/:id" element={<EditOwner />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  });

  it("renders owner not found if api fails", async () => {
    (api.getOwnerById as any).mockRejectedValueOnce(new Error("error"));

    render(
      <MemoryRouter initialEntries={["/admin/edit/1"]}>
        <Routes>
          <Route path="/admin/edit/:id" element={<EditOwner />} />
        </Routes>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText("Owner not found")).toBeInTheDocument();
    });
  });

  it("renders form with owner details", async () => {
    const mockOwner = {
      id: "1",
      name: "John Doe",
      businessName: "Doe Tech",
      category: "Technology",
      city: "Bangalore",
      state: "KA",
      phone: "9876543210",
      email: "john@doe.com",
      image: "",
      description: "Cool tech",
    };

    (api.getOwnerById as any).mockResolvedValueOnce(mockOwner);

    render(
      <MemoryRouter initialEntries={["/admin/edit/1"]}>
        <Routes>
          <Route path="/admin/edit/:id" element={<EditOwner />} />
        </Routes>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText("Edit Owner")).toBeInTheDocument();
    });
  });
});
