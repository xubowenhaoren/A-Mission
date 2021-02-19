'use strict';

angular.module('emission.main.diary.change-mode', ['ui-leaflet',
  'emission.services',
  'ionic',
  'emission.incident.posttrip.manual',
  'rzModule',
  'emission.plugin.kvstore',
  'emission.plugin.logger']).
controller('ChangeModeCtrl',
  function ($scope, $state, $stateParams, $ionicPopup, nzTour, $ionicPopover, storage,
            CommHelper, $sce, DiaryHelper, Timeline) {
    /*
      * Checks if it is the first time the user has loaded the diary tab. If it is then
      * show a walkthrough and store the info that the user has seen the tutorial.
      */
    // var checkTutorialDone = function () {
    //   var ACCESSMAP_DONE_KEY = 'accessmap_tutorial_done';
    //   var accessmapTutorialDone = storage.get(ACCESSMAP_DONE_KEY);
    //   if (!accessmapTutorialDone) {
    //     $scope.startWalkthrough();
    //     storage.set(ACCESSMAP_DONE_KEY, true);
    //   }
    // };

    // var sliceUUID = function (uuidWithNoDash) {
    //   var uuidParts = [];
    //   uuidParts.push(uuidWithNoDash.slice(0,8));
    //   uuidParts.push(uuidWithNoDash.slice(8,12));
    //   uuidParts.push(uuidWithNoDash.slice(12,16));
    //   uuidParts.push(uuidWithNoDash.slice(16,20));
    //   uuidParts.push(uuidWithNoDash.slice(20,32));
    //   return uuidParts.join('-');
    // };

    //$scope.tripgj = Timeline.getTripWrapper($stateParams.tripId);

    $scope.$on('$ionicView.enter', function(ev) {
      // Workaround from
      // https://github.com/driftyco/ionic/issues/3433#issuecomment-195775629
      // if(ev.targetScope !== $scope) {
      //   return;
      // }

      // raw unformatted current date from timeline:
      // Timeline.data.currDay
      $scope.formattedCurrDate = moment(Timeline.data.currDay).format('LL');
    });

    $scope.toDetail = function (param) {
      $state.go('root.main.diary-detail', {
        tripId: param
      });
    };
  });
