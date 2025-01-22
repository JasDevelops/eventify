import puppeteer from 'puppeteer';
jest.mock('puppeteer-core', () => {
	const originalModule = jest.requireActual('puppeteer-core');

	return {
		...originalModule,
		NodeWebSocketTransport: {
			create: (url, headers) => {
				return new Promise((resolve, reject) => {
					const ws = new WebSocket(url);
					ws.onopen = () => resolve(new NodeWebSocketTransport(ws));
					ws.onerror = reject;
				});
			},
		},
	};
});
describe('show/hide an event details', () => {
	let browser;
	let page;

	beforeAll(async () => {
		browser = await puppeteer.launch({
			headless: true,
			executablePath: '/Applications/Chromium.app/Contents/MacOS/Chromium',
			args: ['--disable-web-security', '--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
		});

		page = await browser.newPage();
		await page.goto('http://localhost:5173/');
	});

	afterAll(async () => {
		if (browser) {
			await browser.close();
		}
	});

	test('An event element is collapsed by default', async () => {
		const eventDetails = await page.$('.eventContainer .eventDetails');
		expect(eventDetails).toBeNull();
	});
	/* 
	test('User can expand an event to see details', async () => {
		await page.click('.eventContainer .more-btn');
		const eventDetails = await page.$('.eventContainer .eventDetails');
		expect(eventDetails).toBeDefined();
	}); */

	/* 	test('User can collapse an event to hide details', async () => {
		await page.click('.eventContainer .more-btn');
		const eventDetails = await page.$('.eventContainer .eventDetails');
		expect(eventDetails).toBeNull();
	}); */
});
