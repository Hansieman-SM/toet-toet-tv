#!/bin/bash
# English remake of a Dutch video (ep/av04_bus_en.js)
# rev3 2026-10-31: subscribe pill
set -e
tools/build_en.sh en-remake-toet-and-bus-bas ep/av04_bus_en.js "python3 ep/mix.py ep/av04_bus_en.js" 40 
