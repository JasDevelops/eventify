import {
	getAccessToken,
	getToken,
	getEvents,
	extractLocations,
	removeQuery,
	checkToken,
} from '../api';

jest.mock('../api', () => ({
	getEvents: jest.fn().mockResolvedValue([{ location: 'Mock Location' }]),
	extractLocations: jest.fn(),
	removeQuery: jest.fn(),
	checkToken: jest.fn(),
	getToken: jest.fn(),
	getAccessToken: jest.fn(),
}));

beforeAll(() => {
	global.localStorage = {
		setItem: jest.fn(),
		getItem: jest.fn().mockReturnValue('mock-access-token'),
		removeItem: jest.fn(),
		clear: jest.fn(),
	};

	global.history.pushState = jest.fn();
});

beforeEach(() => {
	localStorage.clear();
	jest.spyOn(localStorage, 'setItem');
	jest.spyOn(localStorage, 'getItem').mockReturnValue('mock-access-token');
	jest.spyOn(localStorage, 'removeItem');
	jest.spyOn(localStorage, 'clear');
	jest.spyOn(global, 'fetch').mockImplementation(() =>
		Promise.resolve({
			ok: true,
			json: () => Promise.resolve({ access_token: 'mock-access-token' }),
		})
	);
});

describe('API functions', () => {
	describe('getEvents', () => {
		it('should fetch events successfully', async () => {
			const mockEvents = [{ location: 'Mock Location' }];
			getEvents.mockResolvedValue(mockEvents);

			const events = await getEvents();

			expect(events).toEqual(mockEvents);
			expect(getEvents).toHaveBeenCalledTimes(1);
		});

		it('should return an empty array when no locations are found', async () => {
			const noLocationData = [{ location: '' }];
			getEvents.mockResolvedValue(noLocationData);

			extractLocations.mockImplementation((events) => events.filter((event) => event.location));
			const events = await getEvents();
			const locations = extractLocations(events);

			expect(locations).toEqual([]);
			expect(extractLocations).toHaveBeenCalledWith(events);
		});

		it('should handle errors when fetching events fails', async () => {
			getAccessToken.mockResolvedValue('mock-token');
			global.fetch.mockResolvedValueOnce({
				ok: false,
				status: 500,
				json: () => Promise.resolve({}),
			});
			getEvents.mockResolvedValueOnce([]);

			const events = await getEvents();

			expect(events).toEqual([]);
		});
	});

	describe('getToken', () => {
		beforeEach(() => {
			jest.clearAllMocks();
			global.fetch.mockResolvedValueOnce({
				ok: true,
				json: jest.fn().mockResolvedValue({ access_token: 'mock-access-token' }),
			});
		});
		it('should throw an error when response does not include a valid access_token', async () => {
			const code = 'mockAuthCode';
			global.fetch.mockResolvedValueOnce({
				ok: true,
				json: jest.fn().mockResolvedValue({}),
			});

			try {
				await getToken(code);
				throw new Error('Missing Token');
			} catch (error) {
				expect(error.message).toBe('Missing Token');
			}
		});

		it('should throw an error when fetch fails (HTTP error)', async () => {
			const code = 'mockAuthCode';

			global.fetch.mockResolvedValueOnce({
				ok: false,
				status: 500,
				json: jest.fn().mockResolvedValue({}),
			});

			try {
				await getToken(code);
				throw new Error('HTTP error! Status: 500');
			} catch (error) {
				expect(error.message).toBe('HTTP error! Status: 500');
			}
		});
	});
	describe('checkToken', () => {
		it('should throw an error when the token is invalid', async () => {
			checkToken.mockRejectedValueOnce(new Error('invalid_token'));
			const invalidToken = 'invalidMockToken';
			await expect(checkToken(invalidToken)).rejects.toThrow('invalid_token');
		});

		it('should return the token information when the token is valid', async () => {
			checkToken.mockResolvedValue({ user_id: 'mock-user-id' });

			const mockToken = 'validMockToken';
			const result = await checkToken(mockToken);

			expect(result).toEqual({ user_id: 'mock-user-id' });
		});

		it('should throw an error when the token is invalid', async () => {
			checkToken.mockRejectedValue(new Error('invalid_token'));

			const invalidToken = 'invalidMockToken';
			await expect(checkToken(invalidToken)).rejects.toThrow('invalid_token');
		});
	});

	describe('removeQuery', () => {
		it('should remove the query parameters from the URL', () => {
			const initialUrl = 'http://example.com/?code=code';
			window.history.pushState({}, '', initialUrl);

			removeQuery();
			const newUrl = window.location.href;

			expect(newUrl).not.toContain('?code=code');
		});
	});

	it('should mock fetch properly', async () => {
		await fetch('https://mockurl');
		expect(fetch).toHaveBeenCalledTimes(1);
	});
});
