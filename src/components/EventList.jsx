import Event from './Event';
import PropTypes from 'prop-types';

const EventList = ({ events }) => {
	return (
		<div className="event-container">
			<ul id="event-list">
				{events.map((event) => (
					<li
						key={event.id}
						className="event-item">
						<Event event={event} />
					</li>
				))}
			</ul>
		</div>
	);
};

EventList.propTypes = {
	events: PropTypes.arrayOf(
		PropTypes.shape({
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
		})
	).isRequired,
};

export default EventList;
