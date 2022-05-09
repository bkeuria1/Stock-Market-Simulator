import { render, screen } from '@testing-library/react';
import Home from './components/Home';

test('render h1 element', () => {
    render(<Home />);
    const linkElement = screen.getByText(/Welcome the Stock Simulator Application!/i);
    expect(linkElement).toBeInTheDocument();
});