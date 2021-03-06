var User     = require('../models/user'),
    Show     = require('../models/show'),
    jwt    = require('jsonwebtoken'),
    config = require('../../config');

module.exports = function(app, express) {

  var apiRouter = express.Router();

  // Authentication: Recieve Token
  apiRouter.post('/authenticate', function(req, res) {
    User.findOne({
      username: req.body.username
    }).select('name username password').exec(function(err, user) {
      if (err) throw err;

      if (!user) {
        res.json({success: false, message: 'Authentication failed. User not found.'});
      } else if (user) {
        var validPassword = user.comparePassword(req.body.password);
        if (!validPassword) {
          res.json({success: false, message: 'Authentication failed. Wrong password.'});
        } else {
          var token = jwt.sign({
            name: user.name,
            username: user.username
          }, config.secret, {
            expiresInMinutes: 1440 // 24 hours
          });

          res.json({
            success: true,
            message: 'Here is your token!',
            token: token
          });
        }
      }
    })
  })

  // Check for token on api usage
  apiRouter.use(function(req, res, next) {
    console.log('checking token');
    var token = req.body.token || req.param('token') || req.headers['x-access-token'];
    if (token) {

      jwt.verify(token, config.secret, function(err, decoded) {

        if (err) {
          return res.status(403).send({ success: false, message: 'Failed to authenticate token.'});
        } else {
          req.decoded = decoded;
          console.log(' *** APPROVED!!! *** ');
          next();
        }

      });

    } else {
      return res.status(403).send({ success: false, message: 'No token provided.'});
    }

  })



  // Custom Middleware
  // =================================================================
  apiRouter.use(function(req, res, next) {
    console.log('API hit');
    // Add user authentication here
    next();
  })



  // Base Call - this is /api/
  // =================================================================
  apiRouter.get('/', function(req, res) {
    res.json({message: 'Welcome to the API'});
  })




  // /users operations
  // =================================================================
    apiRouter.route('/users')

    .post(function(req, res) {
      var user = new User();

      user.name = req.body.name;
      user.username = req.body.username;
      user.password = req.body.password;

      user.save(function(err) {
        if (err) {
          if (err.code == 11000) {
            return res.json({
              success: false,
              message: 'A user with that username already exists'
            });
          } else {
            return res.send(err);
          }
        }
        res.json({message: 'User created!'});
      });

    })

    .get(function(req, res) {
      User.find(function(err, users) {
        if (err) res.send(err);

        res.json(users);
      });
    });

  apiRouter.route('/users/:user_id')

    .get(function(req, res) {
      User.findById(req.params.user_id, function(err, user) {
        if (err) res.send(err);

        res.json(user);
      });
    })

    .put(function(req, res) {
      User.findById(req.params.user_id, function(err, user) {
        if (err) res.send(err);

        if (req.body.name) user.name = req.body.name;
        if (req.body.username) user.username = req.body.username;
        if (req.body.password) user.password = req.body.password;

        user.save(function(err) {
          if (err) res.send(err);
          res.json({ message: 'User Updated!'});
        });
      })
    })

    .delete(function(req, res) {
      User.remove({
        _id: req.params.user_id
      }, function(err, user) {
        if (err) res.send(err);

        res.json({ message: 'Successfully Deleted!'});
      });
    });




  // /shows operations
  // =================================================================
    apiRouter.route('/shows')

    .post(function(req, res) {
      var show = new Show();

      show.venue       = req.body.venue;
      show.date        = req.body.date;
      show.time        = req.body.time;
      show.subtitle    = req.body.subtitle;
      show.address     = req.body.address;
      show.maplink     = req.body.maplink;
      show.description = req.body.description;
      show.website     = req.body.website;

      show.save(function(err) {
        if (err) {
          return res.send(err);
        }
        res.json({message: 'Show created!'});
      });

    })

    .get(function(req, res) {
      Show.find(function(err, shows) {
        if (err) res.send(err);

        res.json(shows);
      });
    });

  apiRouter.route('/shows/:show_id')

    .get(function(req, res) {
      Show.findById(req.params.show_id, function(err, show) {
        if (err) res.send(err);

        res.json(show);
      });
    })

    .put(function(req, res) {
      Show.findById(req.params.show_id, function(err, show) {
        if (err) res.send(err);

        if (req.body.venue) show.venue = req.body.venue;
        if (req.body.date) show.date = req.body.date;
        if (req.body.time) show.time = req.body.time;
        if (req.body.subtitle) show.subtitle = req.body.subtitle;
        if (req.body.address) show.address = req.body.address;
        if (req.body.maplink) show.maplink = req.body.maplink;
        if (req.body.description) show.description = req.body.description;
        if (req.body.website) show.website = req.body.website;

        show.save(function(err) {
          if (err) res.send(err);
          res.json({ message: 'Show Updated!'});
        });
      })
    })

    .delete(function(req, res) {
      Show.remove({
        _id: req.params.show_id
      }, function(err, show) {
        if (err) res.send(err);

        res.json({ message: 'Successfully Deleted Show!'});
      });
    });




  // Get current user information
  apiRouter.get('/me', function(req, res) {
    res.send(req.decoded);
  });

  return apiRouter;

};
