---
title: "Making an E-Paper Bot Part 2"
description: "Part 2 of my project where I cover the small abstraction layer I built on top of Waveshare's display driver."
date: 2025-08-01
---

This article covers the second half of my e-Paper bot project, where I made a small graphics abstraction to draw on and interact with the Waveshare e-paper display.

# Why?

Now that I had my Raspberry Pi connected to the internet and the Waveshare EPD driver working correctly, it was time to start drawing on the screen. However, I found it tedious to use Waveshare's functions, and I felt that I could simplify them a bit more.

For example, the following code isn't insanely hard to read, but there's a lot of fluff here that I just didn't need for my implementation:

```python
epd.init()
image = Image.new('1', (epd.height, epd.width), 255)  # 255: clear the frame    
draw = ImageDraw.Draw(image)
draw.rectangle([(0,0),(50,50)],outline = 0)
epd.display(epd.getbuffer(image))
epd.sleep()
```

In short, I just wanted to use less brain power later one once I was handling Spotify data.

# Summary

The code for this project can be found [here](https://github.com/andersamer/tars-display/tree/main). In short, I ended up making two classes:

* `EPDController` - This class takes care of interaction with the screen itself. It's basically a fancy wrapper for functions that display image buffers and control the power state of the display

* `EPDDrawer` - This class is basically an abstraction of [Pillow](https://pillow.readthedocs.io/en/stable/). It draws images, shapes, and text on an image that is then sent to the display. It also handles fonts.

In short, `EPDDrawer` creates the image and hands it off to `EPDController` so that it can be displayd.

# EPDController

I'm not really gonna go into this code because it's really simple and boring. The most important thing that this class does is adjust the orientation of the display so that I can set it on my desk with the power cable up instead of down:

```python
def __init__(self, landscape=True):
        self.logger = logging.getLogger(__name__)
        self.epd = epd2in13_V4.EPD()

        if landscape:
            # If we are in a landscape orientation, then the 
            # width and height are swapped
            self.width = self.epd.height
            self.height = self.epd.width
        else:
            self.width = self.epd.width
            self.height = self.epd.height

        self.logger.info(f'Initialized EPDController. Display dimensions: {self.width}x{self.height}')
```

Other than that, I'm just wrapping display control functions so I don't have to think about them each time I call them:

```python
def clear(self, color=0xff):
        self.logger.info('Clearing display.')
        self.init()
        self._clear()
```

# EPDDrawer

There were two crucial parts of my design for this project:

* I wanted to display the song name and artist of the current song being played, so I would need to be able to draw text and have its size be adjusted to fit certain constraints

* I wanted to display the album art for a given song, so I would need to both be able to download images, and convert them to a resolution that the EPD could display.

The first requirement was the most difficult to implement. The first thing I did was import fonts:

```python
# TODO: I obviously need to clean this up. Also, I can't tell you why there are so many fonts here. Experimentation?
self.font16 = ImageFont.truetype(os.path.join(self.assets_dir, 'Font.ttc'), 16)
self.font24 = ImageFont.truetype(os.path.join(self.assets_dir, 'Font.ttc'), 24)
self.font_inter32 = ImageFont.truetype(os.path.join(self.assets_dir, 'inter.ttf'), 32)
self.font_inter24 = ImageFont.truetype(os.path.join(self.assets_dir, 'inter.ttf'), 24)
self.font_inter16 = ImageFont.truetype(os.path.join(self.assets_dir, 'inter.ttf'), 16)
self.font_inter10 = ImageFont.truetype(os.path.join(self.assets_dir, 'inter.ttf'), 10)
self.font_libre_baskerville24 = ImageFont.truetype(os.path.join(self.assets_dir, 'libre_baskerville_bold.ttf'), 24)
self.font_libre_baskerville18 = ImageFont.truetype(os.path.join(self.assets_dir, 'libre_baskerville_bold.ttf'), 18)
self.font_libre_baskerville16 = ImageFont.truetype(os.path.join(self.assets_dir, 'libre_baskerville_bold.ttf'), 16)
self.default_font = self.font_libre_baskerville16
```

Next, it was time to create a text-wrapping function. Not only did my text have to wrap when it hit a certain width, but the font size had to be adjusted to accomodate for super long strings.

I ended up measuring both the width and height of the text character by character by creating a new instance of the `bbox` class each time a character was added. This allowed me to know when to break lines and when to make font size bigger/smaller.

It took a few iterations, but I eventually got it:

```python
def get_test_bbox(text):
    return self.canvas_draw.textbbox((0, 0), text, font=font)

def get_test_bbox_width(text):
    """Utility function to get the width of a given text block"""
    test_bbox = get_test_bbox(text)
    return test_bbox[2] - test_bbox[0]

def split_long_word(word, font, max_width):
    """Utility function to wrap a long word"""

    # Measure a long word character by character until we hit
    # our max width. Then store that part of the word and do 
    # the same with the others
    parts = []
    current_part = ''

    for char in word:
        test_part = current_part + char
        test_part_width = get_test_bbox_width(test_part)
        
        if test_part_width <= max_width:
            current_part = test_part
        else:
            if current_part:
                parts.append(current_part)
            current_part = char
    
    if current_part:
        parts.append(current_part)

    return parts

for word in words:
    test_line = current_line + (" " if current_line else "") + word
    test_line_width = get_test_bbox_width(test_line)

    if test_line_width <= max_width:
        current_line = test_line
    else:
        if current_line:
            # Only append the line if it isn't empty
            lines.append(current_line)
        
        # If the line is empty, then that means we'll need to 
        # check if the word itself is too long
        word_bbox_width = get_test_bbox_width(word)
        if word_bbox_width <= max_width:
            current_line = word
        else:
            # Break the word into pieces that take up the whole width
            broken_parts = split_long_word(word, font, max_width)
            for i, part in enumerate(broken_parts):
                if i == 0:
                    current_line = part
                else:
                    lines.append(current_line)
                    current_line = part

# If we have a left over word, then add that to our lines array
if current_line:
    lines.append(current_line)

y = pos[1]

for line in lines:
    # Draw the lines one by one until we run out of space
    # test_line_height = get_test_bbox_height(line)
    test_line_height = font.size

    # Don't include lines that go outside our bounds
    # if y + test_line_height > max_height:
    #     break  # Stop if text exceeds screen

    self.canvas_draw.text((pos[0], y), line, font=font, fill=0)
    y += test_line_height + self.line_spacing

return y
```

The next challenge (downloading images) was fairly straightforward. Waveshare evne provided the most epic image in their repo that I could use in testing:

![snopy_waveshare](/public/img/snoopy.bmp)

Once I had the "download" portion of the function down, I just had to make sure play around with the image resampling to make it look right.

```python
def download_convert_img(self, url):
    self.logger.info(f'Requesting image at "{url}"')
    try:
        response = requests.get(url)
        response.raise_for_status()
        img = Image.open(BytesIO(response.content))
    except Exception as e:
        self.logger.error(f'Exception occurred while requesting image: {repr(e)}')
        placeholder_image_filename = 'snoopy.bmp'
        self.logger.warning(f'Using {placeholder_image_filename}...')
    # This line required some fine-tuning before I got  
    # something that I liked
    img.thumbnail((self.width, self.height), Image.Resampling.BICUBIC) 
    img = img.convert('1') 
    return img
```

(The PIL functions for drawing shapes are already pretty straightforward, so I just made wrapper functions for those in this class.)

# Conclusion

I'm really glad that I built out this small abstraction. It made fine-tuning the project really easy once I actually started making requests to the Spoify API.

As mentioned above, the rest of the code is in [this repo](https://github.com/andersamer/tars-display/tree/main).

In the future, I hope to come up with more ideas on what to display on the screen. I think it could be fun to have the display cycle through [Brian Eno's oblique strategies](https://en.wikipedia.org/wiki/Oblique_Strategies) for some inspiration while I work. Could be [fun](https://github.com/ghsyafii/oblique-strategies).