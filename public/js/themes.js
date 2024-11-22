const COOKIE_NAME = "preferredModeMain"
const DEFAULT_THEME = "dark";

const LIGHT_CONFIG = {
    "--text-primary": "black",
    "--bg-primary": "white",
    "--border-default-color": "grey",
    "--border-default": "1px solid var(--border-default-color)",
    "--icon-color": "#282828",
    "--accent": "#1f6d85",
    "--shadow-color": "rgba(0, 0, 0, 0.16) 0px 1px 4px"
}

const DARK_CONFIG = {
    "--text-primary": "white",
    "--bg-primary": "#282828",
    "--border-default-color": "#a1a1a1",
    "--border-default": "1px solid var(--border-default-color)",
    "--icon-color": "white",
    "--accent": "#31a2c5",
    "--shadow-color": "rgba(255, 255, 255, 0.45) 0px 1px 4px"
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

function updateTheme() {
    document.getElementById("themeButton").innerText = ((getMode() == "dark") ? "brightness_7" : "dark_mode")
    var config = (getMode() == "dark") ? DARK_CONFIG : LIGHT_CONFIG;
    var properties = Object.keys(config);
    properties.forEach((property) => {
        document.documentElement.style.setProperty(property, config[property]);
    });
}

function toggleCookie() {
    document.cookie = `${COOKIE_NAME}=` + ((getMode() == "dark") ? "light" : "dark") + "; expires=Sun, 31 Dec 2029 23:59:59 UTC; path=/";
    updateTheme();
}
