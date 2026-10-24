
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import Home from "./page";

describe("AI Prompt Generator Homepage", () => {
  it("renders the homepage with the correct initial state", () => {
    render(<Home />);

    expect(
      screen.getByRole("heading", {
        name: "Create better image prompts",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText(
        /Premium black sneakers website banner/i
      )
    ).toBeInTheDocument();

    expect(
      screen.getByText("Your prompt will appear here")
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: /Generate Optimized Prompt/i,
      })
    ).toBeDisabled();
  });

  it("enables the Generate button when a prompt is entered", async () => {
    const user = userEvent.setup();

    render(<Home />);

    const generateButton = screen.getByRole("button", {
      name: /Generate Optimized Prompt/i,
    });

    expect(generateButton).toBeDisabled();

    await user.type(
      screen.getByPlaceholderText(
        /Premium black sneakers website banner/i
      ),
      "Premium sneakers advertisement"
    );

    expect(generateButton).toBeEnabled();
  });
});
