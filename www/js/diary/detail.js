'use strict';
angular.module('emission.main.diary.detail',['ui-leaflet', 'ng-walkthrough',
                                      'nvd3', 'emission.plugin.kvstore',
                                      'emission.services', 'emission.plugin.logger',
                                      'emission.incident.posttrip.manual',
                                      'emission.main.common.services'])

.controller("DiaryDetailCtrl", function($state, $scope, $rootScope, $window, $stateParams, $ionicActionSheet,
                                        leafletData, leafletMapEvents, nzTour, KVStore,
                                        Logger, Timeline, DiaryHelper, Config, ConfirmHelper,
                                        CommHelper, PostTripManualMarker, $translate, $ionicPopover) {
  console.log("controller DiaryDetailCtrl called with params = "+
    JSON.stringify($stateParams));

  $scope.mapCtrl = {};
  angular.extend($scope.mapCtrl, {
    defaults : {
    }
  });

  angular.extend($scope.mapCtrl.defaults, Config.getMapTiles())

  $scope.formattedTripDate = moment(Timeline.data.currDay).format('LL');

  var mapEvents = leafletMapEvents.getAvailableMapEvents();
  for (var k in mapEvents) {
    var eventName = 'leafletDirectiveMap.detail.' + mapEvents[k];
    $scope.$on(eventName, function(event, data){
        console.log("in mapEvents, event = "+JSON.stringify(event.name)+
              " leafletEvent = "+JSON.stringify(data.leafletEvent.type)+
              " leafletObject = "+JSON.stringify(data.leafletObject.getBounds()));
        $scope.eventDetected = event.name;
    });
  }

  /*
  leafletData.getMap('detail').then(function(map) {
    map.on('touch', function(ev) {
      alert("touch" + ev.latlng); // ev is an event object (MouseEvent in this case)
    });
  });
  */

  $scope.$on('leafletDirectiveMap.detail.resize', function(event, data) {
      console.log("diary/detail received resize event, invalidating map size");
      data.leafletObject.invalidateSize();
  });

  $scope.refreshTiles = function() {
      $scope.$broadcast('invalidateSize');
  };

  $scope.getFormattedDate = DiaryHelper.getFormattedDate;
  $scope.arrowColor = DiaryHelper.arrowColor;
  $scope.parseEarlierOrLater = DiaryHelper.parseEarlierOrLater;
  $scope.getEarlierOrLater = DiaryHelper.getEarlierOrLater;
  $scope.getLongerOrShorter = DiaryHelper.getLongerOrShorter;
  $scope.getIcon = DiaryHelper.getIcon;
  $scope.getHumanReadable = DiaryHelper.getHumanReadable;
  $scope.trip = Timeline.getTrip($stateParams.tripId);
  $scope.getKmph = DiaryHelper.getKmph;
  $scope.getFormattedDistance = DiaryHelper.getFormattedDistance;
  $scope.getSectionDetails = DiaryHelper.getSectionDetails;
  $scope.getFormattedTime = DiaryHelper.getFormattedTime;
  $scope.getLocalTimeString = DiaryHelper.getLocalTimeString;
  $scope.getFormattedTimeRange = DiaryHelper.getFormattedTimeRange;
  $scope.getFormattedDuration = DiaryHelper.getFormattedDuration;
  $scope.getTripDetails = DiaryHelper.getTripDetails;
  $scope.tripgj = Timeline.getTripWrapper($stateParams.tripId);

  $scope.formattedSectionProperties = $scope.tripgj.sections.map(function(s, index) {
    return {"fmt_time": DiaryHelper.getLocalTimeString(s.properties.start_local_dt),
            "fmt_end_time": DiaryHelper.getLocalTimeString(s.properties.end_local_dt),
            "fmt_start_place": s.properties.start_point_name.name,
            "fmt_end_place": s.properties.end_point_name.name,
            "fmt_time_range": DiaryHelper.getFormattedTimeRange(s.properties.end_ts, s.properties.start_ts),
            "fmt_distance": DiaryHelper.getFormattedDistance(s.properties.distance),
            "sensed_mode": s.properties.sensed_mode,
            "icon": DiaryHelper.getIcon(s.properties.sensed_mode),
            "colorStyle": {color: DiaryHelper.getColor(s.properties.sensed_mode)},
            "segment_index": index
          };
  });

  console.log("trip.start_place = " + JSON.stringify($scope.trip.start_place));

  var data  = [];
  var start_ts = $scope.trip.properties.start_ts;
  var totalTime = 0;
  for (var s in $scope.tripgj.sections) {
    // ti = time index
    for (var ti in $scope.tripgj.sections[s].properties.times) {
      totalTime = ($scope.tripgj.sections[s].properties.times[ti] - start_ts);
      data.push({x: totalTime, y: $scope.tripgj.sections[s].properties.speeds[ti] });
    }
  }
  var dataset = {
      values: data,
      key: $translate.instant('details.speed'),
      color: '#7777ff',
    }
  var chart = nv.models.lineChart()
                .margin({left: 65, right: 10})  //Adjust chart margins to give the x-axis some breathing room.
                .useInteractiveGuideline(false)  //We want nice looking tooltips and a guideline!
                .x(function(t) {return t.x / 60})
                .showLegend(true)       //Show the legend, allowing users to turn on/off line series.
                .showYAxis(true)        //Show the y-axis
                .showXAxis(true);        //Show the x-axis
  chart.xAxis
    .tickFormat(d3.format(".1f"))
    .axisLabel($translate.instant('details.time') + ' (mins)');

  chart.yAxis     //Chart y-axis settings
      .axisLabel($translate.instant('details.speed') + ' (m/s)')
      .tickFormat(d3.format('.1f'));

  d3.select('#chart svg')    //Select the <svg> element you want to render the chart in.
      .datum([dataset,])         //Populate the <svg> element with chart data...
      .call(chart);          //Finally, render the chart!


  //Update the chart when window resizes.
  nv.utils.windowResize(chart.update);
  nv.addGraph(chart);

  /* START: ng-walkthrough code */
  // Tour steps
  var tour = {
    config: {
      mask: {
        visibleOnNoTarget: true,
        clickExit: true
      },
      previousText: $translate.instant('tour-previous'),
      nextText: $translate.instant('tour-next'),
      finishText: $translate.instant('tour-finish')
    },
    steps: [{
      target: '#detail',
      content: $translate.instant('details.tour-detail-content')
    }, {
      target: '#sectionList',
      content: $translate.instant('details.tour-sectionList-content')
    }, {
      target: '#sectionPct',
      content: $translate.instant('details.tour-sectionPct-content')
    }]
  };

  var startWalkthrough = function () {
    nzTour.start(tour).then(function(result) {
      Logger.log("detail walkthrough start completed, no error");
    }).catch(function(err) {
      Logger.displayError("detail walkthrough start errored", err);
    });
  };


  var checkDetailTutorialDone = function () {
    var DETAIL_DONE_KEY = 'detail_tutorial_done';
    var detailTutorialDone = KVStore.getDirect(DETAIL_DONE_KEY);
    if (!detailTutorialDone) {
      startWalkthrough();
      KVStore.set(DETAIL_DONE_KEY, true);
    }
  };

  $scope.startWalkthrough = function () {
    startWalkthrough();
  }

  $scope.toChangeMode = function (sectionFmt, trip_gj) {
    $state.go('root.main.change-mode', {
      tripId: $stateParams.tripId,
      sectionInfo: sectionFmt,
      tripgj: trip_gj
    });

  };

  $scope.$on('$ionicView.afterEnter', function(ev) {
    // Workaround from
    // https://github.com/driftyco/ionic/issues/3433#issuecomment-195775629
    if(ev.targetScope !== $scope)
      return;
    checkDetailTutorialDone();

  });


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
    for (let s_index in $scope.tripgj.sections) {
      let segment = $scope.tripgj.sections[s_index];
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
    }
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

  /* END: ng-walkthrough code */
})
