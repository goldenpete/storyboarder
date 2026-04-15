# Linux AppImage Diagnostics

## Capture These First

- Distribution name and version.
- Kernel version.
- Desktop environment or compositor.
- `XDG_SESSION_TYPE`, `WAYLAND_DISPLAY`, and `DISPLAY`.
- Whether the app was launched from an AppImage or from source.

## Repro Checklist

1. Launch Storyboarder from a terminal and keep the terminal output.
2. Note whether the failure happens before the first window appears, after the window appears, or only after loading a project.
3. Confirm whether `npm run test:smoke` passes when reproducing from source.
4. If you are running from source, attach `npm run diagnostics:platform`.

## AppImage-Specific Notes

- Include the full AppImage filename and path when reporting launch failures.
- If the AppImage launches only when started from a terminal, attach the terminal output.
- If the issue appears session-specific, note whether it reproduces under Wayland, X11, or both.
