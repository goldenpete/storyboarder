# Windows Input Validation

## Devices To Check

- Mouse only.
- Pen or tablet.
- Touch, if the hardware supports it.

## Validation Checklist

1. Open a sample project and draw on the canvas.
2. Switch between mouse and pen input without restarting the app.
3. Pan, zoom, and marquee-select after drawing.
4. Open Shot Generator and manipulate controls after using the canvas.
5. Save, reload, and confirm input still behaves normally.
6. Export a video and confirm input remains responsive afterward.

## What To Report

- Stuck drag states.
- Missed pointer-up or click events.
- Ghost input after switching devices.
- Pen or tablet failures that only happen after using mouse controls first.
