#!/bin/bash
# English remake of a Dutch video (ep/av10_welterusten_en.js)
# rev2: tempfile fix
set -e
tools/build_en.sh en-remake-good-night-toet ep/av10_welterusten_en.js "python3 ep/mix.py ep/av10_welterusten_en.js" 70 
