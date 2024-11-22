import { DateTime } from "luxon";
import syntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight"; // Syntax highlighting plugin
import markdownIt from "markdown-it";

export default function (eleventyConfig) {
    
    // Add some additional watch targets
    eleventyConfig.addWatchTarget("content/**/*.{svg,webp,png,jpeg}");
    eleventyConfig.addWatchTarget("public/**/*.{svg,webp,png,jpeg}");
    eleventyConfig.addWatchTarget("public/*");

    // Make a passthrough copy of the public/ directory
    eleventyConfig.addPassthroughCopy("public");

    // CSS Bundle
    eleventyConfig.addBundle("css");
    
    // Syntax highlighting plugin
    eleventyConfig.addPlugin(syntaxHighlight);
    
    // markdown-it stuff for inline code highlighting
    const md = markdownIt({ html: true });
    md.renderer.rules.code_inline = (tokens, idx, { langPrefix = "" }) => {
        const token = tokens[idx];
        return `<code class="${langPrefix}">${md.utils.escapeHtml(token.content)}</code>`;
    };
    eleventyConfig.setLibrary("md", md); // Tell 11ty to use markdown-it

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
