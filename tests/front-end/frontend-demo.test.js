beforeAll(async () => {
  await page.goto(process.env.TEST_URL, { waitUntil: 'domcontentloaded' });
});

describe('Test homepage of google search', () => {
  test('It should have a button for users to begin searching', async () => {
    // This class is exposed from the google search page; hence predefined.
    // Take note this is for demo purposes only.
    const srchButtonTxt = await page.$eval('.gNO89b', dom => dom.value);
    expect(srchButtonTxt).toBe('Google Search');
  });
});
