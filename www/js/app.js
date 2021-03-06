var app = angular.module('starter', ['ionic', 'ngCordova', 'yaru22.angular-timeago',
  "com.2fdevs.videogular",
      "com.2fdevs.videogular.plugins.controls",
      "com.2fdevs.videogular.plugins.overlayplay",
      "com.2fdevs.videogular.plugins.poster"])

app.value('currentUser',{})

app.directive('hideTabBar', function($timeout) {
  var style = angular.element('<style>').html(
    '.has-tabs.no-tabs:not(.has-tabs-top) { bottom: 0; }\n' +
    '.no-tabs.has-tabs-top { top: 44px; }');
  document.body.appendChild(style[0]);
  return {
    restrict: 'A',
    compile: function(element, attr) {
      var tabBar = document.querySelector('.tab-nav');
      return function($scope, $element, $attr) {
        var scroll = $element[0].querySelector('.scroll-content');
        $scope.$on('$ionicView.beforeEnter', function() {
          tabBar.classList.add('slide-away');
          scroll.classList.add('no-tabs');
        })
        $scope.$on('$ionicView.beforeLeave', function() {
          tabBar.classList.remove('slide-away');
          scroll.classList.remove('no-tabs')
        });
      }
    }
  };
})


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
          controller: 'BattleController'
        }
      }
    })

     .state('tabs.detail', {
      url: '/home/:battle',
      views: {
        'home-tab': {
          templateUrl: 'templates/battledetail.html',
          controller: 'BattleDetailsController'
        }
      }
    })

     .state('tabs.videofinalizer', {
      url: '/home/:battle',
      views: {
        'home-tab': {
          templateUrl: 'templates/battlecapturedvideofinalizer.html',
          controller: 'BattleVideoFinalizeController'
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

.controller("MessagesController", [ "$scope" , "$http", "$state" ,
  function($scope, $http, $state) {


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

.controller('BattleController', function($scope, $cordovaCapture, VideoService,
 $timeout, $sce, $state, ToggleVideoService, $cordovaSocialSharing) {

    $scope.clip1url = 'http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4';
    $scope.clip2url = 'http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4';
    $scope.clip1 =  $sce.trustAsResourceUrl($scope.clip1url);
    $scope.clip2 =  $sce.trustAsResourceUrl($scope.clip2url);
    $scope.warrior1ProfilePhoto = `https://encrypted-tbn3.gstatic.com/images?q=tbn:
      ANd9GcQdjiGN2euMAHiKkHr4WfLpUwOpsYtYvBOX_RYNHAbILf-RNuO4`;
    $scope.warrior2ProfilePhoto = `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSEsyoT5sbcLZ7uiwHmSE35xfFzlJcrSAUaL54X2AohKrNDnxTtaz6sIA`;
    $scope.warrior1CountryFlagPhoto = `http://www.mapsofindia.com/maps/india/india-flag-1024x600.jpg`;
    $scope.warrior2CountryFlagPhoto = `http://inkwear.co.uk/wp-content/uploads/FLAG-SPAINMED5X3CM-2-1.jpg`;


    $scope.battles = [
    {
      warriors: [
      {
        name: "Rick Costanza",
        email: "ricko@gmail.com",
        photourl: $scope.warrior1ProfilePhoto,
        country: {
          name: "India",
          flagphotourl: $scope.warrior1CountryFlagPhoto
        },
        battlesrc: $scope.clip1,
        battlesrcurl: $scope.clip1url
      },
      {
        name: "Josh Madhouse",
        email: "jmad@gmail.com",
        photourl: $scope.warrior2ProfilePhoto,
        country: {
          name: "Spain",
          flagphotourl: $scope.warrior2CountryFlagPhoto
        },
        battlesrc: $scope.clip2,
        battlesrcurl: $scope.clip2url
      }
      ],
      isvoted: true,
      battletype: {
        type: "challenged"
      }
    },
    {
      warriors: [
      {
        name: "Rick Costanza",
        email: "ricko@gmail.com",
        photourl: $scope.warrior1ProfilePhoto,
        country: {
          name: "India",
          flagphotourl: $scope.warrior1CountryFlagPhoto
        },
        battlesrc: $scope.clip1,
        battlesrcurl: $scope.clip1url
      }
     /* ,
      {
        name: "Josh Madhouse",
        email: "jmad@gmail.com",
        photourl: $scope.warrior2ProfilePhoto,
        country: {
          name: "Spain",
          flagphotourl: $scope.warrior2CountryFlagPhoto
        },
        battlesrc: $scope.clip2,
        battlesrcurl: $scope.clip1url
      }*/
      ],
      isvoted: false,
      battletype: {
        type: "open"
      }
    }
    ];

    $scope.captureVideo = function() {

    $scope.newbattle = 
    {
      warriors: [
      {
        name: "Nigga Killer",
        email: "niggako@gmail.com",
        photourl: $scope.warrior1ProfilePhoto,
        country: {
          name: "USA",
          flagphotourl: $scope.warrior1CountryFlagPhoto
        },
        battlesrc: "",
        battlesrcurl: ""
      }
      ],
      isvoted: false,
      battletype: {
        type: "open"
      }
    };

      var options = { limit: 1, duration: 5 }; //time in seconds

      $cordovaCapture.captureVideo(options).then(function(videoData) {
      VideoService.saveVideo(videoData).success(function(data) {

        $timeout(function() {
          console.log("timeout invoked");
          $scope.newbattle.warriors[0].battlesrc = $sce.trustAsResourceUrl(data);
          $scope.newbattle.warriors[0].battlesrcurl = data;
          $scope.$apply();

          $state.go('tabs.videofinalizer', {battle : angular.toJson($scope.newbattle)});

        }, 50);
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

    $scope.toggleVideo = function(index) {

      var myVideo = document.getElementsByTagName('video')[index];
      var playpausebutton = document.getElementsByClassName("playpause")[index];
      
      ToggleVideoService.toggleVideo(myVideo, playpausebutton);
      
    }

    $scope.toggleVote = function(index) {
        console.log("I toggle my vote for battle at index: "+index);
        $scope.battles[index].isVoted = !$scope.battles[index].isVoted;
      }

      $scope.commentOnBattle = function(index) {
        console.log("I comment on battle at index: "+index);
      }

      $scope.shareBattle = function(index) {
        console.log("I share battle at index: "+index);
         $cordovaSocialSharing
          // .share("Hola rishabh", "", null, $scope.battles[index].warriors.photourl) // Share via native share sheet
          .share("Hola rishabh", "", null, "www.google.com") // Share via native share sheet
          .then(function(result) {
            // Success!
            console.log('successfully shared');
          }, function(err) {
            // An error occured. Show a message to the user
            console.log("gand fatt gayi");
          });
      }

      $scope.showBattleDetails = function(battle) {
        $state.go('tabs.detail', {battle : angular.toJson(battle)});
      }

      $scope.refreshBattles = function() {

          $scope.battles = [
          {
            warriors: [
            {
              name: "Rick Costanza",
              email: "ricko@gmail.com",
              photourl: $scope.warrior1ProfilePhoto,
              country: {
                name: "India",
                flagphotourl: $scope.warrior1CountryFlagPhoto
              },
              battlesrc: $scope.clip1,
              battlesrcurl: $scope.clip1url
            },
            {
              name: "Josh Madhouse",
              email: "jmad@gmail.com",
              photourl: $scope.warrior2ProfilePhoto,
              country: {
                name: "Spain",
                flagphotourl: $scope.warrior2CountryFlagPhoto
              },
              battlesrc: $scope.clip2,
              battlesrcurl: $scope.clip2url
            }
            ],
            isvoted: true,
            battletype: {
              type: "challenged"
            }
          },
          {
            warriors: [
            {
              name: "Rick Costanza",
              email: "ricko@gmail.com",
              photourl: $scope.warrior1ProfilePhoto,
              country: {
                name: "India",
                flagphotourl: $scope.warrior1CountryFlagPhoto
              },
              battlesrc: $scope.clip1,
              battlesrcurl: $scope.clip1url
            }
           /* ,
            {
              name: "Josh Madhouse",
              email: "jmad@gmail.com",
              photourl: $scope.warrior2ProfilePhoto,
              country: {
                name: "Spain",
                flagphotourl: $scope.warrior2CountryFlagPhoto
              },
              battlesrc: $scope.clip2,
              battlesrcurl: $scope.clip1url
            }*/
            ],
            isvoted: false,
            battletype: {
              type: "open"
            }
          }
          ];

          $scope.$broadcast('scroll.refreshComplete');
      }

  /*  this.config = {
        sources: [
          {src: $sce.trustAsResourceUrl($scope.clip1url), type: "video/mp4"}
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
      };*/

      
})

.controller("BattleDetailsController", function($scope, $http, $state, $sce, ToggleVideoService) {

  $scope.shouldShowDelete = false;
  $scope.shouldShowReorder = false;
  $scope.listCanSwipe = false;

  $scope.usercomment = "";

  $scope.warrior1ProfilePhoto = `https://encrypted-tbn3.gstatic.com/images?q=tbn:
    ANd9GcQdjiGN2euMAHiKkHr4WfLpUwOpsYtYvBOX_RYNHAbILf-RNuO4`;
  $scope.warrior2ProfilePhoto = `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSEsyoT5sbcLZ7uiwHmSE35xfFzlJcrSAUaL54X2AohKrNDnxTtaz6sIA`;
  $scope.warrior1CountryFlagPhoto = `http://www.mapsofindia.com/maps/india/india-flag-1024x600.jpg`;
  $scope.warrior2CountryFlagPhoto = `http://inkwear.co.uk/wp-content/uploads/FLAG-SPAINMED5X3CM-2-1.jpg`;

  $scope.comments = [
    {
      "commentby" : {
          name: "Rick Costanza",
          email: "ricko@gmail.com",
          photourl: $scope.warrior1ProfilePhoto,
          country: {
            name: "India",
            flagphotourl: $scope.warrior1CountryFlagPhoto
          },
          battlesrc: $scope.clip1,
          battlesrcurl: $scope.clip1url
        },
        "text" : "Wow, fucking cool battle!",
        "timestamp": 1474189322
    }
  ];

  $scope.battle = angular.fromJson($state.params.battle);
  $scope.warrior1battlesrc = $sce.trustAsResourceUrl($scope.battle.warriors[0].battlesrcurl);
  console.log($scope.battle);

  $scope.toggleVideo = function() {
    var myVideo = document.getElementById('videodetails');
    var playpausebutton = document.getElementById("playpausedetails");

    ToggleVideoService.toggleVideo(myVideo, playpausebutton);
  }

  $scope.postComment =function() {
    console.log("Post user comment: "+$scope.usercomment);

    if($scope.usercomment === undefined || $scope.usercomment.trim() === '') return;

    var usercommentobject = {
    "commentby" : {
        name: "Rick Costanza",
        email: "ricko@gmail.com",
        photourl: $scope.warrior1ProfilePhoto,
        country: {
          name: "India",
          flagphotourl: $scope.warrior1CountryFlagPhoto
        },
        battlesrc: $scope.clip1,
        battlesrcurl: $scope.clip1url
      },
      "comment" : $scope.usercomment,
      "timestamp": moment()
    }

    $scope.comments.push(usercommentobject);

    $scope.usercomment = '';
  }
})

.controller("BattleVideoFinalizeController", function($scope, $http, $state, $sce) {

  $scope.battle = angular.fromJson($state.params.battle);
  $scope.warrior1battlesrc = $sce.trustAsResourceUrl($scope.battle.warriors[0].battlesrcurl);
  console.log($scope.battle);

  $scope.startBattle = function() {
    console.log("start battle, basically post to server & go back to main screen");
  }

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

.service('ToggleVideoService', function($q) {
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
     
    return {
      toggleVideo : function(myVideo, playpausebutton) {
            
      console.log("hello i will toggle video");

      myVideo.addEventListener('ended',myHandler,false);
      function myHandler(e) {
        console.log("The video has finished");
      }


      if(!myVideo.paused) {
        playpausebutton.style.display = 'block';
        myVideo.pause();
      }else {
        if(myVideo.src === undefined) {
          myVideo.src = $scope.battles[index].battleSrc;
          myVideo.load();
        }
        
        playpausebutton.style.display = 'none';
        myVideo.play();
      }
      
        return promise;
    }
  }
})