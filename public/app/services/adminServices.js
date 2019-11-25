/*
    Services written by - Pankaj tanwar
*/
angular.module('adminServices',[])

.factory('admin', function ($http) {
    let adminFactory = {};

    // get categories
    adminFactory.getAllCategories = function () {
        return $http.get('/api/getAllCategories');
    };

    // add new category
    adminFactory.addNewCategory = function (categoryData) {
        return $http.post('/api/addNewCategory', categoryData);
    };

    // remove category
    adminFactory.removeCategory = function (categoryID) {
        return $http.delete('/api/removeCategory/' + categoryID);
    };

    // add new course
    adminFactory.addNewCourse = function (courseData) {
        return $http.post('/api/addNewCourse', courseData);
    };

    // get all courses
    adminFactory.getAllCourses = function () {
        return $http.get('/api/getAllCourses');
    };

    // get current course
    adminFactory.getCourse = function (courseID) {
        return $http.get('/api/getCourse/' + courseID);
    };

    // edit course
    adminFactory.editCourse = function (courseData) {
        return $http.post('/api/editCourse', courseData);
    };

    // add new workshop
    adminFactory.addNewWorkshop = function (workshopData) {
        return $http.post('/api/addNewWorkshop',workshopData);
    };

    // get all workshops
    adminFactory.getWorkshops = function () {
        return $http.get('/api/getWorkshops');
    };

    // get workshop details
    adminFactory.getWorkshopDetails = function (workshopID) {
        return $http.get('/api/getWorkshopDetails/' +workshopID);
    };

    // update workshop details
    adminFactory.updateWorkshop = function (workshopData) {
        return $http.post('/api/updateWorkshop' , workshopData);
    };

    return adminFactory;
});
