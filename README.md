# proteus

## INSTALLATION INSTRUCTIONS (for Chrome extension)

Get backend ready.
1. `cd backend`
2. `uv sync`
3. `uv run main.py`

Get extension ready.
1. `cd proteus-extension`
2. `npm install`
3. `npm run dev`
4. In Chrome, go to `chrome://extensions/`
5. Turn on Developer mode
6. Click `Load Unpacked`
7. Select the `dist` folder inside of `proteus-extension`

NOTE: One-click load for extensions does not work for non-Macs

Mac Instructions:
 - Go to Chrome. Click `View > Developer > Allow JavaScript from Apple Events`

Non-Mac Instructions:
 - Extensions are created inside of `./backend/demo_code`
 - Follow the `Load Unpacked` instructions from above to load in extensions.
