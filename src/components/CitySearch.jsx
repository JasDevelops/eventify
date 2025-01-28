import { useEffect, useState, useMemo } from 'react';
import PropTypes from 'prop-types';

const CitySearch = ({ allLocations, onCityChange, setInfoAlert }) => {
	const [showSuggestions, setShowSuggestions] = useState(false);
	const [query, setQuery] = useState('');
	const [suggestions, setSuggestions] = useState([]);

	const locations = useMemo(
		() => (Array.isArray(allLocations) ? allLocations : []),
		[allLocations]
	);

	const handleInputChanged = (event) => {
		const value = event.target.value;
		let filteredLocations = [];
		let infoText = '';

		if (value === '') {
			filteredLocations = [];
		} else {
			filteredLocations = allLocations.filter((location) =>
				location.toUpperCase().includes(value.toUpperCase())
			);
		}
		if (value && filteredLocations.length === 0) {
			infoText = 'We cannot find the city you are looking for. Please try another city.';
		}
		if (value === '') {
			infoText = '';
		}

		setQuery(value);
		setSuggestions(filteredLocations);
		setInfoAlert(infoText);
		onCityChange(value);
	};

	const handleItemClicked = (event) => {
		const value = event.target.textContent;
		setQuery(value === 'See all cities' ? '' : value);
		setShowSuggestions(false);
		onCityChange(value === 'See all cities' ? '' : value);
		setInfoAlert('');
	};

	useEffect(() => {
		if (locations && locations.length > 0) {
			setSuggestions(locations);
		}
	}, [locations]);

	return (
		<div
			id="city-search"
			className="filter-item">
			<label
				htmlFor="city"
				className="city-label">
				Search for a city
			</label>
			<div className="inputAndSubmit">
				<input
					type="text"
					className="city"
					placeholder="Start typing ..."
					value={query}
					onFocus={() => setShowSuggestions(true)}
					onChange={handleInputChanged}
					aria-label="Search for a city"
				/>
				{showSuggestions && (
					<ul className="suggestions">
						{suggestions.map((suggestion) => (
							<li
								onClick={handleItemClicked}
								key={suggestion}
								className="suggestion-item">
								{suggestion}
							</li>
						))}
						<li
							key="See all cities"
							onClick={handleItemClicked}
							className="seeAllCities">
							<strong>See all cities</strong>
						</li>
					</ul>
				)}
			</div>
		</div>
	);
};

CitySearch.propTypes = {
	allLocations: PropTypes.arrayOf(PropTypes.string).isRequired,
	onCityChange: PropTypes.func.isRequired,
	setInfoAlert: PropTypes.func.isRequired,
};

export default CitySearch;
