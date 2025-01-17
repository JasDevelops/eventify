import React, { useState, useEffect } from 'react';

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
		<div>
			<label htmlFor="numberOfEvents">Number of Events</label>
			<input
				type="number"
				id="numberOfEvents"
				value={eventCount}
				onChange={handleInputChange}
				role="textbox"
			/>
			<button onClick={handleSubmit}>Submit</button>
		</div>
	);
};

export default NumberOfEvents;
