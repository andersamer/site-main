export default function (eleventyConfig) {

    // Current year shortcode (Usage: {% currentYear %})
    eleventyConfig.addShortcode("currentYear", () => `${new Date().getFullYear()}`);

    // Allow for missing extensions
    eleventyConfig.configureErrorReporting({ allowMissingExtensions: true });

    // Set default input and output directories
    return {
        dir: {
            input: "_src",   // Directory containing source files
            output: "_site", // Build location
        }
    };

}
