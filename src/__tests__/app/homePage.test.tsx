import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Page from "@/app/page";
import { writeHeapSnapshot } from "v8";

describe("Page", () => {
  it("renders a heading", () => {
    render(<Page />);

    expect(screen.getByText(/hola/i)).toBeInTheDocument();
  });
  it("snapshot", () => {
    const { asFragment } = render(<Page />);
    const firstRender = asFragment();
    expect(firstRender).toMatchSnapshot();
  });
});
