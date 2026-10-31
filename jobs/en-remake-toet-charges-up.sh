#!/bin/bash
# English remake of a Dutch video (ep/e3_opladen_en.js)
# rev3 2026-10-31: subscribe pill
set -e
tools/build_en.sh en-remake-toet-charges-up ep/e3_opladen_en.js "python3 ep/e3_opladen.py" 20.5
