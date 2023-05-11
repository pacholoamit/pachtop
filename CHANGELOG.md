# Changelog

All notable changes to this project will be documented in this file. This project adheres to [Semantic Versioning](https://semver.org/).

## 0.3.6-rc

- Updated dependencies
- Improve Chart performance by using High Charts as charting library

### Todo:

- Improve UI performance by reducing number of renders

## 0.3.5

- Add `version` in UI
- Reduce text size for system information
- Fix global cpu usage if global cpu usage is `undefined`

## 0.3.4

- Modified metrics capture to `listen` for events instead of `tauri` command.
- Spawne separate thread for metrics capture.
- Removed `tauri` command implementation for metrics capture.
- Modify `release` workflow to include `release_notes`
- Add updater support
