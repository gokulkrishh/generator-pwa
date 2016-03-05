'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');

module.exports = yeoman.generators.Base.extend({
  prompting: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the peachy ' + chalk.red('Progresssive Web App') + ' generator!'
    ));

    //No prompts as of now.
    var prompts = [{
      type: 'confirm',
      name: 'pushNotification',
      message: 'Would you like to add push notification ?',
      default: true
    },
    {
      type: 'input',
      name: 'apiKey',
      message: 'Enter push notification API key',
      validate: function (apiKey) {
        if (apiKey) {
          return true
        }
        else {
          return chalk.yellow('API key is required');
        }

      },
      when: function (answers) {
        return answers.pushNotification;
      }
    },
    {
      type: 'input',
      name: 'gcmSenderId',
      message: 'Enter GCM sender id',
      validate: function (apiKey) {
        if (apiKey) {
          return true
        }
        else {
          return chalk.yellow('GCM sender id is required');
        }

      },
      when: function (answers) {
        return answers.pushNotification;
      }
    }];

    this.prompt(prompts, function (props) {
      this.props = props;
      console.log('props --->', props);

      if (this.props.pushNotification) {
        console.log(this.props.apiKey);
        this.apiKey = this.props.apiKey;
      }
      // To access props later use this.props.someOption;
      done();
    }.bind(this));
  },

  writing: function () {
    this.fs.copy(
      this.templatePath('css'),
      this.destinationPath('css')
    );
    this.fs.copy(
      this.templatePath('images'),
      this.destinationPath('images')
    );
    this.fs.copyTpl(
      this.templatePath('js/app.js'),
      this.destinationPath('js/app.js'),
      { pushNotification: this.props.pushNotification }
    );
    this.fs.copy(
      this.templatePath('favicon.ico'),
      this.destinationPath('favicon')
    );
    this.fs.copy(
      this.templatePath('index.html'),
      this.destinationPath('index.html')
    );
    this.fs.copy(
      this.templatePath('sw.js'),
      this.destinationPath('sw.js')
    );
    this.fs.copy(
      this.templatePath('sw-cache-polyfill.js'),
      this.destinationPath('sw-cache-polyfill.js')
    );
    this.fs.copyTpl(
      this.templatePath('manifest.json'),
      this.destinationPath('manifest.json'),
      { gcmSenderId: this.props.gcmSenderId }
    );
    this.fs.copy(
      this.templatePath('package.json'),
      this.destinationPath('package.json')
    );

    //If push notifications is prompted
    if (this.props.pushNotification) {
      this.fs.copyTpl(
        this.templatePath('server.js'),
        this.destinationPath('server.js'),
        { apiKey: this.props.apiKey }
      );

      this.fs.copyTpl(
        this.templatePath('js/push.js'),
        this.destinationPath('js/push.js'),
        { apiKey: this.props.apiKey }
      );
    }
  },

  install: function () {
    this.installDependencies();
  }
});
