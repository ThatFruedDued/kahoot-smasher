# ThatFruedDued Kahoot! Scripts

## Kahoot! Smasher

Join Kahoot! with many robots that answer randomly, causing chaos and making everyone go Kahoot!s.

### Get it! (auto-updating bookmarklet)

Use the code below as the URL in a bookmark. This will make the bookmark a bookmarklet that will run the script.

`javascript:fetch('https://thatfrueddued.github.io/kahoot-smasher/Kahoot.js').then(function(response){response.text().then(function(text){eval(text);});});`

Click the bookmarklet one time when entering game PIN on https://kahoot.it. After the game pin is entered, you can configure options. First you will be asked for a prefix. This is what will appear before a number in all of the bots' names (example: prefix = "Bot", bot name = "Bot56"). The second option is the amount of bots you want. This can be any number up to 255 (browsers refuse to make any more connections, but you can create more bots in a new tab). The next option is the delay between bots joining. The most efficient value for this option is 100. All values typed must be an integer and is in milliseconds. The final option is the cooldown. When the smasher connects lots of bots to the game, Kahoot! will prevent us from adding more after a few bots because we are creating too many connections too fast. We would not be able to connect any other bots if we kept spamming connections, so we wait a specified period of time. The recommended for this setting is 15000 (still in ms).

## Kahoot! Nickname Generator Bypass

Rules are no fun. That's why I made the anti-rule nickname generator bypass script! Get yours today by getting the bookmarklet below.

### Get it! (auto-updating bookmarklet)

Use the code below as the URL in a bookmark. This will make the bookmark a bookmarklet that will run the script.

`javascript:fetch('https://thatfrueddued.github.io/kahoot-smasher/NicknameGeneratorBypass.js').then(function(response){response.text().then(function(text){eval(text);});});`

Click the bookmarklet when entering game PIN on https://kahoot.it. After the game pin is entered, the script will automatically activate. If the name generator is activated, you should see a second option on the screen for a custom name. Type a custom name and join! Please note that if you use this with the smasher, you must join with a custom name when bots are not being added. If you fail to do so, you will not see the "You're in!" screen and will not be able to play.

## Kahoot! Bad Name Filter Bypass

Join Kahoot! with words like "poop" without being filtered. I won't ask why, but all I know is that you're up to no good.

### Get it! (auto-updating bookmarklet)

Use the code below as the URL in a bookmark. This will make the bookmark a bookmarklet that will run the script.

`javascript:fetch('https://thatfrueddued.github.io/kahoot-smasher/BadNameFilterBypass.js').then(function(response){response.text().then(function(text){eval(text);});});`

Click the bookmarklet one time when entering game PIN on https://kahoot.it. Then, you can join a Kahoot! as a name that is normally filtered. This works with all of my other hacks, meaning that even bots will bypass the filter. You can also use this with the Nickname Generator Bypass. **IMPORTANT**: This script **must** be activated **before** other scripts in order for it to function.

## Kahoot! Name Too Long Bypass

Join Kahoot! with a much longer name than you are normally allowed. Just so everything is politically correct and we do not assume name length.

### Get it! (auto-updating bookmarklet)

Use the code below as the URL in a bookmark. This will make the bookmark a bookmarklet that will run the script.

`javascript:fetch('https://thatfrueddued.github.io/kahoot-smasher/NameLengthBypass.js').then(function(response){response.text().then(function(text){eval(text);});});`

Click the bookmarklet one time when entering game PIN on https://kahoot.it. Then, you can join a Kahoot! as a much longer name than normal. This does not need to be enabled with most of my other hacks. They already bypass the long name filter (the bad name filter does not include this prepackaged, so you will need to activate this to use a longer name with that script). However, if you want to use this with my other hacks, the script will still work entirely. When you join with a long name, an error will appear, but then disappear. Ignore this. This is simply Kahoot! refusing to join the game with a longer name, but my script will let you join anyway.
