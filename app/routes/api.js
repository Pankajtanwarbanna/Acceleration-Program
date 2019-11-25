/*
    API written by - Pankaj Tanwar
*/
let auth = require('../auth/authPermission');
var User = require('../models/user');
var Category = require('../models/category');
var Course = require('../models/course');
var Workshop = require('../models/workshop');
var jwt = require('jsonwebtoken');
var secret = 'pankaj';
var nodemailer = require('nodemailer');

module.exports = function (router){

    // Nodemailer-sandgrid stuff
    var client = nodemailer.createTransport({
        service : 'gmail',
        auth: {
            user: 'EMAIL',
            pass: 'PASS'
        }
    });

    // User register API
    router.post('/register',function (req, res) {

        var user = new User();

        user.name = req.body.name;
        user.username = req.body.username;
        user.email = req.body.email;
        user.password = req.body.password;
        user.position = req.body.position;
        user.branch = req.body.branch;
        user.temporarytoken = jwt.sign({ email : user.email , username : user.username }, secret , { expiresIn : '24h' });

        //console.log(req.body);
        if(!user.name || !user.email || !user.password || !user.username || !user.position || !user.branch) {
            res.json({
                success : false,
                message : 'Ensure you filled all entries!'
            });
        } else {
            user.save(function(err) {
                if(err) {
                    // duplication errors
                    if(err.code === 11000) {
                        //console.log(err.errmsg);
                        if(err.errmsg[57] === 'e') {
                            res.json({
                                success: false,
                                message: 'Email is already registered.'
                            });
                        } else if(err.errmsg[57] === 'u') {
                            res.json({
                                success : false,
                                message : 'Username is already registered.'
                            });
                        } else {
                            res.json({
                                success : false,
                                message : err
                            });
                        }
                    } else {
                        res.json({
                            success: false,
                            message: err
                        })
                    }
                } else {

                    res.json({
                        success : true,
                        message : 'Account registered!'
                    });
                }
            });
        }
    });

    // User login API
    router.post('/authenticate', function (req,res) {

        if(!req.body.username || !req.body.password) {
            res.json({
                success : false,
                message : 'Ensure you fill all the entries.'
            });
        } else {

            User.findOne({ username : req.body.username }).select('email username password active').exec(function (err, user) {

                if(err) throw err;

                if(!user) {
                    res.json({
                        success : false,
                        message : 'User not found. Please Signup!'
                    });
                } else if(user) {

                    if(!user.active) {
                        res.json({
                            success : false,
                            message : 'Account is not activated yet.Please check your email for activation link.',
                            expired : true
                        });
                    } else {

                        var validPassword = user.comparePassword(req.body.password);

                        if (validPassword) {
                            var token = jwt.sign({
                                email: user.email,
                                username: user.username
                            }, secret, {expiresIn: '24h'});
                            res.json({
                                success: true,
                                message: 'User authenticated.',
                                token: token
                            });
                        } else {
                            res.json({
                                success: false,
                                message: 'Incorrect password. Please try again.'
                            });
                        }
                    }
                }
            });
        }

    });

    router.put('/activate/:token', function (req,res) {

        if(!req.params.token) {
            res.json({
                success : false,
                message : 'No token provided.'
            });
        } else {

            User.findOne({temporarytoken: req.params.token}, function (err, user) {
                if (err) throw err;

                var token = req.params.token;

                jwt.verify(token, secret, function (err, decoded) {
                    if (err) {
                        res.json({
                            success: false,
                            message: 'Activation link has been expired.'
                        })
                    }
                    else if (!user) {
                        res.json({
                            success: false,
                            message: 'Activation link has been expired.'
                        });
                    } else {

                        user.temporarytoken = false;
                        user.active = true;

                        user.save(function (err) {
                            if (err) {
                                console.log(err);
                            } else {

                                var email = {
                                    from: 'Polymath Registration, support@polymath.com',
                                    to: user.email,
                                    subject: 'Activation activated',
                                    text: 'Hello ' + user.name + 'Your account has been activated.Thank you Pankaj Tanwar CEO, Polymath',
                                    html: 'Hello <strong>' + user.name + '</strong>,<br><br> Your account has been activated.<br><br>Thank you<br>Pankaj Tanwar<br>CEO, Polymath'
                                };

                                client.sendMail(email, function (err, info) {
                                    if (err) {
                                        console.log(err);
                                    }
                                    else {
                                        console.log('Message sent: ' + info.response);
                                    }
                                });

                                res.json({
                                    success: true,
                                    message: 'Account activated.'
                                })

                            }
                        });
                    }
                });
            })
        }
    });

    // Resend activation link
    router.post('/resend', function (req,res) {

        if(!req.body.username || !req.body.password) {
            res.json({
                success : false,
                message : 'Ensure you fill all the entries.'
            });
        } else {

            User.findOne({ username : req.body.username }).select('name username email password active temporarytoken').exec(function (err,user) {

                if(!user) {
                    res.json({
                        success : false,
                        message : 'User is not registered with us.Please signup!'
                    });
                } else {
                    if(user.active) {
                        res.json({
                            success : false,
                            message : 'Account is already activated.'
                        });
                    } else {

                        var validPassword = user.comparePassword(req.body.password);

                        if(!validPassword) {
                            res.json({
                                success : false,
                                message : 'Incorrect password.'
                            });
                        } else {
                            res.json({
                                success : true,
                                user : user
                            });

                        }
                    }
                }
            })
        }
    });

    // router to update temporary token in the database
    router.put('/sendlink', function (req,res) {

        User.findOne({username : req.body.username}).select('email username name temporarytoken').exec(function (err,user) {
            if (err) throw err;

            user.temporarytoken = jwt.sign({
                email: user.email,
                username: user.username
            }, secret, {expiresIn: '24h'});

            user.save(function (err) {
                if(err) {
                    console.log(err);
                } else {

                    var email = {
                        from: 'Polymath Registration, support@polymath.com',
                        to: user.email,
                        subject: 'Activation Link request - Polymath Registration',
                        text: 'Hello '+ user.name + 'You requested for the new activation link.Please find the below activation link Activation link Thank you Pankaj Tanwar CEO, Polymath',
                        html: 'Hello <strong>'+ user.name + '</strong>,<br><br>You requested for the new activation link.Please find the below activation link<br><br><a href="http://localhost:3500/activate/'+ user.temporarytoken+'">Activation link</a><br><br>Thank you<br>Pankaj Tanwar<br>CEO, Polymath'
                    };

                    client.sendMail(email, function(err, info){
                        if (err ){
                            console.log(err);
                        }
                        else {
                            console.log('Message sent: ' + info.response);
                        }
                    });

                    res.json({
                        success : true,
                        message : 'Link has been successfully sent to registered email.'
                    });

                }
            })
        });


    });

    // Forgot username route
    router.post('/forgotUsername', function (req,res) {

        if(!req.body.email) {
            res.json({
                success : false,
                message : 'Please ensure you fill all the entries.'
            });
        } else {
            User.findOne({email : req.body.email}).select('username email name').exec(function (err,user) {
                if(err) throw err;

                if(!user) {
                    res.json({
                        success : false,
                        message : 'Email is not registered with us.'
                    });
                } else if(user) {

                    var email = {
                        from: 'Polymath, support@polymath.com',
                        to: user.email,
                        subject: 'Forgot Username Request',
                        text: 'Hello '+ user.name + 'You requested for your username.You username is ' + user.username + 'Thank you Pankaj Tanwar CEO, Polymath',
                        html: 'Hello <strong>'+ user.name + '</strong>,<br><br>You requested for your username.You username is <strong>'+ user.username + '</strong><br><br>Thank you<br>Pankaj Tanwar<br>CEO, Polymath'
                    };

                    client.sendMail(email, function(err, info){
                        if (err ){
                            console.log(err);
                        }
                        else {
                            console.log('Message sent: ' + info.response);
                        }
                    });

                    res.json({
                        success : true,
                        message : 'Username has been successfully sent to your email.'
                    });
                } else {
                    res.send(user);
                }

            });
        }

    });

    // Send link to email id for reset password
    router.put('/forgotPasswordLink', function (req,res) {

        if(!req.body.username) {
            res.json({
                success : false,
                message : 'Please ensure you filled the entries.'
            });
        } else {

            User.findOne({ username : req.body.username }).select('username email temporarytoken name').exec(function (err,user) {
                if(err) throw err;

                if(!user) {
                    res.json({
                        success : false,
                        message : 'Username not found.'
                    });
                } else {

                    console.log(user.temporarytoken);

                    user.temporarytoken = jwt.sign({
                        email: user.email,
                        username: user.username
                    }, secret, {expiresIn: '24h'});

                    console.log(user.temporarytoken);

                    user.save(function (err) {
                        if(err) {
                            res.json({
                                success : false,
                                message : 'Error accured! Please try again. '
                            })
                        } else {

                            var email = {
                                from: 'Polymath Registration, support@polymath.com',
                                to: user.email,
                                subject: 'Forgot Password Request',
                                text: 'Hello '+ user.name + 'You request for the forgot password.Please find the below link Reset password Thank you Pankaj Tanwar CEO, Polymath',
                                html: 'Hello <strong>'+ user.name + '</strong>,<br><br>You requested for the forgot password. Please find the below link<br><br><a href="http://localhost:3500/forgotPassword/'+ user.temporarytoken+'">Reset password</a><br><br>Thank you<br>Pankaj Tanwar<br>CEO, Polymath'
                            };

                            client.sendMail(email, function(err, info){
                                if (err ){
                                    console.log(err);
                                }
                                else {
                                    console.log('Message sent: ' + info.response);
                                }
                            });

                            res.json({
                                success : true,
                                message : 'Link to reset your password has been sent to your registered email.'
                            });

                        }
                    });

                }

            })

        }
    });

    // router to change password
    router.post('/forgotPassword/:token', function (req,res) {

        if(!req.params.token) {
            res.json({
                success : false,
                message : 'No token provied.'
            });
        } else {

            User.findOne({ temporarytoken : req.params.token }).select('username temporarytoken').exec(function (err,user) {

                if(err) throw err;

                if(!user) {
                    res.json({
                        success : false,
                        message : 'Link has been expired.'
                    });
                } else {
                    res.json({
                        success : true,
                        user : user
                    });
                }
            });
        }
    });

    // route to reset password
    router.put('/resetPassword/:token', function (req,res) {

        console.log('api is working fine');

        if(!req.body.password) {
            res.json({
                success : false,
                message : 'New password is missing.'
            })
        } else {

            User.findOne({ temporarytoken : req.params.token }).select('name password').exec(function (err,user) {

                if(err) throw err;

                if(!user) {
                    res.json({
                        success : false,
                        message : 'Link has been expired.'
                    })
                } else {

                    user.password = req.body.password;
                    user.temporarytoken = false;

                    user.save(function (err) {
                        if(err) {
                            res.json({
                                success : false,
                                message : 'Password must have one lowercase, one uppercase, one special character, one number and minimum 8 and maximum 25 character.'
                            });
                        } else {

                            var email = {
                                from: 'Polymath, support@polymath.com',
                                to: user.email,
                                subject: 'Password reset',
                                text: 'Hello '+ user.name + 'You request for the reset password.Your password has been reset. Thank you Pankaj Tanwar CEO, Polymath',
                                html: 'Hello <strong>'+ user.name + '</strong>,<br><br>You requested for the reset password. Your password has been reset.<br><br>Thank you<br>Pankaj Tanwar<br>CEO, Polymath'
                            };

                            client.sendMail(email, function(err, info){
                                if (err ){
                                    console.log(err);
                                }
                                else {
                                    console.log('Message sent: ' + info.response);
                                }
                            });

                            res.json({
                                success : true,
                                message : 'Password has been changed successfully.'
                            })

                        }
                    })
                }
            })
        }
    });

    // Middleware to verify token
    router.use(function (req,res,next) {

        var token = req.body.token || req.body.query || req.headers['x-access-token'];

        if(token) {
            // verify token
            jwt.verify(token, secret, function (err,decoded) {
                if (err) {
                    res.json({
                        success : false,
                        message : 'Token invalid.'
                    })
                }
                else {
                    req.decoded = decoded;
                    next();
                }
            });

        } else {
            res.json({
                success : false,
                message : 'No token provided.'
            });
        }
    });

    // API User profile
    router.post('/me', function (req,res) {

        //console.log(req.decoded.email);
        // getting profile of user from database using email, saved in the token in localStorage
        User.findOne({ email : req.decoded.email }).select('email username name').exec(function (err, user) {
            if(err) throw err;

            if(!user) {
                res.status(500).send('User not found.');
            } else {
                res.send(user);
            }
        });
    });

    // get permission of user
    router.get('/permission', function (req,res) {

        User.findOne({ username : req.decoded.username }).select('permission').exec(function (err,user) {

            if(err) throw err;

            if(!user) {
                res.json({
                    success : false,
                    message : 'User not found.'
                })
            } else {
                res.json({
                    success : true,
                    permission : user.permission
                })
            }
        })
    });

    // get all users
    router.get('/management', function (req, res) {

        User.find({}, function (err, users) {

            if(err) throw err;
            User.findOne({ username : req.decoded.username }, function (err,mainUser) {

                if(err) throw err;
                if(!mainUser) {
                    res.json({
                        success : false,
                        message : 'User not found.'
                    });
                } else {
                    if(!users) {
                        res.json({
                            success : false,
                            message : 'Users not found.'
                        });
                    } else {
                        res.json({
                            success : true,
                            users : users,
                            permission : mainUser.permission
                        })
                    }
                }
            })
        })
    });

    router.get('/getCategories', function (req, res) {
        Category.find({ }, function (err, categories) {
            if(err) {
                res.json({
                    success : false,
                    message : 'Something went wrong!'
                })
            } else {
                res.json({
                    success : true,
                    categories : categories
                })
            }
        })
    });

    // get user courses
    router.get('/getCourses',auth.ensureUser, function (req, res) {
        User.findOne({ email : req.decoded.email }).select('position').lean().exec(function (err, user) {
            if(err) {
                res.json({
                    success : false,
                    message : 'Something went wrong!'
                })
            } else {
                Course.find({ category : user.position }, function (err, courses) {
                    if(err) {
                        res.json({
                            success : false,
                            message : 'Something went wrong!'
                        })
                    } else {
                        res.json({
                            success : true,
                            courses : courses
                        })
                    }
                })
            }
        })
    });

    // get upcoming workshops
    router.get('/getUpcomingWorkshops', function (req, res) {
        User.findOne({ email : req.decoded.email }).select('position').lean().exec(function (err, user) {
            if(err) {
                res.json({
                    success : false,
                    message : 'Something went wrong!'
                })
            } else {
                Workshop.find({ category : user.position , time_date : { $gt : new Date() } }, function (err, workshops) {
                    if(err) {
                        res.json({
                            success : false,
                            message : 'Something went wrong!'
                        })
                    } else {
                        res.json({
                            success : true,
                            workshops : workshops
                        })
                    }
                })
            }
        })
    });

    // get course details
    router.get('/getCourseDetails/:courseID', auth.ensureUser, function (req, res) {
        Course.findOne({ _id : req.params.courseID }, function (err, course) {
            if(err) {
                res.json({
                    success : false,
                    message : 'Something went wrong!'
                })
            } else {
                res.json({
                    success : true,
                    course : course
                })
            }
        })
    });
    return router;
};
