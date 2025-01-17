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
		const formattedTime = new Date(mockData[0].start.dateTime).toLocaleString();
		expect(EventComponent.queryByText(`Start: ${formattedTime}`)).toBeInTheDocument();
	});

	test('renders "Start time not available" when start dateTime is missing', () => {
		const eventWithoutStart = { ...mockData[0], start: {} };
		const { queryByText } = render(<Event event={eventWithoutStart} />);
		expect(queryByText('Start: Start time not available')).toBeInTheDocument();
	});
	test('renders end time', () => {
		const formattedEndTime = new Date(mockData[0].end.dateTime).toLocaleString();
		expect(EventComponent.queryByText(`End: ${formattedEndTime}`)).toBeInTheDocument();
	});

	test('renders "End time not available" when end dateTime is missing', () => {
		const eventWithoutEnd = { ...mockData[0], end: {} };
		const { queryByText } = render(<Event event={eventWithoutEnd} />);
		expect(queryByText('End: End time not available')).toBeInTheDocument();
	});

	test('renders location', () => {
		expect(EventComponent.queryByText(mockData[0].location)).toBeInTheDocument;
	});

	test('renders fallback location message when location is missing', () => {
		const eventWithoutLocation = { ...mockData[0], location: null };
		const { queryByText } = render(<Event event={eventWithoutLocation} />);
		expect(queryByText('Location: No location provided')).toBeInTheDocument();
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

		const showDetailButton = EventComponent.queryByText('More info');
		await user.click(showDetailButton);

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
