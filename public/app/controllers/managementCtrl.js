/*
    Controller written by - Pankaj tanwar
*/
angular.module('managementController', ['adminServices'])
    
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

.controller('courseManagementCtrl', function (admin, $routeParams, $timeout) {

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
        admin.addNewCourse(app.courseData).then(function (data) {
            if(data.data.success) {
                app.addNewCourseSuccessMsg = data.data.message;
                app.addNewCourseLoading = false;
            } else {
                app.addNewCourseErrorMsg = data.data.message;
                app.addNewCourseLoading = false;
            }
        });
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
})


.controller('workshopManagementCtrl', function (admin, $routeParams) {
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
        admin.addNewWorkshop(app.workshopData).then(function (data) {
            if(data.data.success) {
                app.addNewWorkshopSuccessMsg = data.data.message;
            } else {
                app.addNewWorkshopErrorMsg = data.data.message;
            }
        })
    };

    // edit workshop
    admin.getWorkshopDetails($routeParams.workshopID).then(function (data) {
        if(data.data.success) {
            app.workshopData = data.data.workshop;
            app.workshopData.time_date = new Date(app.workshopData.time_date);
        }
    });

    app.updateWorkshop = function (workshopData) {
        admin.updateWorkshop(app.workshopData).then(function (data) {
            console.log(data);
            if(data.data.success) {
                app.updateWorkshopSuccessMsg = data.data.message;
            } else {
                app.updateWorkshopErrorMsg = data.data.message;
            }
        })
    }
});
