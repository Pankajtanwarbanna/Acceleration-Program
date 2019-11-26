/*
    Controller written by - Pankaj tanwar
*/
angular.module('userCtrl',['userServices','fileModelDirective','uploadFileService'])

.controller('regCtrl', function ($scope, $http, $timeout, $location,user) {

    var app = this;

    this.regUser = function (regData) {

        app.successMsg = '';
        app.errorMsg = '';
        app.loading = true;

        user.create(app.regData).then(function (data) {

            //console.log(data);
            if(data.data.success) {
                app.loading = false;
                app.successMsg = data.data.message;
            } else {
                app.loading = false;
                app.errorMsg = data.data.message;
            }
        });
    };
})

.controller('usersCtrl', function (user) {
    var app = this;

    user.getUsers().then(function (data) {

        if(data.data.success) {
            console.log(app.users);
            app.users = data.data.users;
        } else {
            app.errorMsg = data.data.message;
        }
    });
})

.controller('courseCtrl', function (user) {

    var app = this;

    user.getCourses().then(function (data) {
        if(data.data.success) {
            app.courses = data.data.courses;
        }
    })
})

.controller('workshopCtrl', function (user) {

    var app = this;

    user.getUpcomingWorkshops().then(function (data) {
        if(data.data.success) {
            app.upcomingWorkshops = data.data.workshops;
        }
    })
})

.controller('coursePageCtrl', function (user,$routeParams, $sce) {
    var app = this;

    user.getCourseDetails($routeParams.courseID).then(function (data) {
        console.log(data);
        if(data.data.success) {
            app.course = data.data.course;
            app.course.course_url = $sce.trustAsResourceUrl(app.course.course_url)
        }
    })
})

.controller('workstationCtrl', function (user, $scope,uploadFile) {
    let app = this;

    function getMyWork() {
        user.getMyWork().then(function (data) {
            if(data.data.success) {
                app.work = data.data.work;
            }
        });
    }

    getMyWork();

    // save work space
    app.saveMyWork = function (workData) {

        if($scope.file) {
            uploadFile.upload($scope.file).then(function (data) {
                if(data.data.success) {
                    app.workData.work_url = data.data.filename;

                    user.saveMyWork(app.workData).then(function (data) {
                        if(data.data.success) {
                            app.workSavedSuccessMsg = data.data.message;
                            getMyWork();
                        } else {
                            app.workSavedErrorMsg = data.data.message;
                        }
                    })
                } else {
                    app.workSavedErrorMsg = data.data.message;
                }
            })
        } else {
            user.saveMyWork(app.workData).then(function (data) {
                if(data.data.success) {
                    app.workSavedSuccessMsg = data.data.message;
                    getMyWork();
                } else {
                    app.workSavedErrorMsg = data.data.message;
                }
            })
        }
    }
})

.controller('courseRequestCtrl', function (user) {
    var app = this;

    app.postNewCourseRequest = function (courseRequestData) {
        user.postNewCourseRequest(app.courseRequestData).then(function (data) {
            console.log(data);
            if(data.data.success) {
                app.postNewCourseRequestSuccessMsg = data.data.message;
            } else {
                app.postNewCourseRequestErrorMsg = data.data.message;
            }
        });
    }
})

.controller('settingsCtrl', function (user, $timeout, $scope,uploadFile) {

    var app = this;

    app.profileData = {};

    // update profile
    app.updateProfile = function (mainData) {
        app.profileData.name = mainData.name;
        app.profileData.email = mainData.email;
        app.profileData.username = mainData.username;
        app.profileData.branch = mainData.branch;
        app.profileData.position = mainData.position;
        app.profileData.address = mainData.address;
        app.profileData.userID = mainData.userID;
        user.updateProfile(app.profileData).then(function (data) {
            if(data.data.success) {
                app.successMsg = data.data.message;
                $timeout(function () {
                    app.successMsg = '';
                }, 2000);
            } else {
                app.errorMsg = data.data.message;
            }
        })
    };

    // profile picture update
    app.updateProfilePicture = function () {
        uploadFile.uploadImage($scope.file).then(function (data) {
            if(data.data.success) {
                let profilePicObj = {};
                profilePicObj.filename = data.data.filename;
                user.updateProfilePictureURL(profilePicObj).then(function (data) {
                    console.log(data);
                    if(data.data.success) {
                        app.profilePictureUpdateSuccessMsg = data.data.message;
                    } else {
                        app.profilePictureUpdateErrorMsg = data.data.message;
                    }
                });
            }
        })
    }
});
