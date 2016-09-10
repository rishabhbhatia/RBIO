var app = angular.module('starter', ['ionic', 'ngCordova'])

app.value('currentUser',{})


.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

    // $ionicConfigProvider.tabs.position('bottom');

    $stateProvider
    .state('login', {
        url: '/login',
        templateUrl: 'templates/login.html',
        controller: 'LoginController'
    })

    $stateProvider
    .state('signup', {
        url: '/signup',
        templateUrl: 'templates/signup.html',
        controller: 'SignupController'
    })

     $stateProvider
    .state('resetPassword', {
        url: '/resetPassword',
        templateUrl: 'templates/resetpassword.html',
        controller: 'ResetPasswordController'
    })

    $stateProvider
    .state('tabs', {
        url: '/tab',
        abstract: true,
        templateUrl: 'templates/tabs.html'
    })

     .state('tabs.home', {
      url: '/home',
      views: {
        'home-tab': {
          templateUrl: 'templates/home.html',
          controller: 'PartyController'
        }
      }
    })

     .state('tabs.messages', {
      url: '/messages',
      views: {
        'messages-tab': {
          templateUrl: 'templates/messages.html',
          controller: 'MessagesController'
        }
      }
    })

     .state('tabs.profile', {
      url: '/profile',
      views: {
        'profile-tab': {
          templateUrl: 'templates/profile.html',
          controller: 'ProfileController'
        }
      }
    })

     $stateProvider
    .state('socialize', {
        url: '/socialize',
        templateUrl: 'templates/socialize.html',
        controller: 'SocializeController'
    })

    $urlRouterProvider.otherwise('/tab/home');
    // $urlRouterProvider.otherwise('/login');
})

.controller("LoginController", function($scope, $http, $state,
 $ionicPopup, LoginService) {
  $scope.data = {};

  $scope.login = function() {
    if($scope.data.username === undefined ||
     $scope.data.password === undefined) 
    {
      var alertPopup = $ionicPopup.alert({
                title: 'Invalid input',
                template: 'Please enter your credentials!'
            });
      return;
    }
  console.log("Please log me in. I'm "+$scope.data.username+
    " & my password is: "+$scope.data.password);

      LoginService.loginUser($scope.data.username, $scope.data.password).
      success(function(data) {

      currentUser = {
        username: $scope.data.username
      }

      $state.go('tabs.home');

      }).error(function(data) {
          var alertPopup = $ionicPopup.alert({
              title: 'Login failed!',
              template: 'Please check your credentials!'
          });
        });

      }

      $scope.signup = function() {
        $state.go("signup");
      }

       $scope.resetPassword = function() {
        $state.go("resetPassword");
      }

})

.controller("SignupController", function($scope, $http, $state,
 $ionicPopup, SignupService) {

  $scope.signupdata = {};

  $scope.signup = function() {

    if($scope.signupdata.name === undefined || 
      $scope.signupdata.name === undefined) 
    {
        var alertPopup = $ionicPopup.alert({
                title: 'Missing input',
                template: 'Please complete the form!'
            });
      return;
    }

    SignupService.signupUser($scope.signupdata.name, $scope.signupdata.email).
    success(function(data) {

    currentUser = {
      name: $scope.signupdata.name,
      email: $scope.signupdata.email
    }

    $state.go('tabs.home');

    }).error(function(data) {
        var alertPopup = $ionicPopup.alert({
            title: 'Signup failed!',
            template: 'Please check your credentials!'
        });
      });

  }
})

.controller("ResetPasswordController", function($scope, $http, $state,
 $ionicPopup, ResetPasswordService) {

  $scope.resetpassworddata = {};

  $scope.resetPassword = function() {

    if($scope.resetpassworddata.username === undefined && 
      $scope.resetpassworddata.email === undefined) 
    {
        var alertPopup = $ionicPopup.alert({
                title: 'Wrong input',
                template: 'Please fill one field!'
            });
      return;
    }

    ResetPasswordService.resetPassword($scope.resetpassworddata.username,
    $scope.resetpassworddata.email).
    success(function(data) {

    var alertPopup = $ionicPopup.alert({
                title: 'Success',
                template: 'Check your inbox for new password'
            });

    }).error(function(data) {
        var alertPopup = $ionicPopup.alert({
            title: 'Request failed!',
            template: 'Please check your input!'
        });
      });

  }
})


.controller("PartyController", [ "$scope" , "$http", "$state" ,
  function($scope, $http, $state) {

      // $http.get("js/data.json").success(function(data) {
      $http.get("192.168.1.7:3000/dictionary-api").success(function(data) {
        $scope.parties = data;
        console.log("hello to: "+data.length);

      $scope.goingToEvent = function(eventIndex) {
      console.log("I'm going to event at: "+eventIndex);
      };

      $scope.commentOnEvent = function(eventIndex) {
      console.log("I want to comment on event at: "+eventIndex);
      };

      $scope.showPeopleGoingToEvent = function(eventIndex) {
      console.log("Show me people going to event at: "+eventIndex);
      };

      $scope.notGoingToEvent = function(eventIndex) {
      console.log("I'm not going to event at: "+eventIndex);
      };

    });

}])

.controller("MessagesController", [ "$scope" , "$http", "$state" ,
  function($scope, $http, $state) {

      $http.get("192.168.1.7:3000/dictionary-api").success(function(data) {
        $scope.messages = data;

    });

}])

.controller("ProfileController", function($scope, $http, $state, $cordovaContacts) {

      $http.get("js/data.json").success(function(data) {
        $scope.user = data[0];
        console.log("hello to: "+$scope.user.name);

     $cordovaContacts.find([]).then(function(allContacts) { //omitting parameter to .find() causes all contacts to be returned
          $scope.contacts = allContacts;
          console.log(allContacts.length);
        });
        $scope.socialize = function(){
          console.log("open socialize");
          $state.go("socialize");
        };

    });

})

.controller("SocializeController", function($scope, $http, $state, $cordovaContacts) {

    console.log("hello socialize controller");
    var coptions = { fields: ['*'], multiple: true };
    $cordovaContacts.find(coptions).then(function(allContacts) { //omitting parameter to .find() causes all contacts to be returned
      $scope.contacts = allContacts;
      console.log(allContacts.length);
    })

    $scope.getAllContacts = function() {
    $cordovaContacts.find().then(function(allContacts) { //omitting parameter to .find() causes all contacts to be returned
      $scope.contacts = allContacts;
      console.log(allContacts.length);
    }
  )};

})

.service('LoginService', function($q) {
    return {
        loginUser: function(name, pw) {
            var deferred = $q.defer();
            var promise = deferred.promise;
 
            if (name === 'rishabh' && pw === 'pass') {
                deferred.resolve('Welcome ' + name + '!');
            } else {
                deferred.reject('Wrong credentials.');
            }
            promise.success = function(fn) {
                promise.then(fn);
                return promise;
            }
            promise.error = function(fn) {
                promise.then(null, fn);
                return promise;
            }
            return promise;
        }
    }
})

.service('SignupService', function($q) {
    return {
        signupUser: function(name, email) {
            var deferred = $q.defer();
            var promise = deferred.promise;
 
            if (name !== undefined && email !== undefined) {
                deferred.resolve('Welcome ' + name + '!');
            } else {
                deferred.reject('Missing credentials.');
            }
            promise.success = function(fn) {
                promise.then(fn);
                return promise;
            }
            promise.error = function(fn) {
                promise.then(null, fn);
                return promise;
            }
            return promise;
        }
    }
})

.service('ResetPasswordService', function($q) {
    return {
        resetPassword: function(username, email) {
            var deferred = $q.defer();
            var promise = deferred.promise;
 
            if (username !== undefined || email !== undefined) {
                deferred.resolve('Request Sent ' + username + '!');
            } else {
                deferred.reject('Missing input.');
            }
            promise.success = function(fn) {
                promise.then(fn);
                return promise;
            }
            promise.error = function(fn) {
                promise.then(null, fn);
                return promise;
            }
            return promise;
        }
    }
})