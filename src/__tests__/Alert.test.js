import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';

jest.mock('../api', () => ({
	getEvents: jest.fn().mockResolvedValue([
		{
			id: 'abc1',
			summary: 'React meetup',
			location: 'Berlin',
			start: { dateTime: '2023-01-01T10:00:00Z' },
			end: { dateTime: '2023-01-01T12:00:00Z' },
			description: 'An awesome event about React.',
		},
		{
			id: 'abc2',
			summary: 'JavaScript gathering',
			location: 'London',
			start: { dateTime: '2023-02-01T11:00:00Z' },
			end: { dateTime: '2023-02-01T13:00:00Z' },
			description: 'A JS-themed event in London.',
		},
	]),
	extractLocations: jest
		.fn()
		.mockImplementation((events) => Array.from(new Set(events.map((event) => event.location)))),
}));

describe('App Alert Integration Tests', () => {
	beforeAll(() => {
		Object.defineProperty(window.navigator, 'onLine', {
			writable: true,
			configurable: true,
			value: true,
		});
	});

	it('shows WarningAlert when user is offline', async () => {
		navigator.onLine = false;
		render(<App />);
		await waitFor(() => {
			expect(
				screen.getByText(
					/The displayed list has been loaded from the cache\. It may not be up to date\./i
				)
			).toBeInTheDocument();
		});
	});

	it('does not show WarningAlert if user is online', async () => {
		navigator.onLine = true;

		render(<App />);
		await waitFor(() => {
			const warningText = screen.queryByText(
				/The displayed list has been loaded from the cache\. It may not be up to date\./i
			);
			expect(warningText).toBeNull();
		});
	});

	it('shows InfoAlert if user types a city that does not exist', async () => {
		navigator.onLine = true;

		render(<App />);
		const cityInput = screen.getByLabelText(/search for a city/i);
		await userEvent.type(cityInput, 'UnknownCity');
		await waitFor(() => {
			expect(
				screen.getByText(/We cannot find the city you are looking for\. Please try another city\./i)
			).toBeInTheDocument();
		});
	});

	it('shows ErrorAlert if user enters invalid number of events', async () => {
		navigator.onLine = true;

		render(<App />);
		const numberInput = screen.getByLabelText(/number of events/i, { selector: 'input' });
		await userEvent.clear(numberInput);

		await userEvent.type(numberInput, 'abc');

		const submitButton = screen.getByLabelText(/number of events/i, { selector: 'button' });
		await userEvent.click(submitButton);
		await waitFor(() => {
			expect(
				screen.getByText(/please enter a valid number greater than zero\./i)
			).toBeInTheDocument();
		});
	});

	it('shows ErrorAlert if user enters a number larger than 500', async () => {
		render(<App />);

		const numberInput = screen.getByLabelText(/number of events/i, { selector: 'input' });
		await userEvent.clear(numberInput);

		await userEvent.type(numberInput, '600');

		const submitButton = screen.getByLabelText(/number of events/i, { selector: 'button' });
		await userEvent.click(submitButton);

		await waitFor(() => {
			expect(screen.getByText(/number of events cannot exceed 500\./i)).toBeInTheDocument();
		});
	});
});
