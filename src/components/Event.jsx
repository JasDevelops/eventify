import { useState } from 'react';

const Event = ({ event }) => {
	const [showDetails, setShowDetails] = useState(false);

	if (!event) {
		return <p>No event data available</p>;
	}

	const formattedTime = new Date(event.start?.dateTime || event.created).toLocaleString();

	return (
		<div>
			<h2>{event.summary}</h2>
			<p>Location: {event.location || 'No location provided'}</p>

			<p>Created: {formattedTime}</p>
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
