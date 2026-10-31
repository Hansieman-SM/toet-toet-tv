#!/bin/bash
# English remake of a Dutch video (ep/e1_koeien_en.js)
# rev3 2026-10-31: subscribe pill
set -e
tools/build_en.sh en-remake-toet-counts-cows ep/e1_koeien_en.js "python3 ep/e1_koeien.py" 40 
