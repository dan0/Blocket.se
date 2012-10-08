define(['http', 'cheerio'], function(http, $) {

  /**
   * Responsible for fetching a page at custom interval
   *
   * @class Fetcher
   * @constructor
   * @param {String} url The url to fetch.
   * @param {Number} interval The interval at which it will fetch the page.
   */
  var Fetcher = function(url, interval) {

    /**
     * The interval id of the timeouts
     * @private
     * @type {Object}
     */
    var _intervalId;

    /**
     * The body of the page
     *
     * @private
     * @type {String}
     */
    var _body = '';

    /**
     * Holds the data that where parsed from the page
     *
     * @private
     * @type {Object}
     */
    var _items = {};

    /**
     * Holds the new items
     *
     * @private
     * @type {Array}
     */
    var _newItems = [];

    /**
     * The object that holds all the events
     *
     * @private
     * @type {Object}
     */
    var _events = {};

    /**
     * The instance of this class
     * @type {Fetcher}
     */
    var _self = this;

    /**
     * Parses the body of the page
     *
     * @private
     * @function
     */
    var _parseBody = function() {

      var $list = $(_body).find('#item_list');
      var rowsWithImages = $list.find('.item_row');


      for (var l = 0, len = rowsWithImages.length; l < len; l += 1) {

        var $row = $(rowsWithImages[l]);
        var id = $row.attr('id');

        if (typeof _items[id] === 'undefined') {

          var $title = $row.find('.item_link');
          var url = $title.attr('href');

          _items[id] = {};
          _items[id].url = url;

          _newItems.push(_items[id]);

        }

      }

      if (_newItems.length > 0) {
        _trigger('newItem', _newItems);
        _newItems = [];
      }

    };

    /**
     * Is triggered when a new chunk of data is fetched from the http.get function.
     *
     * @private
     * @function
     * @param  {String} chunk A chunk containing a part of the fetched data.
     */
    var _onFetchData = function(chunk) {
      _body += chunk;
    };

    /**
     * When all the data are fetched this function is triggered
     *
     * @private
     * @function
     */
    var _onFetchEnd = function() {
      _parseBody();
      var mem = process.memoryUsage();
      console.log('Memory:', Math.round(((mem.rss / 1024) / 1024)) + 'MB');
    };

    /**
     * This function is triggered when the http.get function is successfull.
     *
     * @private
     * @function
     * @param  {Object} res The response.
     */
    var _onFetchSuccess = function(res) {
      console.log('Got response' + res.statusCode, 'from', url);
      _body = '';
      res.setEncoding('utf8');
      res.on('data', _onFetchData);
      res.on('end', _onFetchEnd);
      _self.stop();
      _intervalId = setTimeout(_fetch, interval);
    };

    /**
     * If for some reason the http.get fails then this function is called.
     *
     * @private
     * @function
     * @param  {Error} e The error.
     */
    var _onFetchError = function(e) {
      console.log('Got error ' + e.message, 'from', url);
      _body = '';
      _self.stop();
      _intervalId = setTimeout(_fetch, interval);
      _trigger('error');
    };

    /**
     * Is triggered at each interval and fetches a pages contents
     * by using the http module
     *
     * @private
     * @function
     */
    var _fetch = function() {
      console.log('-------------------------------------------');
      console.log('Fetching', url + '...');
      console.log('-------------------------------------------');
      http.get(url, _onFetchSuccess).on('error', _onFetchError);
    };

    /**
     * Starts the interval for fetching a url
     *
     * @function
     * @public
     * @return {Fetcher} The instance of this object.
     */
    this.start = function() {
      this.stop();
      _fetch();
      return this;
    };

    /**
     * Stops the interval
     *
     * @public
     * @function
     */
    this.stop = function() {
      if (_intervalId) {
        clearTimeout(_intervalId);
      }
    };

    /**
     * Registers an event to a callback
     *
     * @public
     * @function
     * @param  {Strgin} event The event name.
     * @param  {Function} callback The callback to be register.
     */
    this.on = function(event, callback) {
      if (!_events[event]) {
        _events[event] = [];
      }
      _events[event].push(callback);

      return this;
    };

    /**
     * Triggers a specific event by executing the callback functions associated
     * with this event
     *
     * @private
     * @function
     * @param  {String} event The event type.
     * @param  {Object} data The data to send to the callback.
     */
    var _trigger = function(event, data) {
      if (_events[event]) {
        var events = _events[event];
        for (var i = 0; i < events.length; i++) {
          events[i](data);
        }
      }
    };

  };

  return Fetcher;
});
