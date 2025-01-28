import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NumberOfEvents from '../components/NumberOfEvents';

describe('<NumberOfEvents />', () => {
	let updateNumberOfEvents;
	let setErrorAlert;
	let container;
	let inputElement;
	let submitButton;

	beforeEach(() => {
		updateNumberOfEvents = jest.fn();
		setErrorAlert = jest.fn();

		const renderResult = render(
			<NumberOfEvents
				updateNumberOfEvents={updateNumberOfEvents}
				currentEventCount={32}
				setErrorAlert={setErrorAlert}
			/>
		);
		container = renderResult.container;
		inputElement = container.querySelector('#numberOfEvents');
		submitButton = container.querySelector('button');
	});

	it('contains a textbox with the correct role', () => {
		expect(inputElement).toHaveAttribute('role', 'textbox');
	});

	it('default value is 32', () => {
		expect(inputElement.value).toBe('32');
	});

	it('value changes when user types in it and submits', async () => {
		const user = userEvent.setup();
		expect(inputElement.value).toBe('32');

		await user.clear(inputElement);
		await user.type(inputElement, '10');
		expect(inputElement.value).toBe('10');

		await user.click(submitButton);
		expect(updateNumberOfEvents).toHaveBeenCalledWith(10);
		expect(updateNumberOfEvents).toHaveBeenCalledTimes(1);
	});

	it('updates event count when currentEventCount prop changes', () => {
		const { container } = render(
			<NumberOfEvents
				updateNumberOfEvents={updateNumberOfEvents}
				currentEventCount={50}
				setErrorAlert={setErrorAlert}
			/>
		);
		const inputElement = container.querySelector('#numberOfEvents');
		expect(inputElement.value).toBe('50');
	});
	it('shows error alert when input value is not a valid number', async () => {
		const user = userEvent.setup();
		await user.clear(inputElement);
		await user.type(inputElement, 'invalid');

		await user.click(submitButton);

		expect(setErrorAlert).toHaveBeenCalledWith('Please enter a valid number greater than zero.');
	});

	it('shows error alert when input value is less than or equal to zero', async () => {
		const user = userEvent.setup();
		await user.clear(inputElement);
		await user.type(inputElement, '-1');

		await user.click(submitButton);

		expect(setErrorAlert).toHaveBeenCalledWith('Please enter a valid number greater than zero.');
	});
});
