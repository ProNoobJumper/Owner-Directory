import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { Home } from "./Home";
import { api } from "../lib/api";
import "@testing-library/jest-dom";

vi.mock("../lib/api", () => ({
  api: {
    searchOwners: vi.fn(),
  },
}));

describe("Home Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders loading state initially", () => {
    (api.searchOwners as any).mockResolvedValue({
      content: [],
      totalElements: 0,
      totalPages: 0,
    });
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>,
    );

    expect(screen.getAllByText(/Loading.../i).length).toBeGreaterThan(0);
  });

  it("renders owners after fetching", async () => {
    const mockOwners = [
      {
        id: "1",
        name: "John Doe",
        businessName: "Doe Plumbing",
        category: "Plumbing",
        city: "Mumbai",
        state: "MH",
        rating: 4.5,
        reviewCount: 10,
        description: "Great plumbing",
        image: "test.jpg",
      },
    ];

    (api.searchOwners as any).mockResolvedValue({
      content: mockOwners,
      totalElements: 1,
      totalPages: 1,
    });

    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText("Doe Plumbing")).toBeInTheDocument();
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      const img = screen.getByRole("img");
      expect(img).toHaveAttribute("loading", "lazy");
    });
  });

  it("shows no owners found message when empty", async () => {
    (api.searchOwners as any).mockResolvedValue({
      content: [],
      totalElements: 0,
      totalPages: 0,
    });

    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(
        screen.getByText(/No owners found matching your criteria/i),
      ).toBeInTheDocument();
    });
  });
});
