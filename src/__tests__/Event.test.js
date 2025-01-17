import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import mockData from '../mock-data.js';
import Event from '../components/Event';

describe('<Event /> component', () => {
	let EventComponent;
	const event = mockData && mockData[0];

	beforeEach(() => {
		EventComponent = render(<Event event={event} />);
	});

	test('renders title', () => {
		const eventTitle = EventComponent.queryByText(event.summary);
		expect(eventTitle).toBeInTheDocument();
	});

	test('renders start time', () => {
		expect(EventComponent.queryByText(mockData[0].created)).toBeInTheDocument;
	});

	test('renders location', () => {
		expect(EventComponent.queryByText(mockData[0].location)).toBeInTheDocument;
	});

	test('renders "More info" button', () => {
		const detailButton = EventComponent.queryByText('More info');
		expect(detailButton).toBeInTheDocument();
	});

	test("event's details hidden by default", () => {
		const eventDetails = EventComponent.container.querySelector('.eventDetails');
		expect(eventDetails).not.toBeInTheDocument();
	});

	test('user clicks "More info" button', async () => {
		const user = userEvent.setup();

		const showDetailButton = EventComponent.queryByText('More info');
		await user.click(showDetailButton);

		const eventDetails = EventComponent.container.querySelector('.eventDetails');
		expect(eventDetails).toBeInTheDocument();
	});

	test('user clicks "Less info" button', async () => {
		const user = userEvent.setup();

		// Click "More info button first
		const showDetailButton = EventComponent.queryByText('More info');
		await user.click(showDetailButton);

		// Then click "Less info" button
		const hideDetailButton = EventComponent.queryByText('Less info');
		await user.click(hideDetailButton);

		const eventDetails = EventComponent.container.querySelector('.eventDetails');
		expect(eventDetails).not.toBeInTheDocument();
	});
	test('renders fallback message when event is null', () => {
		const { getByText } = render(<Event event={null} />);
		expect(getByText('No event data available')).toBeInTheDocument();
	});
});
