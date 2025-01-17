import { render, waitFor } from '@testing-library/react';
import React from 'react';

import App from './../App';

describe('<App /> component', () => {
	let AppDOM;
	beforeEach(() => {
		AppDOM = render(<App />).container.firstChild;
	});

	test('renders list of events', async () => {
		const { container } = render(<App />);
		await waitFor(() => container.querySelector('#event-list'));
		expect(container.querySelector('#event-list')).toBeInTheDocument();
	});

	test('render CitySearch', () => {
		expect(AppDOM.querySelector('#city-search')).toBeInTheDocument();
	});
});
