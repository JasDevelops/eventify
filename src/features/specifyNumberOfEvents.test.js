import { loadFeature, defineFeature } from 'jest-cucumber';
import { render, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import NumberOfEvents from '../components/NumberOfEvents';

const feature = loadFeature('./src/features/specifyNumberOfEvents.feature');

defineFeature(feature, (test) => {
	test('Default number of events displayed', ({ given, when, then }) => {
		let AppComponent;
		given('I have not specified a number of events to display', () => {});
		when('I open the event page', () => {
			AppComponent = render(<App />);
		});
		then('I should see 32 events displayed by default', async () => {
			const AppDOM = AppComponent.container.firstChild;
			const EventListDOM = AppDOM.querySelector('#event-list');

			await waitFor(() => {
				const EventListItems = within(EventListDOM).queryAllByRole('listitem');
				expect(EventListItems).toHaveLength(32);
			});
		});
	});

	test('Change the number of events', ({ given, when, then }) => {
		let AppComponent;
		let AppDOM;
		let EventListDOM;
		let numberOfEventsComponent;

		given('I am viewing the event list', async () => {
			AppComponent = render(<App />);
			AppDOM = AppComponent.container.firstChild;
			EventListDOM = AppDOM.querySelector('#event-list');

			await waitFor(() => {
				const EventListItems = within(EventListDOM).queryAllByRole('listitem');
				expect(EventListItems).toHaveLength(32);
			});
		});
		when('I select the number of events to display (e.g., 5, 10, 20)', async () => {
			const user = userEvent.setup();

			numberOfEventsComponent = render(
				<NumberOfEvents
					updateNumberOfEvents={() => {}}
					currentEventCount={32}
				/>
			);
			const inputElement = numberOfEventsComponent.container.querySelector('#numberOfEvents');
			const submitButton = numberOfEventsComponent.container.querySelector('button');

			await user.clear(inputElement);
			await user.type(inputElement, '5');
			await user.click(submitButton);
		});
		then('I should see the chosen number of events displayed', async () => {
			const inputElement = numberOfEventsComponent.container.querySelector('#numberOfEvents');

			expect(inputElement.value).toBe('5');
		});
	});
});
