# safari-push
Example application to show Safari push notifications in action.

This app runs by default on https://localhost:3000. The push api is supported only for https connections.

## Install

```
yarn
```

## Prerequisites
Before running the example you need to create some certificates and build the package.
1. **Push certificates** –
Create Apple push certificates  and put into `private/aps.cert/web_aps_prod.p12`. You can find a guide in [Apple Developer Documentation](https://developer.apple.com/library/archive/documentation/NetworkingInternet/Conceptual/NotificationProgrammingGuideForWebsites/PushNotifications/PushNotifications.html)
2. **AppleWWDRCA** – Get current Apple WWDR certificate and put it into `private/aps.cert/AppleWWDRCA.pem`
3. **Push Package** – if you have the files from 1 and 2 you can build the push package zip file. Go to `private/safari.push` and run php script by using `php createPushPackage.php`. To do it you need to set your cert pass in line 11 in php script, or just put it into env value as `SAFARI_PUSH_CERT_PASS`. This should generate a package like this: `private/pushPackage1551346182.zip`.

## Debug
Run for development with changes watching:

```
yarn start
```
## Production
Build production to `./dist` directory:
```
yarn run build
```
Run in production 
```
yarn run prod
```