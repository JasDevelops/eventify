import { useCallback, useEffect, useState } from 'react';
import { getEvents, extractLocations } from './api';

import CitySearch from './components/CitySearch';
import EventList from './components/EventList';
import NumberOfEvents from './components/NumberOfEvents';
import CityEventsChart from './components/CityEventsChart';
import EventGenresChart from './components/EventGenresChart';

import { InfoAlert, ErrorAlert, WarningAlert } from './components/Alert';

import './App.css';

const App = () => {
	const [events, setEvents] = useState([]);
	const [locations, setLocations] = useState([]);
	const [filteredEvents, setFilteredEvents] = useState([]);
	const [eventCount, setEventCount] = useState(32);
	const [loading, setLoading] = useState(true);
	const [currentCity, setCurrentCity] = useState('');
	const [infoAlert, setInfoAlert] = useState('');
	const [errorAlert, setErrorAlert] = useState('');
	const [warningAlert, setWarningAlert] = useState('');

	useEffect(() => {
		if (navigator.onLine) {
			setWarningAlert('');
		} else {
			setWarningAlert(
				'The displayed list has been loaded from the cache. It may not be up to date.'
			);
		}
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
			<div className="alerts-container">
				{infoAlert.length ? <InfoAlert text={infoAlert} /> : null}
				{errorAlert.length ? <ErrorAlert text={errorAlert} /> : null}
				{warningAlert.length ? <WarningAlert text={warningAlert} /> : null}
			</div>
			<div className="filter-container">
				<CitySearch
					allLocations={locations}
					onCityChange={handleCityChange}
					setInfoAlert={setInfoAlert}
				/>

				<NumberOfEvents
					currentEventCount={eventCount}
					updateNumberOfEvents={handleNumberOfEventsChange}
					setErrorAlert={setErrorAlert}
				/>
			</div>
			<div className="charts-container">
				<EventGenresChart events={filteredEvents} />
				<CityEventsChart
					allLocations={locations}
					events={filteredEvents}
				/>
			</div>
			<EventList events={filteredEvents} />
		</div>
	);
};

export default App;
