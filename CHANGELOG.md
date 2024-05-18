# Changelog

All notable changes to this project will be documented in this file. This project adheres to [Semantic Versioning](https://semver.org/).

## 0.8.0-rc
- Add CPU thread usage metrics

## 0.7.4
- Modify chart label button text
- Add Project information to settings page

## 0.7.3
- Add persistent title bars so it matches with the theme

## 0.7.2
- Implement custom title bars

## 0.7.1
- Change Chart height
- Improve font style
- Improve reference colors for charts
- Minor UI improvements


## 0.7.0
- Improve Settings page UI
- Add Theme support
- Add Slate theme
- Add Midnight theme
- Add Bumblebee theme
- Remove User email prompt

## 0.6.0
- Modify UI to use stats-rings
- Add Analytics provider

## 0.5.2
- Fixed Network interfaces not being reported

## 0.5.1
- Updated Rust and Typescript dependencies

## 0.5.0
- Updated Rust and Typescript dependencies

## 0.4.0

- Add `Settings` page
- Make Pachtop start on system startup
- Improvements to Disks UI
- Add functionality to open folder directory if "Location" is clicked in Disks UI

## 0.3.8

- Improve UI performance by utilizing High Charts library
- Add viewable range feature for all area charts (CPU, Memory, Network, Disk)
- Remove unrequired dependencies

## 0.3.7

- Fix user prompt keep showing up after the user has been prompted once

## 0.3.6

- Updated Rust dependencies
- Updated Typescript dependencies

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
