import { useEffect, useState } from 'react';

const CitySearch = ({ allLocations, onCityChange }) => {
	const [showSuggestions, setShowSuggestions] = useState(false);
	const [query, setQuery] = useState('');
	const [suggestions, setSuggestions] = useState([]);
	const locations = Array.isArray(allLocations) ? allLocations : [];
	const handleInputChanged = (event) => {
		const value = event.target.value;
		let filteredLocations = [];

		if (value) {
			filteredLocations = allLocations.filter((location) =>
				location.toUpperCase().includes(value.toUpperCase())
			);
		}
		if (value === '') {
			filteredLocations = [];
		}

		setQuery(value);
		setSuggestions(filteredLocations);
		onCityChange(value);
	};

	const handleItemClicked = (event) => {
		const value = event.target.textContent;

		if (value === 'See all cities') {
			setQuery('');
			setShowSuggestions(false);
			onCityChange('');
		} else {
			setQuery(value);
			setShowSuggestions(false);
			onCityChange(value);
		}
	};

	useEffect(() => {
		if (locations && locations.length > 0) {
			setSuggestions(locations);
		}
	}, [locations]);

	return (
		<div id="city-search">
			<input
				type="text"
				className="city"
				placeholder="Search for a city"
				value={query}
				onFocus={() => setShowSuggestions(true)}
				onChange={handleInputChanged}
			/>
			{showSuggestions && (
				<ul className="suggestions">
					{suggestions.map((suggestion) => (
						<li
							onClick={handleItemClicked}
							key={suggestion}>
							{suggestion}
						</li>
					))}
					<li
						key="See all cities"
						onClick={handleItemClicked}>
						<b>See all cities</b>
					</li>
				</ul>
			)}
		</div>
	);
};

export default CitySearch;
