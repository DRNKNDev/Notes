# DRNKN Notes Release Process

This document explains how to create releases for DRNKN Notes using GitHub Actions with Tauri v2 auto-update support.

## Release Workflow

The GitHub Actions workflow in `.github/workflows/release.yml` automates the process of building and releasing DRNKN Notes for multiple platforms:

- macOS (Intel and Apple Silicon)
- Windows

## How to Create a Release

### 1. Update CHANGELOG.md

Before creating a release, update the CHANGELOG.md file:

- Move items from the "Unreleased" section to a new version section (e.g., `## [1.0.0] - 2025-04-24`)
- Add any additional changes that aren't yet documented
- Make sure all significant changes are categorized under Added, Changed, Fixed, or Removed

The content from CHANGELOG.md will be used as the release notes in the GitHub release.

### 2. Update Version Number

Update the version number in both:

- `package.json` in the root directory
- `src-tauri/tauri.conf.json` (under the `"version"` field)

Make sure both version numbers match and correspond to the version in CHANGELOG.md.

### 3. Create and Push a Git Tag

```bash
# Create a tag with the version number
git tag v1.0.0  # Replace with your version

# Push the tag to GitHub
git push origin v1.0.0
```

This will automatically trigger the release workflow.

### 4. Review and Publish the Release

- Go to the GitHub repository's "Releases" section
- Find the draft release created by the workflow
- Review the release notes and assets
- Click "Publish release" when ready

## Auto-Update Configuration

The auto-update system is configured to:

1. Generate update artifacts during the build process
2. Deploy these artifacts to the `updater` branch as a GitHub Pages site
3. Configure the app to check for updates at `https://drnkndev.github.io/Notes/update/{platform}/latest.json`

### Required Secrets

For the workflow to function properly, you need to set up these GitHub repository secrets:

- `TAURI_PRIVATE_KEY`: Your Tauri updater private key
- `TAURI_KEY_PASSWORD`: Password for your Tauri private key (if applicable)

### Generating Signing Keys

If you haven't generated signing keys yet:

```bash
# Install Tauri CLI if not already installed
pnpm add -g @tauri-apps/cli

# Generate a key pair
pnpm tauri signer generate

# Follow the prompts to create and save your keys
```

Store the private key securely in GitHub Secrets.

## Troubleshooting

- If the workflow fails, check the GitHub Actions logs for details
- Ensure all required secrets are properly configured
- Verify that the version numbers are correctly updated in all files
- Make sure the GitHub Pages settings are configured to serve from the `updater` branch

## Manual Testing

To test the update process locally before releasing:

1. Build a development version with a lower version number
2. Install it on your system
3. Create a release with a higher version number
4. Verify that the app detects and installs the update
