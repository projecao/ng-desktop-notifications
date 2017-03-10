# ng-desktop-notifications

The Notification interface of the [Notifications API](https://developer.mozilla.org/en-US/docs/Web/API/Notifications_API) is used to configure and display desktop notifications to the user.

## Install

`npm install --save ng-desktop-notifications`

## Usage

```js
import angular from 'angular'
import desktopNotifications from 'ng-desktop-notifications'

var app = angular.module('app', [desktopNotifications])

app.config(['desktopNotificationProvider', function(desktopNotification){
  desktopNotification.configure({
    icon: 'path/to/file.icon'
  })
}])

app.controller('MyController', ['desktopNotification', function(desktopNotification){
  desktopNotification.show('Notification', {
    body: 'My desktop notification!\nA AngularJs Module'
  })
}])

```

## Configure

```js

```

## License

The [MIT](license)

