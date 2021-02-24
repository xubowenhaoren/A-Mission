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
            CommHelper, $sce, DiaryHelper, Timeline, ConfirmHelper, $translate) {

  console.log("controller ChangeModeCtrl called with params = "+
      JSON.stringify($stateParams));

    //$scope.tripgj = Timeline.getTripWrapper($stateParams.tripId);

    $scope.$on('$ionicView.enter', function(ev) {

      // raw unformatted current date from timeline:
      // Timeline.data.currDay
      $scope.formattedCurrDate = moment(Timeline.data.currDay).format('LL');
      $scope.startPlace = $stateParams.sectionInfo.fmt_start_place;
      $scope.endPlace = $stateParams.sectionInfo.fmt_end_place;
      $scope.sensed_mode = $stateParams.sectionInfo.sensed_mode;
      $scope.tripgj = $stateParams.tripgj;
    });

    // $scope.toDetail = function (param) {
    //   $state.go('root.main.diary-detail', {
    //     tripId: param
    //   });
    // };
  });
