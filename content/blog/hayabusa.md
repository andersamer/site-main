---
title: "Using Hayabusa to analyze Windows logs"
description: "Yippee!! Logs!! 🪵!!"
date: 2024-11-21
---

This week, I used [Hayabusa](https://github.com/Yamato-Security/hayabusa) to analyze some Windows Logs. According to the Hayabusa is a Windows event log timeline generator that uses [Sigma](https://github.com/SigmaHQ/sigma) rules to parse logs. It's a really nifty tool if you are looking to build a sequence of events for an incident in your environment. In addition, Hayabusa a can produce outputs that are friendly with SIEM tools such as Splunk.

**Fun fact:** *Hayabusa* means peregrine falcon in Japanese. 

# Installation

Installation was very straightforward on my Linux system. I simply navigated to the [Hayabusa releases page](https://github.com/Yamato-Security/hayabusa/releases) and downloaded and uncompressed the archive for x64 systems. 

Then, it was just a matter of running the executable from the terminal:

```bash
$ ./hayabusa-2.18.0-lin-x64-gnu 

┏┓ ┏┳━━━┳┓  ┏┳━━━┳━━┓┏┓ ┏┳━━━┳━━━┓
┃┃ ┃┃┏━┓┃┗┓┏┛┃┏━┓┃┏┓┃┃┃ ┃┃┏━┓┃┏━┓┃
┃┗━┛┃┃ ┃┣┓┗┛┏┫┃ ┃┃┗┛┗┫┃ ┃┃┗━━┫┃ ┃┃
┃┏━┓┃┗━┛┃┗┓┏┛┃┗━┛┃┏━┓┃┃ ┃┣━━┓┃┗━┛┃
┃┃ ┃┃┏━┓┃ ┃┃ ┃┏━┓┃┗━┛┃┗━┛┃┗━┛┃┏━┓┃
┗┛ ┗┻┛ ┗┛ ┗┛ ┗┛ ┗┻━━━┻━━━┻━━━┻┛ ┗┛
   by Yamato Security 

Hayabusa v2.18.0 - SecTor Release
Yamato Security (https://github.com/Yamato-Security/hayabusa - @SecurityYamato)

...
```

I'm sure you could rename the executable to make it a little prettier if you want to.

# Getting Some Sample Logs

You have a couple options here.

First, you could grab your own Windows logs from your own machine by copying all of the files at this filepath:

```
C:\WINDOWS\system32\config\
```

Or, if you don't have access to a Windows machine/don't want to do that (or you want some *spicier* logs), you can 