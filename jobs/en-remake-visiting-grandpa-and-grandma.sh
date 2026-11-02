#!/bin/bash
# English remake of a Dutch video (ep/av01_opa_oma_en.js)
# rev3 2026-10-31: subscribe pill
# rev4 2026-11-02: channel badge next to subscribe pill
set -e
tools/build_en.sh en-remake-visiting-grandpa-and-grandma ep/av01_opa_oma_en.js "python3 ep/mix.py ep/av01_opa_oma_en.js" 30 
