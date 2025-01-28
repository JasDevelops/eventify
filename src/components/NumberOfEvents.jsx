import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const NumberOfEvents = ({ updateNumberOfEvents, currentEventCount, setErrorAlert }) => {
	const [eventCount, setEventCount] = useState(currentEventCount || 32);

	useEffect(() => {
		if (currentEventCount !== undefined) {
			setEventCount(currentEventCount);
		}
	}, [currentEventCount]);

	const handleInputChange = (e) => {
		const value = e.target.value;
		if (value === '') {
			setEventCount('');
			setErrorAlert('');
			return;
		}

		if (/^[0-9]*$/.test(value)) {
			const parsedValue = Math.max(0, parseInt(value, 10));
			setEventCount(parsedValue);
			if (parsedValue > 0) {
				setErrorAlert('');
			}
		} else {
			setErrorAlert('Please enter a valid number greater than zero.');
		}
	};

	const handleSubmit = () => {
		if (eventCount === '' || isNaN(eventCount) || eventCount <= 0) {
			setErrorAlert('Please enter a valid number greater than zero.');
			return;
		}

		const maxEventCount = 500;
		if (eventCount > maxEventCount) {
			setErrorAlert(`Number of events cannot exceed ${maxEventCount}.`);
			return;
		}

		updateNumberOfEvents(Number(eventCount));
	};

	return (
		<div className="filter-item">
			<label
				htmlFor="numberOfEvents"
				className="numberOfEvents-label">
				Number of Events
			</label>
			<div className="inputAndSubmit">
				<input
					type="text"
					id="numberOfEvents"
					value={eventCount}
					onChange={handleInputChange}
					role="textbox"
					aria-label="Number of events"
					className="numberOfEvents-input"
				/>
				<button
					onClick={handleSubmit}
					className="numberOfEvents-submit"
					aria-label="Submit number of events">
					Submit
				</button>{' '}
			</div>
		</div>
	);
};

NumberOfEvents.propTypes = {
	updateNumberOfEvents: PropTypes.func.isRequired,
	currentEventCount: PropTypes.number,
	setErrorAlert: PropTypes.func.isRequired,
};

export default NumberOfEvents;
