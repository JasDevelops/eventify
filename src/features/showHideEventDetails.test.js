import { render, screen, waitFor, within } from '@testing-library/react';
import { defineFeature, loadFeature } from 'jest-cucumber';
import userEvent from '@testing-library/user-event';
import { getEvents } from '../api';
import Event from '../components/Event';
import App from '../App';

const feature = loadFeature('./src/features/showHideEventDetails.feature');

defineFeature(feature, (test) => {
	test('Show event details', ({ given, when, then }) => {
		let events;
		let AppComponent;
		let EventComponent;

		given('I am viewing an event', async () => {
			events = await getEvents();
			AppComponent = render(<App />);

			EventComponent = render(<Event event={events[0]} />);

			const AppDOM = AppComponent.container.firstChild;
			const EventListDOM = AppDOM.querySelector('#event-list');

			await waitFor(() => {
				const EventListItems = within(EventListDOM).queryAllByRole('listitem');
				expect(EventListItems).toHaveLength(32);
			});
		});
		when('I click on the event’s "More Info" button', async () => {
			const moreInfoButton = screen
				.getAllByRole('button')
				.find((button) => button.getAttribute('aria-label') === 'More or Less info');

			await waitFor(() => expect(moreInfoButton).toBeInTheDocument());
			await waitFor(() => expect(moreInfoButton).toBeEnabled());
			userEvent.click(moreInfoButton);
		});

		then('I should see the event details', async () => {
			await waitFor(() => {
				const eventDetails = EventComponent.container.querySelector('.eventDetails');
				expect(eventDetails).not.toBeInTheDocument();
			});
		});
	});
	test('Hide event details', ({ given, when, then }) => {
		let events;
		let EventComponent;

		given('I am viewing the event details', async () => {
			events = await getEvents();

			EventComponent = render(<Event event={events[0]} />);

			const moreInfoButton = await waitFor(() =>
				screen
					.getAllByRole('button')
					.find((button) => button.getAttribute('aria-label') === 'More or Less info')
			);
			await waitFor(() => expect(moreInfoButton).toBeEnabled());
			userEvent.click(moreInfoButton);

			await waitFor(() => {
				const eventDetails = EventComponent.container.querySelector('.eventDetails');
				expect(eventDetails).toBeInTheDocument();
				expect(eventDetails).toBeVisible();
			});
		});

		when('I click on the event’s "Less Info" button', async () => {
			const lessInfoButton = screen
				.getAllByRole('button')
				.find((button) => button.getAttribute('aria-label') === 'More or Less info');
			await waitFor(() => expect(lessInfoButton).toBeEnabled());
			userEvent.click(lessInfoButton);
		});

		then('I should hide the event details', async () => {
			await waitFor(() => {
				const eventDetails = EventComponent.container.querySelector('.eventDetails');
				expect(eventDetails).not.toBeInTheDocument();
			});
		});
	});
});
