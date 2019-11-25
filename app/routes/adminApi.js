let auth = require('../auth/authPermission');
let Category = require('../models/category');
let User = require('../models/user');
let Course = require('../models/course');
let Workshop = require('../models/workshop');
let CourseRequest = require('../models/courseRequest');

module.exports = function (router){

    router.get('/getAllCategories', function (req, res) {

        Category.find({ }).lean().exec(function (err, categories) {
            if(err) {
                res.json({
                    success : false,
                    message : 'Something went wrong!'
                })
            } else {
                if(!categories) {
                    res.json({
                        success : false,
                        message : 'Categories not found.'
                    })
                } else {
                    res.json({
                        success : true,
                        categories : categories
                    })
                }
            }
        })
    });

    router.post('/addNewCategory',auth.ensureAdmin, function (req, res) {


        if(!req.body.category) {
            res.json({
                success : false,
                message : 'Ensure you filled all the entries.'
            })
        } else {
            let category = new Category();

            category.category = req.body.category;
            category.timestamp = new Date();

            category.save(function (err) {
                if (err) {
                    res.json({
                        success: false,
                        message: 'Something went wrong!'
                    })
                } else {
                    res.json({
                        success: true,
                        message: 'New category added successfully.'
                    })
                }
            })
        }
    });

    router.delete('/removeCategory/:categoryID', auth.ensureAdmin, function (req, res) {
        Category.findByIdAndDelete({ _id : req.params.categoryID }, function (err) {
            if(err) {
                res.json({
                    success : false,
                    message : 'Something went wrong!'
                })
            } else {
                res.json({
                    success : true,
                    message : 'Category successfully deleted.'
                })
            }
        })
    });

    router.post('/addNewCourse', auth.ensureAdmin, function (req, res) {
        if(!req.body) {
            res.json({
                success : false,
                message : 'Ensure you fill all the fields.'
            })
        } else {
            let course = new Course();

            course.course_name = req.body.course_name;
            course.category = req.body.category;
            course.description = req.body.description;
            course.course_url = req.body.course_url;
            course.timestamp = new Date();

            course.save(function (err) {
                if(err) {
                    res.json({
                        success : false,
                        message : 'Something went wrong!'
                    })
                } else {
                    res.json({
                        success : true,
                        message : 'Course successfully added.'
                    })
                }
            })
        }
    });

    // get all courses
    router.get('/getAllCourses', auth.ensureAdmin, function (req, res) {
        Course.find({ }).select('course_name category description timestamp').lean().exec(function (err, courses) {
            if(err) {
                res.json({
                    success : false,
                    message : 'Something went wrong!'
                })
            } else {
                if(!courses) {
                    res.json({
                        success : false,
                        message : 'Courses not found.'
                    })
                } else {
                    res.json({
                        success : true,
                        courses : courses
                    })
                }
            }
        })
    });

    // get current course
    router.get('/getCourse/:courseID', auth.ensureAdmin, function (req, res) {
        Course.findOne({ _id : req.params.courseID}).lean().exec(function (err, course) {
            if(err) {
                res.json({
                    success : false,
                    message : 'Something went wrong!'
                })
            } else {
                if(!course) {
                    res.json({
                        success : false,
                        message : 'Course not found.'
                    })
                } else {
                    res.json({
                        success : true,
                        course : course
                    })
                }
            }
        })
    });

    // edit course
    router.post('/editCourse', auth.ensureAdmin, function (req, res) {
        Course.findByIdAndUpdate({ _id : req.body._id }, req.body, function (err) {
            if(err) {
                res.json({
                    success : false,
                    message : 'Something went wrong!'
                })
            } else {
                res.json({
                    success : true,
                    message : 'Course successfully updated.'
                })
            }
        })
    });

    // add new workshop
    router.post('/addNewWorkshop', auth.ensureAdmin, function (req, res) {
        let workshop = new Workshop();

        workshop.title = req.body.title;
        workshop.presenter = req.body.presenter;
        workshop.category = req.body.category;
        workshop.venue = req.body.venue;
        workshop.description = req.body.description;
        workshop.time_date = req.body.time_date;
        workshop.timestamp = new Date();

        workshop.save(function (err) {
            if(err) {
                res.json({
                    success : false,
                    message : 'Something went wrong!'
                })
            } else {
                res.json({
                    success : true,
                    message : 'Workshop successfully added.'
                })
            }
        })
    });

    // get all workshops
    router.get('/getWorkshops',auth.ensureAdmin, function (req, res) {
        Workshop.find({ }, function (err, workshops) {
            if(err) {
                res.json({
                    success: false,
                    message: 'Something went wrong!'
                })
            } else {
                res.json({
                    success : true,
                    workshops : workshops
                })
            }
        })
    });

    // get workshop details
    router.get('/getWorkshopDetails/:workshopID', auth.ensureAdmin, function (req, res) {
        Workshop.findOne({ _id : req.params.workshopID }, function (err, workshop) {
            if(err) {
                res.json({
                    success : false,
                    message : 'Something went wrong!'
                })
            } else {
                res.json({
                    success : true,
                    workshop : workshop
                })
            }
        })
    });

    // edit workshop
    router.post('/updateWorkshop', auth.ensureAdmin, function (req, res) {
        Workshop.findByIdAndUpdate({ _id : req.body._id }, req.body, function (err) {
            if(err) {
                res.json({
                    success : false,
                    message : 'Something went wrong!'
                })
            } else {
                res.json({
                    success : true,
                    message : 'Workshop successfully updated.'
                })
            }
        })
    });

    // get course requests
    router.get('/getNewCourseRequests', auth.ensureAdmin, function (req, res) {
        CourseRequest.find({  }, function (err, courseRequests) {
            if(err) {
                res.json({
                    success : false,
                    message : 'Something went wrong!'
                })
            } else {
                res.json({
                    success : true,
                    courseRequests : courseRequests
                })
            }
        })
    });

    router.delete('/removeCourseRequest/:requestID', auth.ensureAdmin, function (req, res) {
        CourseRequest.findByIdAndDelete({ _id : req.params.requestID }, function (err) {
            if(err) {
                res.json({
                    success : false,
                    message : 'Something went wrong!'
                })
            } else {
                res.json({
                    success : true,
                    message : 'Course Request successfully deleted.'
                })
            }
        })
    });

    // get users
    router.get('/getUsers', function (req, res) {
        User.find({ }, function (err, users) {
            if(err) {
                res.json({
                    success : false,
                    message : 'Something went wrong!'
                })
            } else {
                res.json({
                    success : true,
                    users : users
                })
            }
        })
    });

    return router;
};
