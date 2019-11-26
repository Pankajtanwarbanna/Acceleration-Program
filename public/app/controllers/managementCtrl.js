/*
    Controller written by - Pankaj tanwar
*/
angular.module('managementController', ['adminServices','fileModelDirective','uploadFileService'])
    
.controller('manageCategoryCtrl', function (admin) {
    var app = this;

    function getAllCategories() {
        admin.getAllCategories().then(function (data) {
            console.log(data);
            if(data.data.success) {
                app.categories = data.data.categories;
            }
        });
    }

    getAllCategories();

    // add new category
    app.addCategorySuccessMsg = '';
    app.addCategoryErrorMsg = '';

    app.addNewCategory = function (categoryData) {
        admin.addNewCategory(app.categoryData).then(function (data) {
            if(data.data.success) {
                app.addCategorySuccessMsg = data.data.message;
                getAllCategories();
            } else {
                app.addCategoryErrorMsg = data.data.message;
            }

        })
    };

    // remove category
    app.removeCategory = function (categoryID) {
        admin.removeCategory(categoryID).then(function (data) {
            console.log(data);
            if(data.data.success) {
                app.removeCategorySuccessMsg = data.data.message;
                getAllCategories();
            } else {
                app.removeCategoryErrorMsg = data.data.message;
            }
        })
    }
})

.controller('courseManagementCtrl', function (admin, $routeParams, $timeout,$scope,uploadFile) {

    let app = this;

    // get all course
    function getAllCourses() {
        admin.getAllCourses().then(function (data) {
            if(data.data.success) {
                app.courses = data.data.courses;
            }
        })
    }

    getAllCourses();

    // Add New Course
    app.addNewCourseLoading = false;

    app.addNewCourse = function (courseData) {
        app.addNewCourseLoading = true;

        if($scope.file) {
            uploadFile.uploadImage($scope.file).then(function (data) {
                if(data.data.success) {
                    app.courseData.poster = data.data.filename;
                    uploadFile.upload($scope.file).then(function (data) {
                        if(data.data.success) {
                            app.courseData.course_file_url = data.data.filename;
                            admin.addNewCourse(app.courseData).then(function (data) {
                                if(data.data.success) {
                                    app.addNewCourseSuccessMsg = data.data.message;
                                    app.addNewCourseLoading = false;
                                } else {
                                    app.addNewCourseErrorMsg = data.data.message;
                                    app.addNewCourseLoading = false;
                                }
                            });
                        } else {
                            app.editCourseErrorMsg = 'Course files uploading error : ' + data.data.message;
                        }
                    });
                } else {
                    app.editCourseErrorMsg = 'Course poster uploading error : ' + data.data.message;
                }
            });
        } else {
            admin.addNewCourse(app.courseData).then(function (data) {
                if(data.data.success) {
                    app.addNewCourseSuccessMsg = data.data.message;
                    app.addNewCourseLoading = false;
                } else {
                    app.addNewCourseErrorMsg = data.data.message;
                    app.addNewCourseLoading = false;
                }
            });
        }
    };

    // get current course
    admin.getCourse($routeParams.courseID).then(function (data) {
        console.log(data);
        if(data.data.success) {
            app.courseData = data.data.course;
        }
    });

    // edit course
    app.editCourse = function (courseData) {
        console.log(app.courseData);

        if($scope.file) {
            uploadFile.uploadImage($scope.file).then(function (data) {
                if(data.data.success) {
                    app.courseData.poster = data.data.filename;

                    admin.editCourse(app.courseData).then(function (data) {
                        console.log(data);
                        if(data.data.success) {
                            app.editCourseSuccessMsg = data.data.message;
                            $timeout(function () {
                                app.editCourseSuccessMsg = '';
                            }, 2000)
                        } else {
                            app.editCourseErrorMsg = data.data.message;
                        }
                    })
                } else {
                    app.editCourseErrorMsg = data.data.message;
                }
            });
        } else {
            admin.editCourse(app.courseData).then(function (data) {
                console.log(data);
                if(data.data.success) {
                    app.editCourseSuccessMsg = data.data.message;
                    $timeout(function () {
                        app.editCourseSuccessMsg = '';
                    }, 2000)
                } else {
                    app.editCourseErrorMsg = data.data.message;
                }
            })
        }
    };

    // remove course
    app.removeCourse = function (courseID) {
        admin.removeCourse(courseID).then(function (data) {
            console.log(data);
            if(data.data.success) {
                app.removeCourseSuccessMsg = data.data.message;
                getAllCourses();
                $timeout(function () {
                    app.removeCourseSuccessMsg = '';
                }, 3000);
            } else {
                app.removeCourseErrorMsg = data.data.message;
            }
        })
    }
})


.controller('workshopManagementCtrl', function (admin, $routeParams, uploadFile,$scope) {
    var app = this;

    function getWorkshops() {
        admin.getWorkshops().then(function (data) {
            if(data.data.success) {
                app.workshops = data.data.workshops;
            }
        })
    }

    getWorkshops();

    // add new workshop
    app.addNewWorkshop = function (workshopData) {

        if($scope.file) {
            uploadFile.uploadImage($scope.file).then(function (data) {
                console.log(data);
                if(data.data.success) {
                    app.workshopData.poster = data.data.filename;
                    admin.addNewWorkshop(app.workshopData).then(function (data) {
                        if(data.data.success) {
                            app.addNewWorkshopSuccessMsg = data.data.message;
                        } else {
                            app.addNewWorkshopErrorMsg = data.data.message;
                        }
                    })
                } else {
                    app.addNewWorkshopErrorMsg = data.data.message;
                }
            });
        } else {
            admin.addNewWorkshop(app.workshopData).then(function (data) {
                if(data.data.success) {
                    app.addNewWorkshopSuccessMsg = data.data.message;
                } else {
                    app.addNewWorkshopErrorMsg = data.data.message;
                }
            })
        }
    };

    // edit workshop
    admin.getWorkshopDetails($routeParams.workshopID).then(function (data) {
        if(data.data.success) {
            app.workshopData = data.data.workshop;
            app.workshopData.time_date = new Date(app.workshopData.time_date);
        }
    });

    app.updateWorkshop = function (workshopData) {

        if($scope.file) {
            uploadFile.uploadImage($scope.file).then(function (data) {
                if(data.data.success) {
                    app.workshopData.poster = data.data.filename;

                    admin.updateWorkshop(app.workshopData).then(function (data) {
                        console.log(data);
                        if(data.data.success) {
                            app.updateWorkshopSuccessMsg = data.data.message;
                        } else {
                            app.updateWorkshopErrorMsg = data.data.message;
                        }
                    })
                } else {
                    app.updateWorkshopErrorMsg = data.data.message;
                }
            });
        } else {
            admin.updateWorkshop(app.workshopData).then(function (data) {
                console.log(data);
                if(data.data.success) {
                    app.updateWorkshopSuccessMsg = data.data.message;
                } else {
                    app.updateWorkshopErrorMsg = data.data.message;
                }
            })
        }
    }
})

.controller('courseRequestManagementCtrl', function (admin) {

    let app = this;

    admin.getNewCourseRequests().then(function (data) {
        if(data.data.success) {
            app.courseRequests = data.data.courseRequests;
        }
    });

    app.removeCourseRequest = function (courseRequestID) {
        admin.removeCourseRequest(courseRequestID).then(function (data) {
            console.log(data);
        })
    }
})

.controller('userManagementCtrl', function (admin) {

    let app = this;

    admin.getUsers().then(function (data) {
        console.log(data);
        if(data.data.success) {
            app.users = data.data.users;
        }
    })
});
