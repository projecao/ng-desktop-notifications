/**
 * Dependencies.
 */
import angular from 'angular'
import desktopNotificationProvider from './providers/notification.provider'

var ngModule = angular
    .module('ngDesktopNotifications', [])
    .provider('desktopNotification', desktopNotificationProvider)
    .name

/**
 * Export `ngDesktopNotifications`.
 */
export default ngModule
