#!/bin/bash
# English remake of a Dutch video (ep/e5_kiekeboe_en.js)
# rev3 2026-10-31: subscribe pill
# rev4 2026-11-02: channel badge next to subscribe pill
set -e
tools/build_en.sh en-remake-peekaboo ep/e5_kiekeboe_en.js "python3 ep/e5_kiekeboe.py" 16 
