#!/bin/sh
# Renders each exam's official answer key to page images the app shows under "Staff solution".
# Re-run after adding an exam. Needs poppler (brew install poppler).
set -e
cd "$(dirname "$0")/.."
render() { # <exam id> <pdf>
  rm -rf "content/keys/$1" && mkdir -p "content/keys/$1"
  # Crop the 1-inch page margins so the text shows larger (120 dpi: page is 1020 x 1320 px).
  pdftoppm -r 120 -x 110 -y 90 -W 805 -H 1150 -jpeg -jpegopt quality=80 "$2" "content/keys/$1/p"
  # The app expects two-digit page numbers (p-01.jpg); short PDFs come out as p-1.jpg.
  for f in "content/keys/$1"/p-?.jpg; do
    if [ -e "$f" ]; then mv "$f" "${f%-?.jpg}-0${f##*-}"; fi
  done
}
render fa25-mt1 "$HOME/Downloads/2025 Fall Midterm 1 KEY.pdf"
render sp25-mt1 "$HOME/Downloads/2025 Spring Midterm 1 KEY.pdf"

