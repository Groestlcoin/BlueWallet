# GRS BlueWallet - A Groestlcoin & Lightning Wallet

[![GitHub tag](https://img.shields.io/badge/dynamic/json.svg?url=https://raw.githubusercontent.com/Groestlcoin/BlueWallet/master/package.json&query=$.version&label=Version)](https://github.com/Groestlcoin/BlueWallet)
[![CircleCI](https://circleci.com/gh/Groestlcoin/BlueWallet.svg?style=svg)](https://circleci.com/gh/Groestlcoin/BlueWallet)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
![](https://img.shields.io/github/license/Groestlcoin/BlueWallet.svg)

Thin Groestlcoin Wallet.
Built with React Native and Electrum.

[![Appstore](https://bluewallet.io/uploads/app-store-badge-blue.svg)](https://apps.apple.com/us/app/grs-bluewallet/id1518766083)
[![Playstore](https://bluewallet.io/uploads/play-store-badge-blue.svg)](https://play.google.com/store/apps/details?id=org.groestlcoin.bluewallet)

Website: [GRS bluewallet](https://www.groestlcoin.org/grs-bluewallet/)

Community: [telegram group](https://t.me/Groestlcoin)

* Private keys never leave your device
* Lightning Network supported
* SegWit-first. Replace-By-Fee support
* Encryption. Plausible deniability
* And many more [features...](https://www.groestlcoin.org/grs-bluewallet/)


## BUILD & RUN IT

Please refer to the engines field in package.json file for the minimum required versions of Node and npm. It is preferred that you use an even-numbered version of Node as these are LTS versions.

To view the version of Node and npm in your environment, run the following in your console:

```
node --version && npm --version
```

* In your console:

```
git clone https://github.com/Groestlcoin/BlueWallet.git
cd BlueWallet
npm install
```

Please make sure that your console is running the most stable versions of npm and node (even-numbered versions).

* To run on Android:

You will now need to either connect an Android device to your computer or run an emulated Android device using AVD Manager which comes shipped with Android Studio. To run an emulator using AVD Manager:

1. Download and run Android Studio
2. Click on "Open an existing Android Studio Project"
3. Open `build.gradle` file under `BlueWallet/android/` folder
4. Android Studio will take some time to set things up. Once everything is set up, go to `Tools` -> `AVD Manager`.
    * 📝 This option [may take some time to appear in the menu](https://stackoverflow.com/questions/47173708/why-avd-manager-options-are-not-showing-in-android-studio) if you're opening the project in a freshly-installed version of Android Studio.
5. Click on "Create Virtual Device..." and go through the steps to create a virtual device
6. Launch your newly created virtual device by clicking the `Play` button under `Actions` column

Once you connected an Android device or launched an emulator, run this:

```
npx react-native run-android
```

The above command will build the app and install it. Once you launch the app it will take some time for all of the dependencies to load. Once everything loads up, you should have the built app running.

* To run on iOS:

```
npx pod-install
npm start
```

In another terminal window within the BlueWallet folder:
```
npx react-native run-ios
```

* To run on macOS using Mac Catalyst:

```
npm run maccatalystpatches
```

Once the patches are applied, open Xcode and select "My Mac" as destination. If you are running macOS Catalina, you may need to remove all iOS 14 Widget targets.


## TESTS

```bash
npm run test
```


## LICENSE

MIT

## Translations

We accepts translations via [Transifex](https://www.transifex.com/bluewallet/bluewallet/)

To participate you need to:
1. Sign up to Transifex
2. Find BlueWallet project
3. Send join request
4. After we accept your request you will be able to start translating! That's it!

Please note the values in curly braces should not be translated. These are the names of the variables that will be inserted into the translated string. For example, the original string `"{number} of {total}"` in Russian will be `"{number} из {total}"`.

Transifex automatically creates Pull Request when language reaches 100% translation. We also trigger this by hand before each release, so don't worry if you can't translate everything, every word counts.

## Q&A

Builds automated and tested with BrowserStack

<a href="https://www.browserstack.com/"><img src="https://i.imgur.com/syscHCN.png" width="160px"></a>

Bugs reported via BugSnag

<a href="https://www.bugsnag.com"><img src="https://images.typeform.com/images/QKuaAssrFCq7/image/default" width="160px"></a>


## RESPONSIBLE DISCLOSURE

Found critical bugs/vulnerabilities? Please email them groestlcoin@gmail.com
Thanks!
