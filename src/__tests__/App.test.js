import { render, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { getEvents } from '../api';
import App from '../App';

describe('<App /> component', () => {
	let AppDOM;

	beforeEach(async () => {
		AppDOM = render(<App />).container.firstChild;
		await waitFor(() => AppDOM.querySelector('.loading') === null);
	});

	it('renders list of events', async () => {
		const { container } = render(<App />);
		await waitFor(() => container.querySelector('#event-list'));
		expect(container.querySelector('#event-list')).toBeInTheDocument();
	});

	it('render CitySearch', () => {
		expect(AppDOM.querySelector('#city-search')).toBeInTheDocument();
	});

	it('renders NumberOfEvents component', () => {
		const { container } = render(<App />);
		const inputElement = container.firstChild.querySelector('#numberOfEvents');
		expect(inputElement).toBeInTheDocument();
	});

	it('displays loading state initially', () => {
		const { container } = render(<App />);
		expect(container.querySelector('.loading')).toBeInTheDocument();
	});

	it('does not show loading after events are loaded', async () => {
		const { container } = render(<App />);
		await waitFor(() => expect(container.querySelector('.loading')).not.toBeInTheDocument());
	});

	it('filters events when a city is entered', async () => {
		const { container } = render(<App />);

		const cityInput = container.querySelector('#city-search input');
		await userEvent.type(cityInput, 'Berlin');

		await waitFor(() => {
			const events = container.querySelectorAll('.event-item');
			const berlinEvents = Array.from(events).filter((event) =>
				event.textContent.includes('Berlin')
			);
			expect(berlinEvents.length).toBeGreaterThan(0);
		});
		await waitFor(() => {
			expect(container.querySelectorAll('.event-item').length).toBeGreaterThan(0);
		});
	});

	it('does not filter events when no city is entered', async () => {
		const { container } = render(<App />);
		await waitFor(() => {
			const eventsBeforeFiltering = container.querySelectorAll('.event-item');
			expect(eventsBeforeFiltering).toHaveLength(32);
		});

		const cityInput = container.querySelector('#city-search input');
		await userEvent.clear(cityInput);

		await waitFor(() => {
			const eventsAfterClearingInput = container.querySelectorAll('.event-item');
			expect(eventsAfterClearingInput).toHaveLength(32);
		});
	});

	it('filters events based on city', async () => {
		const { container } = render(<App />);
		const inputElement = container.querySelector('#city-search input');

		await userEvent.type(inputElement, 'Berlin');

		await waitFor(() => {
			const events = container.querySelectorAll('.event-item');
			const berlinEvents = Array.from(events).filter((event) =>
				event.textContent.includes('Berlin')
			);
			expect(berlinEvents.length).toBeGreaterThan(0);
		});
	});

	it('filters events based on number of events', async () => {
		const { container } = render(<App />);
		const inputElement = container.querySelector('#numberOfEvents');
		const buttonElement = container.querySelector('button');

		await userEvent.clear(inputElement);
		await userEvent.type(inputElement, '5');
		await userEvent.click(buttonElement);
		await waitFor(() => {
			const eventItems = container.querySelectorAll('.event-item');
			expect(eventItems).toHaveLength(5);
		});
	});

	it('updates the event count when NumberOfEvents component changes value', async () => {
		const { container } = render(<App />);
		const inputElement = container.querySelector('#numberOfEvents');
		const buttonElement = container.querySelector('button');

		await userEvent.clear(inputElement);
		await userEvent.type(inputElement, '10');
		await userEvent.click(buttonElement);
		await waitFor(() => {
			const eventItems = container.querySelectorAll('.event-item');
			expect(eventItems).toHaveLength(10);
		});
	});

	it('filters events based on number of events and city', async () => {
		const { container } = render(<App />);

		const cityInput = container.querySelector('#city-search input');
		await userEvent.type(cityInput, 'Berlin');

		await waitFor(() => {
			const events = container.querySelectorAll('.event-item');
			const berlinEvents = Array.from(events).filter((event) =>
				event.textContent.includes('Berlin')
			);
			expect(berlinEvents.length).toBeGreaterThan(0);
		});

		const inputElement = container.querySelector('#numberOfEvents');
		const buttonElement = container.querySelector('button');

		await userEvent.clear(inputElement);
		await userEvent.type(inputElement, '5');
		await userEvent.click(buttonElement);

		await waitFor(() => {
			const eventItems = container.querySelectorAll('.event-item');
			expect(eventItems).toHaveLength(5);
		});
	});
});
describe('<App /> integration', () => {
	it('renders a list of events matching the city selected by the user', async () => {
		const user = userEvent.setup();
		const AppComponent = render(<App />);
		const AppDOM = AppComponent.container.firstChild;

		const CitySearchDOM = AppDOM.querySelector('#city-search');
		const CitySearchInput = within(CitySearchDOM).queryByRole('textbox');

		await user.type(CitySearchInput, 'Berlin');
		const berlinSuggestionItem = within(CitySearchDOM).queryByText('Berlin, Germany');
		await user.click(berlinSuggestionItem);

		const EventListDOM = AppDOM.querySelector('#event-list');
		const allRenderedEventItems = within(EventListDOM).queryAllByRole('listitem');

		const allEvents = await getEvents();
		const berlinEvents = allEvents.filter((event) => event.location === 'Berlin, Germany');

		expect(allRenderedEventItems).toHaveLength(berlinEvents.length);
		allRenderedEventItems.forEach((event) => {
			expect(event.textContent).toContain('Berlin, Germany');
		});
	});
});
