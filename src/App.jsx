import React from 'react';
import { useEffect, useState } from 'react';
import { getEvents, extractLocations } from './api';
import CitySearch from './components/CitySearch';
import EventList from './components/EventList';
import Event from './components/Event';

const App = () => {
	const [events, setEvents] = useState([]);
	const [locations, setLocations] = useState([]);
	const [filteredEvents, setFilteredEvents] = useState([]);

	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			const allEvents = await getEvents();
			setEvents(allEvents);
			setFilteredEvents(allEvents);

			const allLocations = extractLocations(allEvents);
			setLocations(allLocations);
			setLoading(false);
		};
		fetchData();
	}, []);

	const handleCityChange = (city) => {
		if (city === '') {
			setFilteredEvents(events);
		} else {
			const filtered = events.filter((event) =>
				event.location.toUpperCase().includes(city.toUpperCase())
			);
			setFilteredEvents(filtered);
		}
	};

	return (
		<div className="App">
			<CitySearch
				allLocations={locations}
				onCityChange={handleCityChange}
			/>
			<EventList events={filteredEvents} />
		</div>
	);
};

export default App;
