import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CoinSelector from './CoinSelector';
import fetchMock from 'jest-fetch-mock';

beforeEach(() => {
  fetchMock.enableMocks();
});

afterEach(() => {
  fetchMock.resetMocks();
});

describe('<CoinSelector />', () => {
  it('should render options from fetched data', async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify({
        body: {
          rates: {
            USD: 1.2,
            EUR: 0.85,
            GBP: 0.75,
          },
        },
      })
    );

    render(<CoinSelector />);

    await waitFor(() => {
      expect(screen.getByText('USD')).toBeInTheDocument();
      expect(screen.getByText('EUR')).toBeInTheDocument();
      expect(screen.getByText('GBP')).toBeInTheDocument();
    });
  });

  it('should display selected value', async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify({
        body: {
          rates: {
            USD: 1.2,
            EUR: 0.85,
          },
        },
      })
    );

    render(<CoinSelector />);

    await waitFor(() => screen.getByText('USD'));

    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'USD' } });

    expect(screen.getByText('Selected Coin:')).toBeInTheDocument();
    expect(screen.getByText('USD')).toBeInTheDocument();
  });
});