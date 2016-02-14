// Ionic E-Mission App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'emission' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'emission.services' is found in services.js
// 'emission.controllers' is found in controllers.js
'use strict';

angular.module('emission', ['ionic', 'emission.controllers','emission.services',
    'emission.intro', 'emission.main'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  var waitFn = function($q) {
      var deferred = $q.defer();
      ionic.Platform.ready(function() {
          console.log("About to start initializing plugins");
          var promises = [];
          // Note that the usercache currently does not support writing from
          // javascript, so we don't need to initialize the database. If we do
          // change that, we need to add plugin init functions similar to the
          // other DB tables, and make this plugin start onload as well

          // Init the sync on android, due to restrictions on background
          // operation, the sync code will be invoked from the data collection
          // when a remote push arrives. But on android a service is involved
          // so the sync and the data collection can appear in parallel.
          promises.push($q(function(resolve, reject) {
            window.cordova.plugins.BEMServerSync.init();
            console.log("serversync init done, resolving promise...");
            resolve();
          }));

          promises.push($q(function(resolve, reject) {
            window.cordova.plugins.BEMDataCollection.startupInit();
            console.log("data collection init done, resolving promise...");
            resolve();
          }));

          // We don't actually resolve with anything, because we don't need to return
          // anything. We just need to wait until the platform is
          // ready and at that point, we can use our usual window.sqlitePlugin stuff
          console.log("Promised all plugin inits of length "+promises.length);
          $q.all(promises).then(function(results) {
              console.log("All promises resolved, resolving deferred");
              deferred.resolve();
          }, function(error) {
              console.log("Some promise rejected"+error+", rejecting deferred");
              alert("Some promise rejected, rejecting deferred");
              deferred.reject();
          });
      });
      return deferred.promise;
  };

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set a few states which the app can be in.
  // The 'intro' and 'diary' states are found in their respective modules
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the root
    .state('root', {
    url: '/root',
    abstract: true,
    // templateUrl: 'templates/main.html',
    template: '<ion-nav-view/>',
    resolve: {
        cordova: waitFn
    },
    controller: 'RootCtrl'
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/root/intro');

});