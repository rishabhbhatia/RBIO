var app = angular.module('starter', ['ionic', 'ngCordova', 'com.2fdevs.videogular'])

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


.controller('VideoCtrl', function($scope, $cordovaCapture, VideoService,
 $timeout, $sce) {
    
    $scope.clip =  $sce.trustAsResourceUrl('http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4');
    $scope.battles = [
    {
      src: $scope.clip
    },
    {
      src: $scope.clip
    },
     {
      src: $scope.clip
    },
     {
      src: $scope.clip
    },
     {
      src: $scope.clip
    },
     {
      src: $scope.clip
    }
    ];

    $scope.captureVideo = function() {
      var options = { limit: 1, duration: 1 }; //time in seconds

      $cordovaCapture.captureVideo(options).then(function(videoData) {
        VideoService.saveVideo(videoData).success(function(data) {
          // $scope.clip = data;
          // $scope.$apply();
          $timeout(function() {
            console.log("timeout invoked");
            $scope.clip = data;
            $scope.$apply();
            $scope.clip = $sce.trustAsResourceUrl($scope.clip);
          }, 500);
        }).error(function(data) {
          console.log('ERROR: ' + data);
        });
      });
    };

    $scope.urlForClipThumb = function(clipUrl) {

      if(clipUrl === undefined || clipUrl === "") return "";

      var name = clipUrl.substr(clipUrl.lastIndexOf('/') + 1);
      var trueOrigin = cordova.file.dataDirectory + name;
      var sliced = trueOrigin.slice(0, -4);
      return sliced + '.png';
    }
     
    $scope.showClip = function(clip) {
      if(clip === undefined) return;
      console.log('show clip: ' + clip);
    }

    $scope.playVideo = function(index) {
      
      if(index === undefined) return;
      
      console.log("hello i will start playing: "+index);
     /* var myVideo = document.getElementsByTagName('video')[0];
      myVideo.src = clips[index];
      myVideo.load();
      myVideo.play();*/
    }

    this.config = {
        sources: [
          {src: $sce.trustAsResourceUrl("data/data/com.ionicframework.rbio/files/EwQkGVID_20160910_175236.mp4"), type: "video/mp4"}
        ],
        tracks: [
          {
            default: ""
          }
        ],
        theme: "bower_components/videogular-themes-default/videogular.css",
        plugins: {
          poster: "http://www.videogular.com/assets/images/videogular.png"
        }
      };
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

.service('VideoService', function($q) {
    var deferred = $q.defer();
    var promise = deferred.promise;
     
    promise.success = function(fn) {
      promise.then(fn);
      return promise;
    }
    promise.error = function(fn) {
      promise.then(null, fn);
      return promise;
    }

     // Resolve the URL to the local file
    // Start the copy process
    function createFileEntry(fileURI) {
      window.resolveLocalFileSystemURL(fileURI, function(entry) {
        return copyFile(entry);
      }, fail);
    }
     
    // Create a unique name for the videofile
    // Copy the recorded video to the app dir
    function copyFile(fileEntry) {
      var name = fileEntry.fullPath.substr(fileEntry.fullPath.lastIndexOf('/') + 1);
      var newName = makeid() + name;
     
      window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function(fileSystem2) {
          fileEntry.copyTo(fileSystem2, newName, function(succ) {
            return onCopySuccess(succ);
          }, fail);
        },
        fail
      );
    }
     
    // Called on successful copy process
    // Creates a thumbnail from the movie
    // The name is the moviename but with .png instead of .mov
    function onCopySuccess(entry) {
      var name = entry.nativeURL.slice(0, -4);
      window.PKVideoThumbnail.createThumbnail (entry.nativeURL, name + '.png', function(prevSucc) {
        return prevImageSuccess(prevSucc);
      }, fail);
    }
     
    // Called on thumbnail creation success
    // Generates the currect URL to the local moviefile
    // Finally resolves the promies and returns the name
    function prevImageSuccess(succ) {
      var correctUrl = succ.slice(0, -4);
      correctUrl += '.mp4';
      deferred.resolve(correctUrl);
    }
     
    // Called when anything fails
    // Rejects the promise with an Error
    function fail(error) {
      console.log('FAIL: ' + error.code);
      deferred.reject('ERROR');
    }
     
    // Function to make a unique filename
    function makeid() {
      var text = '';
      var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      for ( var i=0; i < 5; i++ ) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
      }
      return text;
    }
     
    // The object and functions returned from the Service
    return {
      // This is the initial function we call from our controller
      // Gets the videoData and calls the first service function
      // with the local URL of the video and returns the promise
      saveVideo: function(data) {
        createFileEntry(data[0].localURL);
        return promise;
      }
    }
})