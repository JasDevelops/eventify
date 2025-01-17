import { useState } from 'react';

const Event = ({ event }) => {
	const [showDetails, setShowDetails] = useState(false);

	if (!event) {
		return <p>No event data available</p>;
	}

	const startTime =
		event.start && event.start.dateTime
			? new Date(event.start.dateTime).toLocaleString()
			: 'Start time not available';
	const endTime =
		event.end && event.end.dateTime
			? new Date(event.end.dateTime).toLocaleString()
			: 'End time not available';

	return (
		<div>
			<h2>{event.summary}</h2>
			<p>Location: {event.location || 'No location provided'}</p>
			<p>Start: {startTime}</p>
			<p>End: {endTime}</p>
			<button
				aria-label="More or Less info"
				onClick={() => setShowDetails(!showDetails)}>
				{showDetails ? 'Less info' : 'More info'}
			</button>
			{showDetails && <p className="eventDetails">{event.description}</p>}
		</div>
	);
};

export default Event;
