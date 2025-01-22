import puppeteer from 'puppeteer';

// Show Hide test

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

	test('User can expand an event to see details', async () => {
		await page.click('.eventContainer .more-btn');
		const eventDetails = await page.$('.eventContainer .eventDetails');
		expect(eventDetails).toBeDefined();
	});
	test('User can collapse an event to hide details', async () => {
		await page.click('.eventContainer .more-btn');
		const eventDetails = await page.$('.eventContainer .eventDetails');
		expect(eventDetails).toBeNull();
	});
});

// Number of events test

describe('Specify number of events to display', () => {
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

	test('Default number of events is displayed (32)', async () => {
		const eventItems = await page.$$('.eventContainer');
		expect(eventItems.length).toBe(32);
	});

	test('User can change the number of events displayed to 5', async () => {
		const inputField = await page.$('#numberOfEvents');
		const submitButton = await page.$('.numberOfEvents-submit');

		await inputField.click({ clickCount: 3 });
		await inputField.type('5');
		await submitButton.click();

		await page.waitForSelector('.eventContainer');

		const eventItems = await page.$$('.eventContainer');
		expect(eventItems.length).toBe(5);
	});

	test('User can change the number of events displayed to 10', async () => {
		const inputField = await page.$('#numberOfEvents');
		const submitButton = await page.$('.numberOfEvents-submit');

		await inputField.click({ clickCount: 3 });
		await inputField.type('10');
		await submitButton.click();

		await page.waitForSelector('.eventContainer');

		const eventItems = await page.$$('.eventContainer');
		expect(eventItems.length).toBe(10);
	});
});
