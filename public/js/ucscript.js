const COOKIE_NAME = "preferredModeUC";
const DEFAULT_THEME = "light"

function darkMode() {
    document.body.classList.toggle("dark-mode");

    function iterateThroughTags(tagName, darkClassName) {
        var elements = document.getElementsByTagName(tagName);
        if (elements) {
            for (element of elements) {
                element.classList.toggle(darkClassName);
            }
        }
    }

    iterateThroughTags("code", "dark-code");
    iterateThroughTags("blockquote", "dark-blockquote");
    iterateThroughTags("a", "dark-a");
    iterateThroughTags("figcaption", "dark-figcaption");

    var isDarkMode = document.body.classList.contains("dark-mode");
    document.cookie = `${COOKIE_NAME}=` + (isDarkMode ? "dark" : "light") + "; expires=Sun, 31 Dec 2029 23:59:59 UTC; path=/";

}

function getMode() {

	// Find the cookie for this site
    var cookies = document.cookie.split(new RegExp("\\;*\\s"));
	let cookie = null;
	for(var i = 0; i < cookies.length; i++) {
		if (cookies[i].indexOf(`${COOKIE_NAME}`) != -1) { cookie = cookies[i]; }
	}

	// Get the cookie value using String.substring()	
    if (cookie) {
    	return cookie.substring(`${COOKIE_NAME}=`.length);
    } else {
        // No cookie has been set
        return DEFAULT_THEME;
    }
    
}

function setPreferredMode() {
    if (getMode() === 'dark') {
        darkMode();
    };
}

function generateRandomHexCode() {

    // Function to check if a color is "boring" (close to shades of grey or black)
    function isBoringColor(r, g, b) {
        // Calculate the perceived brightness of the color
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;

        // Adjust these threshold values based on your preference
        const brightnessThreshold = 50;

        // Check if the color is below the brightness threshold
        return brightness < brightnessThreshold;
    }

    let hexCode;

    do {
        // Generate random RGB components
        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);
        const b = Math.floor(Math.random() * 256);

        // Check if the color is "boring"; if not, convert to hex
        if (!isBoringColor(r, g, b)) {
            hexCode = `#${(1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1)}`;
        }
    } while (!hexCode); // Repeat until a non-boring color is generated

    return hexCode;
}

function updateMagicCircles() {
    let newColor = generateRandomHexCode();

    // Get all elements with the specified class name
    const elements = document.getElementsByClassName("magicCircle");

    // Loop through the elements and change the text color
    for (let i = 0; i < elements.length; i++) {
        elements[i].style.color = newColor;
    }
}

function initMagicCircles() {
    updateMagicCircles(); // Set the magicCircle to a random magic color!

    // Listen for clicks on all of the magic circles
    let magicCircles = document.querySelectorAll('.magicCircle');
    magicCircles.forEach((magicCircle) => {
        magicCircle.addEventListener('click', () => {
            updateMagicCircles();
        });
    });

}

window.addEventListener('load', () => {
    setPreferredMode(); // Read the user's cookie and update the color mode accordingly
    initMagicCircles(); // Set up the magicCircles
});
