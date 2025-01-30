import {
	getEvents,
	getAccessToken,
	getToken,
	checkToken,
	extractLocations,
	removeQuery,
} from '../api';
import mockData from '../mock-data';

beforeAll(() => {
	global.localStorage = {
		setItem: jest.fn(),
		getItem: jest.fn(),
		removeItem: jest.fn(),
		clear: jest.fn(),
	};
	global.history.pushState = jest.fn();
});

beforeEach(() => {
	jest.clearAllMocks();
	jest.spyOn(global, 'fetch').mockResolvedValue({
		ok: true,
		json: () => Promise.resolve({ access_token: 'mock-access-token' }),
	});
	Object.defineProperty(window.navigator, 'onLine', { writable: true, value: true });
});

describe('extractLocations', () => {
	it('returns an array of unique locations', () => {
		const events = [{ location: 'Berlin' }, { location: 'London' }, { location: 'Berlin' }, {}];
		const result = extractLocations(events);
		expect(result).toEqual(['Berlin', 'London']);
	});

	it('returns empty array if no valid locations', () => {
		const events = [{}, { location: '' }, { something: 'No location' }];
		const result = extractLocations(events);
		expect(result).toEqual([]);
	});
});

describe('removeQuery', () => {
	it('should remove query parameters from the URL', () => {
		Object.defineProperty(window, 'location', {
			writable: true,
			value: {
				protocol: 'http:',
				host: 'example.com',
				pathname: '',
				href: 'http://example.com',
			},
		});
		removeQuery();
		expect(window.location.href).toBe('http://example.com');
	});
});

describe('getEvents', () => {
	it('returns mockData if on localhost', async () => {
		Object.defineProperty(window, 'location', {
			writable: true,
			value: { href: 'http://localhost:3000' },
		});
		const events = await getEvents();
		expect(events).toEqual(mockData);
	});

	it('returns cached events if offline', async () => {
		Object.defineProperty(window.navigator, 'onLine', { value: false });
		localStorage.getItem.mockReturnValue(JSON.stringify([{ location: 'Cached Berlin' }]));
		const events = await getEvents();
		expect(events).toEqual([{ location: 'Cached Berlin' }]);
	});

	it('returns empty array if offline with no cached data', async () => {
		Object.defineProperty(window.navigator, 'onLine', { value: false });
		localStorage.getItem.mockReturnValue(null);
		const events = await getEvents();
		expect(events).toEqual([]);
	});
});

describe('getToken', () => {
	it('throws an error if fetch fails', async () => {
		const code = 'mockCode';
		fetch.mockResolvedValueOnce({
			ok: false,
			status: 500,
			json: () => Promise.resolve({}),
		});
		await expect(getToken(code)).rejects.toThrow('Error fetching access token');
	});

	it('throws if no access_token in the response', async () => {
		const code = 'mockCode';
		fetch.mockResolvedValueOnce({
			ok: true,
			json: () => Promise.resolve({}),
		});
		await expect(getToken(code)).rejects.toThrow('Error fetching access token');
	});

	it('stores and returns the token if present', async () => {
		const code = 'mockCode';
		fetch.mockResolvedValueOnce({
			ok: true,
			json: () => Promise.resolve({ access_token: 'abc123' }),
		});
		const token = await getToken(code);
		expect(token).toBe('abc123');
		expect(localStorage.setItem).toHaveBeenCalledWith('access_token', 'abc123');
	});
});

describe('checkToken', () => {
	it('returns token info if valid', async () => {
		fetch.mockResolvedValueOnce({
			ok: true,
			json: () => Promise.resolve({ user_id: 'abc' }),
		});
		const info = await checkToken('validToken');
		expect(info).toEqual({ user_id: 'abc' });
	});

	it('returns error info if token invalid', async () => {
		fetch.mockResolvedValueOnce({
			ok: true,
			json: () => Promise.resolve({ error: 'invalid_token' }),
		});
		const info = await checkToken('invalidToken');
		expect(info).toEqual({ error: 'invalid_token' });
	});
});

describe('getAccessToken', () => {
	afterEach(() => {
		delete window.location;
	});

	it('uses localStorage token if valid', async () => {
		localStorage.getItem.mockReturnValue('mock-access-token');
		fetch.mockResolvedValueOnce({
			ok: true,
			json: () => Promise.resolve({}),
		});
		const token = await getAccessToken();
		expect(token).toBe('mock-access-token');
	});

	it('redirects to auth URL if no code and no token', async () => {
		localStorage.getItem.mockReturnValue(null);
		Object.defineProperty(window, 'location', {
			writable: true,
			value: {
				href: 'https://example.com',
				search: '',
			},
		});
		fetch.mockResolvedValueOnce({
			ok: true,
			json: () => Promise.resolve({ authUrl: 'https://auth.example.com' }),
		});
		await getAccessToken();
		expect(window.location.href).toBe('https://auth.example.com');
	});

	it('calls getToken if code is in the URL', async () => {
		localStorage.getItem.mockReturnValue(null);
		Object.defineProperty(window, 'location', {
			writable: true,
			value: {
				href: 'https://example.com?code=abc123',
				search: '?code=abc123',
			},
		});
		fetch.mockResolvedValueOnce({
			ok: true,
			json: () => Promise.resolve({ access_token: 'newTokenXYZ' }),
		});
		const token = await getAccessToken();
		expect(token).toBe('newTokenXYZ');
	});
});
