# Tauri AppCenter Companion

[![publish](https://github.com/zenoxs/tauri-appcenter-companion/actions/workflows/publish.yml/badge.svg)](https://github.com/zenoxs/tauri-appcenter-companion/actions/workflows/publish.yml)
[![GitHub license](https://badgen.net/github/release/zenoxs/tauri-appcenter-companion)](https://github.com/zenoxs/tauri-appcenter-companion/releases/latest)
[![GitHub license](https://badgen.net/badge/os/windows%20%7C%20macOS%20%7C%20linux/black)](https://github.com/zenoxs/tauri-appcenter-companion/releases/latest)
[![GitHub license](https://badgen.net/badge/license/GPL-3.0/blue)](https://github.com/zenoxs/tauri-appcenter-companion/blob/main/LICENSE)

<p align="center">
  <img src="./src-tauri/icons/Square150x150Logo.png" />
</p>

A companion app written with **React** and **Tauri** to help you manage your apps on appcenter. The idea is to provide a simple way to group apps from your appcenter into one view, this way you can easily build all your related apps with just one click and track progress and status.

![Main App Light](./screenshots/main_light.png)
![Main App Dark](./screenshots/main_dark.png)

## Features

- [x] View the (live) build status of all your apps
- [x] Start/Cancel your app build
- [x] Start/Cancel all your apps packaged in a bundled apps
- [x] The application can work with restricted access tokens (scoped on one app and with full access / read only)
- [x] Light/dark theme
- [ ] View the logs of your builds
- [ ] View all the available builds
- [ ] Edit / remove a bundled app

## How to use it ?

### Add token api

First install the application from the [release page](https://github.com/zenoxs/tauri-appcenter-companion/releases/latest):

- **AC.Companion_x.x.x_x64.dmg** for intel MacOS
- **AC.Companion_x.x.x_x64_en-US.msi** for Windows
- **ac-companion_x.x.x_amd64.AppImage** for Linux
- **ac-companion_x.x.x_amd64.deb** for Debian\* system

Then you will need to create an API Token from your AppCenter account. This can be done in 2 ways:

- From your Appcenter [account settings](https://appcenter.ms/settings/apitokens), **/!\\ remark** if you do so generated token will have access to all your apps.
- From the settings of your app : https://appcenter.ms/orgs/{owner}/apps/{app-name}/settings/apitokens

![Create appcenter api token](./screenshots/create-appcenter-api-token.png)

Then copy the generated token, open the "API Tokens" settings from the app and add a new token.

### Create a bundled app

_What is a bundled app ?_
A bundled app is a logical representation of multiple appcenter's apps. If you relate on a single base code framework and you want to build, for example, your Android and iOS application you must go to application detail each time to start and follow the build. With a bundled app you can manage all your apps build in a single view.

**To create a bundled app** you need to navigate to the **Applications** page and click on the **Add** button. Then the app will fetch all your registered token-based apps with their configured branches. You can select which branches will compose your bundled application and the name of your bundled application. Then press the **Save** button to create your bundled application and voilà.

## Confidentiality & Security

**Q:** Do AC Companion can acccess to my appcenter's account?

**A:** No, the application is designed to be a serverless application. All your data is stored in your local machine. AC Companion only uses the [App Center API](https://openapi.appcenter.ms/) to communicate with your appcenter's account.

---

## Development

### Install dependencies

```shell
yarn install
```

### Start app in dev

```shell
yarn run tauri dev
```

### Build the app

```shell
yarn run tauri build
```
