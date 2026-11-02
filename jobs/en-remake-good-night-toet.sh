#!/bin/bash
# English remake of a Dutch video (ep/av10_welterusten_en.js)
# rev3 2026-10-31: subscribe pill
# rev2: tempfile fix
# rev4 2026-11-02: channel badge next to subscribe pill
set -e
tools/build_en.sh en-remake-good-night-toet ep/av10_welterusten_en.js "python3 ep/mix.py ep/av10_welterusten_en.js" 70 
