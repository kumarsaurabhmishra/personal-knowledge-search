import { render, screen } from '@testing-library/react';
import App from '../App';

describe('App scaffold', () => {
  it('renders without crashing', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: /notes/i })).toBeInTheDocument();
  });
});