define(['http', 'cheerio', 'iconv'], function(http, $, Iconv) {

  /**
   * Responsible for fetching the details
   *
   * @class DetailsFetcher
   * @constructor
   * @param {String} url The url to fetch.
   */
  var DetailsFetcher = function(url) {

    /**
     * The body of the page
     *
     * @private
     * @type {String}
     */
    var _body = '';

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

      $(_body);

      // Get the details and remove all unecessary stuff
      var $details = $(_body).find('.details');
      $details.find('#view_menu').remove();
      $details.find('#social_interaction').remove();
      $details.find('#contact').remove();
      $details.find('#bank_calc').remove();
      $details.find('#ad_reply').remove();

      var data = {
        title: $(_body).find('.view h2').html(),
        image: $(_body).find('#media').html(),
        details: $details.html(),
        thumbs: $(_body).find('#thumbs')[0],
        url: url
      };

      _trigger('data', data);

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
      var iconv = new Iconv.Iconv('ISO-8859-1', 'UTF8');
      var body = iconv.convert(body);
      _parseBody();
    };

    /**
     * This function is triggered when the http.get function is successfull.
     *
     * @private
     * @function
     * @param  {Object} res The response.
     */
    var _onFetchSuccess = function(res) {
      _body = '';
      res.setEncoding('binary');
      res.on('data', _onFetchData);
      res.on('end', _onFetchEnd);
    };

    /**
     * If for some reason the http.get fails then this function is called.
     *
     * @private
     * @function
     * @param  {Error} e The error.
     */
    var _onFetchError = function(e) {
      console.log('Got error while trying to load the details page: ' + e.message);
      _body = '';
      _self.trigger('error');
    };

    /**
     * Is triggered at each interval and fetches a pages contents
     * by using the http module
     *
     * @private
     * @function
     */
    var _fetch = function() {
      http.get(url, _onFetchSuccess).on('error', _onFetchError);
    };

    /**
     * Starts the interval for fetching a url
     *
     * @function
     * @public
     * @return {Fetcher} The instance of this object.
     */
    this.fetch = function() {
      _fetch();
      return this;
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

  return DetailsFetcher;
});
