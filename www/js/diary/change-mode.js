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
            CommHelper, $sce, DiaryHelper, Timeline, ConfirmHelper, $translate, $window) {

  console.log("controller ChangeModeCtrl called with params = "+
      JSON.stringify($stateParams));

    //$scope.tripgj = Timeline.getTripWrapper($stateParams.tripId);

    $scope.userModes = DiaryHelper.userModes;
    $scope.$on('$ionicView.enter', function(ev) {

      // raw unformatted current date from timeline:
      // Timeline.data.currDay
      $scope.formattedCurrDate = moment(Timeline.data.currDay).format('LL');
      $scope.startPlace = $stateParams.sectionInfo.fmt_start_place;
      $scope.endPlace = $stateParams.sectionInfo.fmt_end_place;
      $scope.startTime = $stateParams.sectionInfo.fmt_time;
      $scope.endTime = $stateParams.sectionInfo.fmt_end_time;
      $scope.sensed_mode = $stateParams.sectionInfo.sensed_mode;
      $scope.tripgj = Timeline.getTripWrapper($stateParams.tripId);
      $scope.segment_index = $stateParams.sectionInfo.segment_index;
      $scope.selectedMode = {"text":$scope.sensed_mode,"value":""};
    });

    $scope.toDetail = function() {
      $state.go('root.main.diary-detail', {
        tripId: $stateParams.tripId,
      });
    };

    $scope.toDiary = function() {
      $state.go('root.main.diary');
    };

    $scope.onModeChange = function(obj) {
      delete obj.$$hashKey;
      console.log("in onModeChange, value selected: " + JSON.stringify(obj));

      // Set up variables
      $scope.draftInputSegment = {
        "start_ts": $scope.tripgj.sections[$scope.segment_index].properties.start_ts,
        "end_ts": $scope.tripgj.sections[$scope.segment_index].properties.end_ts,
        "segment": true
      };
      $scope.editingSegment = $scope.tripgj.sections[$scope.segment_index];

      var inputType = 'MODE';
      var input = obj;
      $scope.draftInputSegment.label = input.value;

      // Modify mode for trip section with key
      Logger.log("in onModeChange, after setting input.value = " + input.value + ", draftInputSegment = " + JSON.stringify($scope.draftInputSegment));
      var tripToUpdate = $scope.editingSegment.properties;
      let segmentKey = $scope.draftInputSegment.start_ts + "_" + $scope.draftInputSegment.end_ts;
      console.log("in onModeChange, about to store with key " + segmentKey);
      $window.cordova.plugins.BEMUserCache.putMessage(segmentKey, $scope.draftInputSegment);

      $window.cordova.plugins.BEMUserCache.putMessage(ConfirmHelper.inputDetails[inputType].key, $scope.draftInputSegment).then(function () {
        $scope.$apply(function() {
          tripToUpdate.userInput[inputType] = $scope.inputParamsSegment[inputType].value2entry[input.value];
        });
      });

      // Checking variables
      $scope.tripgj.sections[$scope.segment_index].properties.userInput["MODE"] = obj;
      console.log("in onModeChange, userInput: " + JSON.stringify($scope.tripgj.sections[$scope.segment_index].properties.userInput));
      // console.log("in onModeChange, editingSegment: " + JSON.stringify($scope.editingSegment));
      // console.log("in onModeChange, draftInputSegment: " + JSON.stringify($scope.draftInputSegment));
      $stateParams.sectionInfo.sensed_mode = input.text;
      console.log("in onModeChange, stateParams: "+ JSON.stringify($stateParams));

      // Modify trip data
      // $scope.storeSegment('MODE', obj, false);
    };


    $scope.popovers = {};
    ConfirmHelper.INPUTS.forEach(function(item, index) {
      let popoverPath = 'templates/diary/'+item.toLowerCase()+'-popover.html';
      return $ionicPopover.fromTemplateUrl(popoverPath, {
        scope: $scope
      }).then(function (popover) {
        $scope.popovers[item] = popover;
      });
    });

    $scope.openPopoverSegment = function ($event, segment_index, inputType) {
      // TODO fix userInput to load the server-side analysis prediction.
      var userInput = $scope.tripgj.sections[segment_index].properties.userInput[inputType];
      if (angular.isDefined(userInput)) {
        $scope.selectedSegment[inputType].value = userInput.value;
      } else {
        $scope.selectedSegment[inputType].value = '';
      }
      $scope.draftInputSegment = {
        "start_ts": $scope.tripgj.sections[segment_index].properties.start_ts,
        "end_ts": $scope.tripgj.sections[segment_index].properties.end_ts,
        "segment": true
      };
      $scope.editingSegment = $scope.tripgj.sections[segment_index];
      Logger.log("in openPopover, setting draftInputSegment = " + JSON.stringify($scope.draftInputSegment));
      $scope.popovers[inputType].show($event);
    };

    var closePopover = function (inputType) {
      $scope.selectedSegment[inputType] = {
        value: ''
      };
      $scope.popovers[inputType].hide();
    };

    /**
     * Store selected value for options
     * $scope.selected is for display only
     * the value is displayed on popover selected option
     */
    $scope.selectedSegment = {};
    ConfirmHelper.INPUTS.forEach(function(item, index) {
      $scope.selectedSegment[item] = {value: ''};
    });
    $scope.selectedSegment.other = {text: '', value: ''};

    $scope.chooseSegment = function (inputType) {
      var isOther = false;
      console.log("In chooseSegment, the value is ", $scope.selectedSegment[inputType].value);
      $scope.storeSegment(inputType, $scope.selectedSegment[inputType], isOther);
      closePopover(inputType);
    };

    $scope.$on('$ionicView.afterEnter', function() {
      $scope.inputParamsSegment = {};
      ConfirmHelper.INPUTS.forEach(function(item) {
        ConfirmHelper.getOptionsAndMaps(item).then(function(omObj) {
          $scope.inputParamsSegment[item] = omObj;
        });
      });
    });

    $scope.storeSegment = function (inputType, input, isOther) {
      $scope.draftInputSegment.label = input.value;
      Logger.log("in storeInput, after setting input.value = " + input.value + ", draftInputSegment = " + JSON.stringify($scope.draftInputSegment));
      var tripToUpdate = $scope.editingSegment.properties;
      let segmentKey = $scope.draftInputSegment.start_ts + "_" + $scope.draftInputSegment.end_ts;
      console.log("in storeInput, about to store with key " + segmentKey);
      $window.cordova.plugins.BEMUserCache.putMessage(segmentKey, $scope.draftInputSegment);

      console.log("in storeInput, about to store with key " + ConfirmHelper.inputDetails[inputType].key);
      $window.cordova.plugins.BEMUserCache.putMessage(ConfirmHelper.inputDetails[inputType].key, $scope.draftInputSegment).then(function () {
        $scope.$apply(function() {
          tripToUpdate.userInput[inputType] = $scope.inputParamsSegment[inputType].value2entry[input.value];
        });
      });
    }

  });
