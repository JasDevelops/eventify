import { useState } from 'react';
import PropTypes from 'prop-types';

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
		<div className="eventContainer">
			<div className="eventInfo">
				<h2>{event.summary}</h2>
				<div className="eventLess">
					<p>Location: {event.location || 'No location provided'}</p>
					<p>Start: {startTime}</p>
					<p>End: {endTime}</p>
				</div>
			</div>
			<button
				data-testid={`more-btn-${event.id}`}
				aria-label="More or Less info"
				className="more-btn"
				onClick={() => setShowDetails(!showDetails)}>
				{showDetails ? 'Less info' : 'More info'}
			</button>
			{showDetails && <p className="eventDetails">{event.description}</p>}
		</div>
	);
};

Event.propTypes = {
	event: PropTypes.shape({
		id: PropTypes.string.isRequired,
		summary: PropTypes.string.isRequired,
		location: PropTypes.string,
		start: PropTypes.shape({
			dateTime: PropTypes.string,
		}),
		end: PropTypes.shape({
			dateTime: PropTypes.string,
		}),
		description: PropTypes.string,
	}),
};

export default Event;
