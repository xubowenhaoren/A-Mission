angular.module('emission.main.diary',['emission.main.diary.list',
                                      'emission.main.diary.detail',
                                      'emission.main.diary.services',
                                      'emission.main.diary.current',
                                      'emission.main.diary.change-mode'])

.config(function($stateProvider) {
  $stateProvider
  .state('root.main.diary', {
    url: '/diary',
    views: {
      'main-diary': {
        templateUrl: 'templates/diary/list.html',
        controller: 'DiaryListCtrl'
      }
    }
  })

  .state('root.main.diary-detail', {
    url: '/diary/:tripId',
    views: {
        'main-diary': {
            templateUrl: 'templates/diary/detail.html',
            controller: 'DiaryDetailCtrl'
        }
     }
  })

  .state('root.main.current', {
      url: "/current",
      views: {
        'main-diary': {
          templateUrl: "templates/diary/current.html",
          controller: 'CurrMapCtrl'
        },
      }

  })

  .state('root.main.change-mode', {
      url: '/diary/:tripId/change-mode',
      params: {
        sectionInfo: null
      },
      views: {
        'main-diary': {
          templateUrl: "templates/diary/change-mode.html",
          controller: 'ChangeModeCtrl'
        },
      }

  });
});
