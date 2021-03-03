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
    });

    $scope.toDetail = function() {
      $state.go('root.main.diary-detail', {
        tripId: $stateParams.tripId,
      });
    };

    $scope.toDiary = function() {
      $state.go('root.main.diary');
    };

    $scope.setMode = function(mode) {
      console.log("User has selected: "+mode);
    }


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

    /**
     * Embed 'inputType' to the segment
     */
    $scope.populateSegmentInputFromTimeline = function (inputType) {
      console.log("populateSegmentInputFromTimeline called");
      let segment = $scope.tripgj.sections[$scope.segment_index];
      console.log("populateSegmentInputFromTimeline: currently checking section " + JSON.stringify(segment.id));
      DiaryHelper.getUserInputForSegment(segment, function (tempRes) {
        console.log("populateSegmentInputFromTimeline: get back", JSON.stringify(tempRes));
        if (angular.isDefined(tempRes) && tempRes.length > 0) {
          let userInput = tempRes[0];
          // userInput is an object with data + metadata
          // the label is the "value" from the options
          var userInputEntry = $scope.inputParamsSegment[inputType].value2entry[userInput.data.label];
          if (!angular.isDefined(userInputEntry)) {
            userInputEntry = ConfirmHelper.getFakeEntry(userInput.data.label);
            $scope.inputParamsSegment[inputType].options.push(userInputEntry);
            $scope.inputParamsSegment[inputType].value2entry[userInput.data.label] = userInputEntry;
          }
          console.log("Mapped label " + userInput.data.label + " to entry " + JSON.stringify(userInputEntry));
          segment.properties.userInput[inputType] = userInputEntry;
          Logger.log("populateSegmentInputFromTimeline: Set "
            + inputType + " " + JSON.stringify(userInputEntry) + " for trip id " + JSON.stringify($scope.tripgj.data.id)
            + ", for segment " + JSON.stringify(segment.id));
        } else {
          Logger.log("populateSegmentInputFromTimeline: Skipped for trip id " + JSON.stringify($scope.tripgj.data.id)
            + ", for segment " + JSON.stringify(segment.id));
        }
      });
      $scope.editingSegment = angular.undefined;
    }

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
    $scope.selectedSegment = {}
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
      $scope.inputParamsSegment = {}
      ConfirmHelper.INPUTS.forEach(function(item) {
        ConfirmHelper.getOptionsAndMaps(item).then(function(omObj) {
          $scope.inputParamsSegment[item] = omObj;
          if (item === "MODE") {
            $scope.populateSegmentInputFromTimeline(item);
          }
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
