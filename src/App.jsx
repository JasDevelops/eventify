import { useCallback, useEffect, useState } from 'react';
import { getEvents, extractLocations } from './api';

import CitySearch from './components/CitySearch';
import EventList from './components/EventList';
import NumberOfEvents from './components/NumberOfEvents';

import './App.css';

const App = () => {
	const [events, setEvents] = useState([]);
	const [locations, setLocations] = useState([]);
	const [filteredEvents, setFilteredEvents] = useState([]);
	const [eventCount, setEventCount] = useState(32);
	const [loading, setLoading] = useState(true);
	const [currentCity, setCurrentCity] = useState('');

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			const allEvents = await getEvents();
			setEvents(allEvents);
			const allLocations = extractLocations(allEvents);
			setLocations(allLocations);
			setLoading(false);
			setFilteredEvents(allEvents.slice(0, eventCount));
		};
		fetchData();
	}, [eventCount]);

	const filterEvents = useCallback(
		(city, count) => {
			let filtered = events;

			if (city !== '') {
				filtered = events.filter((event) =>
					event.location.toUpperCase().includes(city.toUpperCase())
				);
			}
			setFilteredEvents(filtered.slice(0, count));
		},
		[events]
	);

	useEffect(() => {
		filterEvents(currentCity, eventCount);
	}, [events, currentCity, eventCount, filterEvents]);

	const handleCityChange = (city) => {
		setCurrentCity(city);
		filterEvents(city, eventCount);

		let filtered = events;
		if (city !== '') {
			filtered = events.filter((event) =>
				event.location.toUpperCase().includes(city.toUpperCase())
			);
		}
		setFilteredEvents(filtered.slice(0, eventCount));
	};

	const handleNumberOfEventsChange = (number) => {
		const num = parseInt(number, 10);
		setEventCount(num);

		let filtered = events;
		if (currentCity !== '') {
			filtered = events.filter((event) =>
				event.location.toUpperCase().includes(currentCity.toUpperCase())
			);
		}
		setFilteredEvents(filtered.slice(0, num));
	};

	return (
		<div className="App">
			{loading && <p className="loading">Loading...</p>}
			<div className="filter-container">
				<CitySearch
					allLocations={locations}
					onCityChange={handleCityChange}
				/>
				<NumberOfEvents
					currentEventCount={eventCount}
					updateNumberOfEvents={handleNumberOfEventsChange}
				/>
			</div>
			<EventList events={filteredEvents} />
		</div>
	);
};

export default App;
