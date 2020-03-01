# Android

## Step 1

Add this to your AndroidManifest.xml file to autoreconnect fastly to DDP server if your device reconnects to network

```xml
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
```

## Optional

If running an android emulator you have to forward the port of your meteor app.

```shell
$ adb reverse tcp:3000 tcp:3000
```
