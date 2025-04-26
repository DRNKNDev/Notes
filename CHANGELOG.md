# Changelog

All notable changes to DRNKN Notes will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.8] - 2025-04-26

### Added
- Initial release of DRNKN Notes

## Release Process

1. Update the version in `package.json` and `src-tauri/tauri.conf.json`
2. Move changes from "Unreleased" to a new version section
3. Commit changes with message "Release vX.Y.Z"
4. Create and push a tag: `git tag vX.Y.Z && git push origin vX.Y.Z`
5. The GitHub Action will automatically create a release
