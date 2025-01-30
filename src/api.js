import mockData from './mock-data';

/**
 *
 * @param {*} events:
 * The following function should be in the “api.js” file.
 * This function takes an events array, then uses map to create a new array with only locations.
 * It will also remove all duplicates by creating another new array using the spread operator and spreading a Set.
 * The Set will remove all duplicates from the array.
 */
export const extractLocations = (events) => {
	const extractedLocations = events.map((event) => event.location).filter((location) => location);
	const locations = [...new Set(extractedLocations)];
	return locations;
};
export const getToken = async (code) => {
	try {
		const encodeCode = encodeURIComponent(code);
		const response = await fetch(
			`https://2t7qhk7s68.execute-api.eu-central-1.amazonaws.com/dev/api/token/${encodeCode}`
		);
		if (!response.ok) {
			throw new Error(`HTTP error! Status: ${response.status}`);
		}
		const result = await response.json();
		const { access_token } = result;

		if (access_token) {
			localStorage.setItem('access_token', access_token);
			return access_token;
		} else {
			throw new Error('Access token is missing in response.');
		}
	} catch (error) {
		console.error('Error fetching access token:', error);
		throw new Error('Error fetching access token');
	}
};
export const checkToken = async (accessToken) => {
	const response = await fetch(
		`https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${accessToken}`
	);
	const result = await response.json();
	return result;
};
export const removeQuery = () => {
	let newurl;
	if (window.history.pushState && window.location.pathname) {
		newurl = window.location.protocol + '//' + window.location.host + window.location.pathname;
		window.history.pushState('', '', newurl);
	} else {
		newurl = window.location.protocol + '//' + window.location.host;
		window.history.pushState('', '', newurl);
	}
};

export const getEvents = async () => {
	if (!navigator.onLine) {
		const events = localStorage.getItem('lastEvents');
		console.warn('User is offline. Using cached events.');
		return events ? JSON.parse(events) : [];
	}

	if (window.location.href.startsWith('http://localhost')) {
		return mockData;
	}
	const token = await getAccessToken();
	if (token) {
		removeQuery();

		const url =
			'https://2t7qhk7s68.execute-api.eu-central-1.amazonaws.com/dev/api/get-events' + '/' + token;

		try {
			const response = await fetch(url);

			if (response.ok) {
				const result = await response.json();

				if (result && result.events) {
					localStorage.setItem('lastEvents', JSON.stringify(result.events));
					return result.events;
				} else {
					return [];
				}
			} else {
				console.warn('Response not OK. Falling back to offline data.');
				const cachedEvents = localStorage.getItem('lastEvents');
				if (cachedEvents) {
					return JSON.parse(cachedEvents);
				}
				return [];
			}
		} catch (error) {
			console.error('Error fetching events:', error);

			const cachedEvents = localStorage.getItem('lastEvents');
			if (cachedEvents) {
				console.warn('Using cached events due to fetch error.');
				return JSON.parse(cachedEvents);
			}

			return [];
		}
	}

	return [];
};

export const getAccessToken = async () => {
	const accessToken = localStorage.getItem('access_token');
	const tokenCheck = accessToken && (await checkToken(accessToken));

	if (!accessToken || tokenCheck.error) {
		localStorage.removeItem('access_token');
		const searchParams = new URLSearchParams(window.location.search);
		const code = searchParams.get('code');
		if (!code) {
			const response = await fetch(
				'https://2t7qhk7s68.execute-api.eu-central-1.amazonaws.com/dev/api/get-auth-url'
			);
			const result = await response.json();
			const { authUrl } = result;
			window.location.href = authUrl;
		}
		return code && getToken(code);
	}
	return accessToken;
};
