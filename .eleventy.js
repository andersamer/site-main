import { DateTime } from "luxon";
import syntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight"; // Syntax highlighting plugin

export default function (eleventyConfig) {

    // Add some additional watch targets
    eleventyConfig.addWatchTarget("content/**/*.{svg,webp,png,jpeg}");
    eleventyConfig.addWatchTarget("public/*");

    // Make a passthrough copy of the public/ directory
    eleventyConfig.addPassthroughCopy("public");

    // Allow for missing extensions11
    // eleventyConfig.configureErrorReporting({ allowMissingExtensions: true });

    // CSS Bundle
    eleventyConfig.addBundle("css");

    // Syntax highlighting plugin
    eleventyConfig.addPlugin(syntaxHighlight);

    // Add a filter to parse dates into yyyy-MM-dd format
    eleventyConfig.addFilter("normalDate", (dateObj) => {
        return DateTime.fromJSDate(dateObj, { zone: 'utc' }).toFormat("yyyy-MM-dd");
    });

    // Current year shortcode. Usage: {% currentYear %}
    eleventyConfig.addShortcode("currentYear", () => `${new Date().getFullYear()}`);

    // Set default input and output directories
    return {
        dir: {
            input: "content",          // default: "."
            includes: "../_includes",  // default: "_includes" (`input` relative)
            data: "../_data",          // default: "_data" (`input` relative)
            output: "_site"
        },
    };
    
}
