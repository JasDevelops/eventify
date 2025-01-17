import React from 'react';
import { render } from '@testing-library/react';
import CitySearch from '../components/CitySearch';
import userEvent from '@testing-library/user-event';
import { extractLocations, getEvents } from '../api';

describe('<CitySearch /> component', () => {
	let CitySearchComponent;

	beforeEach(async () => {
		const allEvents = await getEvents();
		const allLocations = extractLocations(allEvents);

		CitySearchComponent = render(
			<CitySearch
				allLocations={allLocations}
				onCityChange={() => {}}
			/>
		);
	});

	test('renders text input', () => {
		const cityTextBox = CitySearchComponent.queryByRole('textbox');
		expect(cityTextBox).toBeInTheDocument();
		expect(cityTextBox).toHaveClass('city');
	});

	test('suggestions list is hidden by default', () => {
		const suggestionList = CitySearchComponent.queryByRole('list');
		expect(suggestionList).not.toBeInTheDocument();
	});

	test('renders a list of suggestions when city textbox gains focus', async () => {
		const user = userEvent.setup();
		const cityTextBox = CitySearchComponent.queryByRole('textbox');
		await user.click(cityTextBox);
		const suggestionList = CitySearchComponent.queryByRole('list');
		expect(suggestionList).toBeInTheDocument();
		expect(suggestionList).toHaveClass('suggestions');
	});

	test('updates list of suggestions correctly when user types in city textbox', async () => {
		const user = userEvent.setup();
		const cityTextBox = CitySearchComponent.queryByRole('textbox');
		await user.type(cityTextBox, 'Berlin');

		const suggestions = CitySearchComponent.container.querySelectorAll('li');
		const expectedSuggestions = ['Berlin, Germany', 'See all cities'];
		expect(suggestions).toHaveLength(expectedSuggestions.length);
		expect(suggestions[0].textContent).toBe('Berlin, Germany');
		expect(suggestions[1].textContent).toBe('See all cities');
	});

	test('renders the suggestions text in the textbox upon clicking on the suggestion', async () => {
		const user = userEvent.setup();
		const cityTextBox = CitySearchComponent.queryByRole('textbox');
		await user.type(cityTextBox, 'Berlin');

		const BerlinGermanySuggestion = CitySearchComponent.queryAllByRole('listitem')[0];
		await user.click(BerlinGermanySuggestion);
		expect(cityTextBox).toHaveValue(BerlinGermanySuggestion.textContent);
	});
});
