import angular from 'angular'

function NotificationProvider () {

    // Defaults config
    this.defaultConfig = {}

    // Requite keys
    this.requiredKeys = []

    /**
     * Sanitize configuration parameters
     * 
     * @param {object} an `object` of params to sanitize
     * @return {object} an sanitize version of the params
     */
    const sanitizeConfigParams = (params) => {
        if (!(params instanceof Object)) {
            throw new TypeError('Invalid argument: `config` must be an `Object`.')
        }

        // Extend default configuration.
        const config = angular.extend({}, this.defaultConfig, params)

        // Check if all required keys are set.
        this.requiredKeys.forEach((key) => {
            if (!config[key]) {
                throw new Error(`Missing parameter: ${key}.`)
            }
        })

        return config
    }

    /**
     * Configure
     * 
     * @param {object} params - An `object` of params to extend.
     */
    this.configure = (params) => {
        this.defaultConfig = sanitizeConfigParams(params)
    }

    /**
     * The provider
     */
    this.$get = function($window, $rootScope, $q){

        class NotificationProxy
        {
            constructor(config)
            {   
                this.config = config

                this.isSupported = !!$window.Notification
            }

            show(title, options){

                if (!$window.Notification) return false;

                this.title = title;
                this.options = options;

                // Events cache.
                this._events = [];

                if ($window.Notification.permission === 'granted') {
                    return this.createNotification();
                } else if ($window.Notification.permission !== 'denied') {
                    this.requestPermission().then(createNotification);
                }
            }

            /**
             * Create the notification.
             */
            createNotification()
            {
                // Extend options with default provider options.
                this.options = angular.extend({
                    focusWindowOnClick: true
                }, this.config || {}, this.options);

                // Create a base notification.
                try {
                    this.baseNotification = new $window.Notification(this.title, this.options);
                } catch (error) {
                    return;
                }

                // Close notification after specified delay.
                if (this.options.delay) setTimeout(angular.bind(this, this.close), this.options.delay);

                // Focus window on click.
                if (this.options.focusWindowOnClick) this.$on('click', e => $window.focus() )

                // Re-bind events.
                this._events.forEach((args) => {
                    this.$on(...args);
                });

                // Reset events.
                this._events = [];
            }

            requestPermission()
            {
                console.log($window)
                return $q(function (resolve, reject) 
                {
                    if (!$window.Notification) return reject();

                    $window.Notification.requestPermission(function (permission) {
                        // Persist permission.
                        resolve($window.Notification.permission);
                    });
                });
            }

            /**
             * Static method to get current permission.
             * It returns a string.
             */
            getPermission ()
            {
                return !$window.Notification ? undefined : $window.Notification.permission;
            }

            /**
             * Close the notification.
             */
            close()
            {
                if (this.baseNotification) this.baseNotification.close();
            }

            /**
             * Listen on event of a given type.
             * Supported events are:
             * 
             * - error
             * - show
             * - click
             * - close
             *
             * @param {String} name
             * @param {Function} listener
             */
            $on(name, listener)
            {
                // If the notification is not ready, we cache the event.
                if (!this.baseNotification) return this._events.push([name, listener]);

                this.baseNotification.addEventListener(name, applyListener);

                function applyListener(...args) {
                    $rootScope.$apply(function () {
                        listener(...args);
                    });
                }

                // Return the deregistration function.
                return function $off() {
                    this.baseNotification.removeListener(event, applyListener);
                };
            }

        }

        return new NotificationProxy(this.defaultConfig)

    }

    this.$get.$inject = ['$window', '$rootScope', '$q']
}


/**
 * Export NotificationProvider
 */
export default NotificationProvider
