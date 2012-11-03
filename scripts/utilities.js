define([], function() {

  /**
   * Provides some utilities
   *
   * @class Utilities
   * @constructor
   */
  var Utilities = function() {

    /**
     * Uses some custom headers when doing a request
     *
     * @private
     * @type {Array}
     */
    var _headers = [
      {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_2) AppleWebKit/537.11 (KHTML, like Gecko) Chrome/23.0.1271.60 Safari/537.11',
        'Referer': 'http://hitta.se'
      },
      {
        'User-Agent': 'Mozilla/5.0 (Windows 7) AppleWebKit/537.11 (KHTML, like Gecko) Chrome/22.0.1271.60 Safari/537.11',
        'Referer': 'http://telenor.se'
      },
      {
        'User-Agent': ' Mozilla/5.0 (Macintosh; Intel Mac OS X 10.8; rv:15.0) Gecko/20100101 Firefox/15.0',
        'Referer': 'http://hotmail.com'
      },
      {
        'User-Agent': ' Mozilla/5.0 (Windows Vista) Gecko/20100101 Firefox/14.0',
        'Referer': 'http://in.com'
      },
      {
        'User-Agent': ' Mozilla/5.0 (Windows 7) Gecko/20100101 Firefox/13.0',
        'Referer': 'http://hotmail.com'
      }
    ];

    /**
     * Returns custom headers for the requests.
     *
     * @public
     * @function
     * @return {Object}
     */
    this.getRandomHeaders = function() {
      return {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'User-Agent': _headers[Math.floor(Math.random() * _headers.length)]['User-Agent'],
        'Referer': _headers[Math.floor(Math.random() * _headers.length)]['Referer']
      };
    };

    /**
     * Parses a url and returns an object containing the folowing data (if found): protocol,
     * domain, post, path and path segments, hash and hash segments, query string
     * and an object containing a key/value pair representation of the query
     *
     * @private
     * @param {String} url The url that we need to parse.
     * @return {Object} The object containing the different segments from the parsed URL.
     * @author Justin Windle
     */
    this.parseURL = function(url) {

      url = unescape(url);

      // remove protocol, domain and port
      var cut = url.replace(/^(http(s)?:\/\/)?[^\/]+\/?/i, '');

      // try to match patterns for the data we need
      var parse = {

        protocol: url.match(/^(http(s)?):\/\//i),
        domain: url.match(/^(http(s)?:\/\/)?([^\/:]+)/i),
        query: url.match(/\?([\w\+\-\=&]+)/),
        port: url.match(/\w:(\d{1,5})/),
        hash: url.match(/#([\w\-\/]+)/),
        path: cut.match(/^\/?([\w\-\/\.]+)/)

      };

      // Create a result form any matches returned
      var result = {

        protocol: parse.protocol ? parse.protocol[1] : null,
        domain: parse.domain ? parse.domain[3] : null,
        query: parse.query ? parse.query[1] : null,
        port: parse.port ? parse.port[1] : null,
        hash: parse.hash ? parse.hash[1] : null,
        path: parse.path ? parse.path[1] : null,
        url: url /* return the unescaped url */

      };

      // Split the path into segments
      if (result.path) {
        result.pathSegments = result.path.replace(/^\/|\/$/g, '').split('/');
      }

      // Split the hash into segments
      if (result.hash) {
        result.hashSegments = result.hash.replace(/^\/|\/$/g, '').split('/');
      }

      // Parse the query parameters
      if (result.query) {

        result.params = {};

        var regex = /([\w\+\-]+)\=([\w\+\-]+)/g;
        var param = regex.exec(result.query);

        while (param) {
          result.params[param[1]] = param[2];
          param = regex.exec(result.query);
        }

      }

      return result;
    };

  };

  return new Utilities();

});
