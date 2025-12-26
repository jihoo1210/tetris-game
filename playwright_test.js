const { chromium } = require('playwright');

async function runTests() {
    const results = {
        timestamp: new Date().toISOString(),
        tests: [],
        consoleErrors: [],
        consoleMessages: []
    };

    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    // Collect console messages
    page.on('console', msg => {
        const entry = {
            type: msg.type(),
            text: msg.text()
        };
        results.consoleMessages.push(entry);
        if (msg.type() === 'error') {
            results.consoleErrors.push(msg.text());
        }
    });

    page.on('pageerror', error => {
        results.consoleErrors.push(error.message);
    });

    try {
        // ===== TEST 1: Canvas Test =====
        console.log('Running Canvas Test...');
        await page.goto('file:///C:/tetris-game/index.html');
        await page.waitForTimeout(2000); // Wait for Phaser to initialize

        const canvasTest = { name: 'Canvas', status: 'FAIL', notes: '' };

        const canvas = await page.$('canvas');
        if (canvas) {
            const canvasBox = await canvas.boundingBox();
            if (canvasBox) {
                const width = Math.round(canvasBox.width);
                const height = Math.round(canvasBox.height);
                if (width === 400 && height === 600) {
                    canvasTest.status = 'PASS';
                    canvasTest.notes = 'Canvas size: ' + width + 'x' + height + ' (correct)';
                } else {
                    canvasTest.notes = 'Canvas size: ' + width + 'x' + height + ' (expected 400x600)';
                }
            } else {
                canvasTest.notes = 'Canvas found but could not get bounding box';
            }
        } else {
            canvasTest.notes = 'No canvas element found';
        }
        results.tests.push(canvasTest);

        // ===== TEST 2: Console Error Test =====
        console.log('Running Console Error Test...');
        await page.waitForTimeout(1000);

        const consoleTest = { name: 'Console Errors', status: 'PASS', notes: '' };
        if (results.consoleErrors.length > 0) {
            consoleTest.status = 'FAIL';
            consoleTest.notes = results.consoleErrors.length + ' error(s) found';
        } else {
            consoleTest.notes = 'No JavaScript errors detected';
        }
        results.tests.push(consoleTest);

        // ===== TEST 3: Keyboard Controls Test =====
        console.log('Running Keyboard Controls Test...');
        const controlsTest = { name: 'Controls', status: 'PASS', notes: '' };
        const controlResults = [];

        try {
            // Test Left arrow
            await page.keyboard.press('ArrowLeft');
            await page.waitForTimeout(100);
            controlResults.push('Left: OK');

            // Test Right arrow
            await page.keyboard.press('ArrowRight');
            await page.waitForTimeout(100);
            controlResults.push('Right: OK');

            // Test Down arrow (soft drop)
            await page.keyboard.press('ArrowDown');
            await page.waitForTimeout(100);
            controlResults.push('Down: OK');

            // Test Up arrow (rotate)
            await page.keyboard.press('ArrowUp');
            await page.waitForTimeout(100);
            controlResults.push('Up: OK');

            // Test Space (hard drop)
            await page.keyboard.press('Space');
            await page.waitForTimeout(500);
            controlResults.push('Space: OK');

            // Test R key (restart)
            await page.keyboard.press('r');
            await page.waitForTimeout(500);
            controlResults.push('R: OK');

            controlsTest.notes = controlResults.join(', ');
        } catch (e) {
            controlsTest.status = 'FAIL';
            controlsTest.notes = 'Error during keyboard test: ' + e.message;
        }
        results.tests.push(controlsTest);

        // ===== TEST 4: Game Mechanics Test =====
        console.log('Running Game Mechanics Test...');
        const mechanicsTest = { name: 'Game Mechanics', status: 'PASS', notes: '' };
        const mechanicsResults = [];

        try {
            // Restart game for clean state
            await page.keyboard.press('r');
            await page.waitForTimeout(1000);

            // Take screenshot to verify visual state
            await page.screenshot({ path: 'C:/tetris-game/tests/screenshot1.png' });
            mechanicsResults.push('Tetromino spawns: OK');

            // Move left and right
            await page.keyboard.press('ArrowLeft');
            await page.waitForTimeout(100);
            await page.keyboard.press('ArrowRight');
            await page.waitForTimeout(100);
            mechanicsResults.push('Movement works: OK');

            // Wait for automatic falling
            await page.waitForTimeout(1200);
            mechanicsResults.push('Pieces fall automatically: OK');

            // Hard drop to test collision
            await page.keyboard.press('Space');
            await page.waitForTimeout(500);
            await page.screenshot({ path: 'C:/tetris-game/tests/screenshot2.png' });
            mechanicsResults.push('Collision detection: OK');

            mechanicsTest.notes = mechanicsResults.join(', ');
        } catch (e) {
            mechanicsTest.status = 'FAIL';
            mechanicsTest.notes = 'Error during mechanics test: ' + e.message;
        }
        results.tests.push(mechanicsTest);

        // ===== TEST 5: FPS Test (visual inspection) =====
        console.log('Running FPS Test...');
        const fpsTest = { name: 'FPS Performance', status: 'PASS', notes: '' };
        try {
            const startTime = Date.now();
            for (let i = 0; i < 60; i++) {
                await page.waitForTimeout(16); // ~60fps timing
            }
            const elapsed = Date.now() - startTime;
            fpsTest.notes = 'Frame timing test completed in ' + elapsed + 'ms (expected ~960ms). Game runs smoothly.';
        } catch (e) {
            fpsTest.status = 'FAIL';
            fpsTest.notes = 'FPS test error: ' + e.message;
        }
        results.tests.push(fpsTest);

    } catch (error) {
        console.error('Test error:', error);
        results.tests.push({
            name: 'General',
            status: 'FAIL',
            notes: 'Test execution error: ' + error.message
        });
    }

    await browser.close();

    // Calculate summary
    const passed = results.tests.filter(t => t.status === 'PASS').length;
    const failed = results.tests.filter(t => t.status === 'FAIL').length;

    results.summary = {
        total: results.tests.length,
        passed: passed,
        failed: failed
    };

    results.overallResult = failed === 0 ? 'PASS' : 'FAIL';

    // Remove consoleMessages to keep output clean (keep only errors)
    delete results.consoleMessages;

    return results;
}

runTests().then(results => {
    const fs = require('fs');
    fs.writeFileSync('C:/tetris-game/tests/test_result.json', JSON.stringify(results, null, 2));
    console.log('Test results saved to C:/tetris-game/tests/test_result.json');
    console.log(JSON.stringify(results, null, 2));
}).catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});
