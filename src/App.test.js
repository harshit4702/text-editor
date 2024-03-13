import { render, screen } from "@testing-library/react";
import App from "./App";

test("Demo editor by Harshit Srivastava", () => {
	render(<App />);
	const linkElement = screen.getByText(/Demo editor by Harshit Srivastava/i);
	expect(linkElement).toBeInTheDocument();
});
