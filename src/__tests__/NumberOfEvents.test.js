import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NumberOfEvents from '../components/NumberOfEvents';

describe('<NumberOfEvents />', () => {
	let updateNumberOfEvents;

	beforeEach(() => {
		updateNumberOfEvents = jest.fn();
	});

	it('contains a textbox with the correct role', () => {
		const { container } = render(
			<NumberOfEvents
				updateNumberOfEvents={updateNumberOfEvents}
				currentEventCount={32}
			/>
		);
		const inputElement = container.firstChild.querySelector('input');
		expect(inputElement).toHaveAttribute('role', 'textbox');
	});

	it('default value is 32', () => {
		const { container } = render(
			<NumberOfEvents
				updateNumberOfEvents={updateNumberOfEvents}
				currentEventCount={32}
			/>
		);
		const inputElement = container.firstChild.querySelector('#numberOfEvents');
		expect(inputElement.value).toBe('32');
	});

	it('value changes when user types in it and submits', async () => {
		const { container } = render(<NumberOfEvents updateNumberOfEvents={updateNumberOfEvents} />);
		const user = userEvent.setup();
		const inputElement = container.firstChild.querySelector('#numberOfEvents');
		const submitButton = container.firstChild.querySelector('button');

		expect(inputElement.value).toBe('32');

		await user.clear(inputElement);
		await user.type(inputElement, '10');
		expect(inputElement.value).toBe('10');

		await user.click(submitButton);
		expect(updateNumberOfEvents).toHaveBeenCalledWith(10);
		expect(updateNumberOfEvents).toHaveBeenCalledTimes(1);
	});

	it('updates event count when currentEventCount prop changes', () => {
		const { rerender, container } = render(
			<NumberOfEvents
				updateNumberOfEvents={updateNumberOfEvents}
				currentEventCount={32}
			/>
		);
		const inputElement = container.querySelector('#numberOfEvents');
		expect(inputElement.value).toBe('32');

		rerender(
			<NumberOfEvents
				updateNumberOfEvents={updateNumberOfEvents}
				currentEventCount={50}
			/>
		);
		expect(inputElement.value).toBe('50');
	});
});
