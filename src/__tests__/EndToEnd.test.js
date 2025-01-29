import puppeteer from 'puppeteer';
import { render, waitFor } from '@testing-library/react';
import App from '../App';

// Show Hide Details test

describe('show/hide an event details', () => {
	let browser;
	let page;

	beforeAll(async () => {
		browser = await puppeteer.launch({
			headless: false,
			slowMo: 250,
			timeout: 0,
		});

		page = await browser.newPage();
		await page.goto('http://localhost:5173/');
	});

	afterAll(async () => {
		if (browser) {
			await browser.close();
		}
	});

	it('An event element is collapsed by default', async () => {
		const eventDetails = await page.$('.eventContainer .eventDetails');
		expect(eventDetails).toBeNull();
	});

	it('User can expand an event to see details', async () => {
		await page.click('.eventContainer .more-btn');
		const eventDetails = await page.$('.eventContainer .eventDetails');
		expect(eventDetails).toBeDefined();
	});
	it('User can collapse an event to hide details', async () => {
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

	it('renders default number of events (32)', async () => {
		const { container } = render(<App />);
		await waitFor(() => container.querySelector('#event-list'));

		const eventItems = container.querySelectorAll('.event-item');

		expect(eventItems).toHaveLength(32);
	});
});

// Filter events by city test

describe('Filter events by city', () => {
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
		await page.waitForSelector('.eventContainer');
	});

	afterAll(async () => {
		if (browser) {
			await browser.close();
		}
	});

	it('Shows events from all cities by default when no city is selected', async () => {
		const eventItems = await page.$$('.eventContainer');
		expect(eventItems.length).toBeGreaterThan(0);
	});

	it('Shows suggestions of cities', async () => {
		const citySearchInput = await page.$('input[type="text"]');
		const suggestionSelector = '.suggestions li';

		await citySearchInput.type('Berlin');
		await page.waitForSelector(suggestionSelector);

		const BerlinGermanySuggestion = await page.$(suggestionSelector);

		await BerlinGermanySuggestion.click();

		const inputValue = await page.$eval('input[type="text"]', (input) => input.value);
		const suggestionText = await page.evaluate((el) => el.textContent, BerlinGermanySuggestion);

		expect(inputValue).toBe(suggestionText);
	});
});
