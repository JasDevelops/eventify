import React from 'react';
import { render } from '@testing-library/react';
import EventList from '../components/EventList';
import { getEvents } from '../api';

describe('<EventList /> component', () => {
	let EventListComponent;

	beforeEach(async () => {
		const allEvents = await getEvents();

		EventListComponent = render(<EventList events={allEvents} />);
	});

	test('has an element with "list" role', () => {
		expect(EventListComponent.queryByRole('list')).toBeInTheDocument(); //
	});

	test('renders correct number of events', async () => {
		const allEvents = await getEvents();

		EventListComponent.rerender(<EventList events={allEvents} />);
		const listItems = EventListComponent.getAllByRole('listitem');

		expect(listItems).toHaveLength(allEvents.length);
	});
});
