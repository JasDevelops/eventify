import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const NumberOfEvents = ({ updateNumberOfEvents, currentEventCount }) => {
	const [eventCount, setEventCount] = useState(currentEventCount || 32);

	useEffect(() => {
		if (currentEventCount !== undefined) {
			setEventCount(currentEventCount);
		}
	}, [currentEventCount]);

	const handleInputChange = (e) => {
		const value = e.target.value ? Math.max(0, parseInt(e.target.value, 10)) : 0;
		setEventCount(value);
	};

	const handleSubmit = () => {
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
};

export default NumberOfEvents;
