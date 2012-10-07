define(['cheerio'], function($) {

  /**
   * Responsible for formatting the results from the pages.
   *
   * @class Formatter
   * @constructor
   */
  var Formatter = function() {

    /**
     * It formats the data and creates a beautiful html template for each item
     *
     * @private
     * @function
     * @param  {Object} data The object containing all the data needed for the email.
     * @return {String} The formatted string.
     */
    this.formatForEmail = function(data) {
      var $thumbs = $(data.thumbs);
      $thumbs.find('li').attr('style', 'list-style:none; margin:0 10px 0 0; float:left;');
      $thumbs.find('li:last-child').remove();

      var thumbs = $thumbs.html();
      var $details = $(data.details);
      var params = $details.find('table.params').html();
      var description = $details.find('div.body').html();

      var body = '<h2><a href="' + data.url + '">' + data.title + '</a></h2>';
      body += (data.image !== null ? data.image + '<br/>' : '');
      body += '<ul style="padding:0px; margin:0px">' +
          (thumbs !== null ? thumbs + '<li style="list-style:none; clear:both; margin: 0"></li>' : '') + '</ul>';
      body += '<table cellpadding="2" cellspacing="2">' + params + '</table>';
      body += '<p>' + description + '</p>';
      body += '<hr size="1" />';

      return body;
    };

  };

  return Formatter;

});
