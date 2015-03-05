var Show = require('../models/show');

module.exports = function(app, express) {

  var madRouter = express.Router();

  // Base Call - this is /mad/
  // =================================================================
  madRouter.get('/', function(req, res) {
    res.json({message: 'Welcome to the Mad Bread API'});
  })

  // /shows operations
  // =================================================================
    madRouter.route('/shows')

    .get(function(req, res) {
      Show.find(function(err, shows) {
        if (err) res.send(err);

        res.json(shows);
      });
    });

  return madRouter;

};
