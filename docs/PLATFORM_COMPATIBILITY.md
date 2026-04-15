# Platform Compatibility

## Current Baseline

- Windows 10/11: supported baseline, with manual validation required for mouse, pen, and touch input.
- macOS Intel and Apple Silicon: supported baseline, with FFmpeg/export verification required before release.
- Linux desktop distributions: best-effort baseline, with extra diagnostics required for AppImage launch failures.

## Fast Verification

```bash
npm run diagnostics:platform
npm run test:smoke
npm run build
```

## Apple Silicon

- Use native arm64 dependencies where possible.
- Verify `npm run diagnostics:platform` reports `platform: darwin`, `arch: arm64`, and a working FFmpeg version.
- If the machine architecture changed since the last install, refresh dependencies from a clean checkout before packaging.
- Keep macOS release verification focused on launch, save/reload, and export.

## Linux

- Capture platform diagnostics and terminal logs for launch failures.
- Track whether the issue reproduces under Wayland, X11, or both.
- Use [docs/LINUX_APPIMAGE_DIAGNOSTICS.md](./LINUX_APPIMAGE_DIAGNOSTICS.md) when triaging AppImage reports.

## Windows

- Validate pointer input on Windows 10 and Windows 11 where possible.
- Confirm mouse, pen, and touch flows stay reliable across canvas editing, Shot Generator, and save/export flows.
- Use [docs/WINDOWS_INPUT_VALIDATION.md](./WINDOWS_INPUT_VALIDATION.md) as the manual checklist.
