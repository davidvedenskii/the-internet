import { test, expect } from '@playwright/test';

test.describe('Broken Images', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/broken_images');
  });

  // Skip layout shift test in Firefox as it doesn't support Layout Instability API
  test.skip(({ browserName }) => browserName === 'firefox', 'Layout Instability API not supported in Firefox');
  
  // Extend timeout for mobile devices
  test.slow(({ isMobile }) => isMobile, 'Mobile devices might need more time');

  test('Page Load Verification', async ({ page }) => {
    // Verify page title
    await expect(page).toHaveTitle('The Internet');
    
    // Verify heading
    const heading = page.locator('h3');
    await expect(heading).toHaveText('Broken Images');
    
    // Verify page layout
    const content = page.locator('.example');
    await expect(content).toBeVisible();
  });

  test('Image Elements Presence', async ({ page }) => {
    // Get all images
    const images = page.locator('img');
    
    // Verify we have the expected number of images
    await expect(images).toHaveCount(4);
    
    // Verify all images have src attributes
    const count = await images.count();
    for (let i = 0; i < count; i++) {
      await expect(images.nth(i)).toHaveAttribute('src', /.+/);
    }
  });

  test('Valid Image Verification', async ({ page, browserName, isMobile }) => {
    // Get the valid image (avatar)
    const validImage = page.locator('img[src*="avatar"]');
    
    // Wait for the image to load with browser-specific timeout
    const timeout = isMobile ? 10000 : 5000;
    await validImage.waitFor({ state: 'attached', timeout });
    
    // Verify natural width and height (valid images should have dimensions)
    const { naturalWidth, naturalHeight, currentSrc } = await validImage.evaluate((img: HTMLImageElement) => ({
      naturalWidth: img.naturalWidth,
      naturalHeight: img.naturalHeight,
      currentSrc: img.currentSrc
    }));
    
    expect(naturalWidth).toBeGreaterThan(0);
    expect(naturalHeight).toBeGreaterThan(0);
    
    // Verify image format support based on browser
    if (browserName === 'webkit') {
      // Safari has better AVIF support
      expect(currentSrc).toBeTruthy();
    }
    
    // Verify image size is appropriate for device
    if (isMobile) {
      // Check if image dimensions are reasonable for mobile
      expect(naturalWidth).toBeLessThanOrEqual(1024);
      expect(naturalHeight).toBeLessThanOrEqual(1024);
    }
  });

  test('Broken Image Detection', async ({ page, browserName }) => {
    // Get all images that are expected to be broken
    const brokenImages = page.locator('img[src*="asdf"]');
    
    // Verify we have the expected number of broken images
    await expect(brokenImages).toHaveCount(1);
    
    // Check each broken image
    const count = await brokenImages.count();
    for (let i = 0; i < count; i++) {
      const image = brokenImages.nth(i);
      
      // Different browsers might handle broken images differently
      const imageState = await image.evaluate((img: HTMLImageElement) => ({
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight,
        // Some browsers might set different properties for broken images
        complete: img.complete,
        error: !img.complete && img.naturalWidth === 0
      }));
      
      switch (browserName) {
        case 'webkit':
          // Safari might handle broken images differently
          expect(imageState.complete).toBe(true);
          expect(imageState.naturalWidth).toBe(0);
          break;
          
        case 'firefox':
          // Firefox has specific broken image handling
          expect(imageState.error).toBe(true);
          break;
          
        default:
          // Chrome/Edge default behavior
          expect(imageState.naturalWidth).toBe(0);
          expect(imageState.naturalHeight).toBe(0);
      }
    }
  });

  test('Image Loading Performance', async ({ page, browserName, isMobile }) => {
    // Enable network tracking
    await page.route('**/*', route => route.continue());
    
    const imageLoadPromises: Promise<Error | null>[] = [];
    const startTime = Date.now();
    
    // Reload page and track image load times
    await Promise.all([
      page.reload(),
      new Promise(resolve => {
        page.on('response', async response => {
          if (response.request().resourceType() === 'image') {
            imageLoadPromises.push(response.finished());
          }
        });
        page.on('load', resolve);
      })
    ]);
    
    // Wait for all image requests to complete
    await Promise.all(imageLoadPromises);
    const loadTime = Date.now() - startTime;
    
    // Adjust threshold based on device type
    const threshold = isMobile ? 8000 : 5000; // Higher threshold for mobile devices
    expect(loadTime).toBeLessThan(threshold);
    
    // Skip layout shift check for Firefox as it doesn't support the API
    if (browserName !== 'firefox') {
      const layoutShifts = await page.evaluate(() => {
        // @ts-ignore (Layout Stability API types)
        return performance.getEntriesByType('layout-shift')?.reduce((sum, shift) => sum + shift.value, 0) ?? 0;
      });
      
      // Different thresholds for mobile vs desktop
      const maxShift = isMobile ? 0.15 : 0.1;
      expect(layoutShifts).toBeLessThan(maxShift);
    }
  });
});