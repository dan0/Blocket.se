define(['emailjs'], function(email) {

  /**
   * The email wrapper responsible for sending emails by using the emailjs module
   *
   * @class Emailer
   * @constructor
   * @param {String} username The username that will be used for connecting to the smtp server.
   * @param {String} password The password.
   * @param {String} host The host that we are going to connect to.
   * @param {Boolean} ssl Is set to true if we want to send via SSL.
   */
  var Emailer = function(username, password, host, ssl) {

    //Creates an email server
    var server = email.server.connect({
      user: username,
      password: password,
      host: host,
      ssl: ssl
    });

    /**
     * Sens an email
     *
     * @private
     * @function
     * @param  {String} to The receipients email.
     * @param  {String} subject The email's subject.
     * @param  {String} body The body.
     */
    this.send = function(to, subject, body) {
      console.log('Sending email...');
      // send the message and get a callback with an error or details of the message that was sent
      server.send({
        text: 'New ads\n\n\n',
        from: username,
        to: to,//'urszula.suwada@gmail.com',
        //cc: to,
        subject: subject,
        attachment: [{data: body, alternative: true, type: 'text/html', charset: 'utf-8', inline: true}]
      }, function(err, message) {
        if (err) {
          console.log('Email error!', err.message);
        } else {
          console.log('Email sent!');
        }
      });
    };
  };

  return Emailer;

});
