import { getToken, getEvents, extractLocations } from '../api';

jest.mock('../api', () => ({
	getEvents: jest.fn(),
	extractLocations: jest.fn(),
	getToken: jest.fn(),
}));
beforeEach(() => {
	global.fetch = jest.fn().mockResolvedValueOnce({
		json: jest.fn().mockResolvedValueOnce({ access_token: 'mock-access-token' }),
	});
	Object.defineProperty(global, 'localStorage', {
		value: {
			setItem: jest.fn(),
			getItem: jest.fn(),
			removeItem: jest.fn(),
		},
		writable: true,
	});
});
beforeAll(() => {
	process.env.CLIENT_ID = 'mock-client-id';
	process.env.CLIENT_SECRET = 'mock-client-secret';
	process.env.CALENDAR_ID = 'mock-calendar-id';
});

describe('API functions', () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('getEvents', () => {
		it('should fetch events successfully', async () => {
			const mockEvents = [{ event: 'mock event' }];
			getEvents.mockResolvedValue(mockEvents);
			const events = await getEvents();
			expect(events).toEqual(mockEvents);
		});

		it('should return empty array when no locations are found', async () => {
			const noLocationData = [{ location: '' }];
			getEvents.mockResolvedValue(noLocationData);
			extractLocations.mockImplementation((events) => {
				return events.map((event) => event.location).filter((location) => location);
			});
			const events = await getEvents();
			const locations = extractLocations(events);
			expect(locations).toEqual([]);
		});
	});

	describe('getToken', () => {
		it('should store the token in localStorage and return the token', async () => {
			const mockCode = 'mockAuthCode';
			const mockResponse = { access_token: 'mocked_token' };

			const token = await getToken(mockCode);

			expect(fetch).toHaveBeenCalledTimes(1);
			expect(fetch).toHaveBeenCalledWith(
				`https://2t7qhk7s68.execute-api.eu-central-1.amazonaws.com/dev/api/token/${encodeURIComponent(mockCode)}`
			);
			expect(token).toBe(mockResponse.access_token);
			expect(localStorage.getItem('access_token')).toBe(mockResponse.access_token);
		});
	});
});
