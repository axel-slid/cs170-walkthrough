#!/bin/sh
# Crops problem diagrams that render-archive.py doesn't cover, into content/diagrams/extra/.
# Coordinates are pixels at 200 dpi: x y width height. Needs poppler (brew install poppler).
set -e
cd "$(dirname "$0")/.."
mkdir -p content/diagrams/extra
crop() { # <name> <pdf> <page> <x> <y> <w> <h>
  pdftoppm -r 200 -png -singlefile -f "$3" -l "$3" -x "$4" -y "$5" -W "$6" -H "$7" "sources/$2" "content/diagrams/extra/$1"
}
crop sp26-q2 "2026 Spring Midterm 1 KEY.pdf" 6 380 580 940 340
crop fa21-q2 "2021 Fall Midterm 1 KEY.pdf" 4 680 760 330 320
crop fa23-q5 "2023 Fall Midterm 1 KEY.pdf" 10 620 590 470 640
