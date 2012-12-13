var requirejs = require('requirejs');

requirejs.config({
  baseUrl: __dirname + '/scripts'
});

requirejs(['fetcher', 'detailsfetcher', 'email', 'formatter', 'fs'], function(Fetcher, DetailsFetcher, Emailer, Formatter, fs) {

  /**
   * The object containing all the configurations.
   *
   * @private
   * @type {Object}
   */
  var config;

  /**
   * Is triggered when a new item is found
   *
   * @private
   * @function
   * @param {String} data The new data.
   */
  var _onNewItem = function(data) {

    console.log('Found', data.length, 'new ads!');

    var body = '';
    var total = data.length;

    for (var i = 0; i < data.length; i++) {

      var url = data[i].url;
      var details = new DetailsFetcher(data[i].url);

      details.fetch().on('data', function(details) {
        var formatter = new Formatter();
        body += formatter.formatForEmail(details);

        total--;

        if (total === 0) {
          var email = new Emailer(config.email.username, config.email.password, config.email.host, config.email.ssl);
          email.send(config.recipient, 'New ads were found', body);
        }

      }).on('error', function(e) {
        total--;
      });

    }

  };

  /**
   * Loads the config file.
   *
   * @private
   * @function
   */
  var loadConfig = function() {
    fs.readFile('config.json', function(err, data) {
      if (err) throw err;

      config = JSON.parse(data);

      // Creates a fetcher for each url
      for (var i = 0; i < config.urls.length; i++) {
        var fetcher = new Fetcher(config.urls[i], config.refresh_interval);
        fetcher.start().on('newItem', _onNewItem);
      }
    });
  };

  loadConfig();

});
