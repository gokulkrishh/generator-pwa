'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var updateNotifier = require('update-notifier');
var yosay = require('yosay');
var _ = require('underscore.string');
var path = require('path');
var pkg = require('../../package.json');
var notifier = updateNotifier({pkg: pkg});

//If an update for generator avaiable, notify user
if (notifier.update) {
  notifier.notify();
  console.log(notifier.update); //Info about the update
}

module.exports = yeoman.generators.Base.extend({
  prompting: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the peachy ' + chalk.red('Progresssive Web App') + ' generator!'
    ));

    this.log(
      chalk.yellow('┌──────────────────────────────────────────────────────────────┐ \n' +
                   '| Answer few questions to kick start your pwa application      | \n' +
                   '└──────────────────────────────────────────────────────────────┘ ')
    )

    //No prompts as of now.
    var prompts = [{
      name: 'appName',
      message: 'What would you like to name your app?',
      default: process.cwd().split(path.sep).pop()
    },
    {
      type: 'confirm',
      name: 'isPush',
      message: 'Would you like to add push notification?',
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
        return answers.isPush;
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
        return answers.isPush;
      }
    }];

    this.prompt(prompts, function (props) {
      this.props = props;
      this.appName = _.camelize(_.slugify(_.humanize(props.appName)));
      done();
    }.bind(this));
  },

  writing: function () {

    this.log(
      chalk.yellow('\n┌──────────────────────────────────────────────────────────────┐ \n' +
                     '| Creating the project structure                               | \n' +
                     '└──────────────────────────────────────────────────────────────┘ ')
    );

    this.fs.copy(
      this.templatePath('css'),
      this.destinationPath(this.appName + '/app/css')
    );
    this.fs.copy(
      this.templatePath('images'),
      this.destinationPath(this.appName + '/app/images')
    );
    this.fs.copyTpl(
      this.templatePath('js/app.js'),
      this.destinationPath(this.appName + '/app/js/app.js'),
      { isPush: this.props.isPush }
    );
    this.fs.copy(
      this.templatePath('favicon.ico'),
      this.destinationPath(this.appName + '/app/favicon.ico')
    );
    this.fs.copyTpl(
      this.templatePath('index.html'),
      this.destinationPath(this.appName + '/app/index.html'),
      { isPush: this.props.isPush, appName: this.appName }
    );
    this.fs.copy(
      this.templatePath('sw.js'),
      this.destinationPath(this.appName + '/app/sw.js')
    );
    this.fs.copyTpl(
      this.templatePath('manifest.json'),
      this.destinationPath(this.appName + '/app/manifest.json'),
      { gcmSenderId: this.props.gcmSenderId, appName: this.appName }
    );
    this.fs.copyTpl(
      this.templatePath('package.json'),
      this.destinationPath(this.appName + '/package.json'),
      { appName: this.appName }
    );
    this.fs.copy(
      this.templatePath('gitignore'),
      this.destinationPath(this.appName + '/.gitignore')
    );
    this.fs.copy(
      this.templatePath('gulpfile.js'),
      this.destinationPath(this.appName + '/gulpfile.js')
    );

    //If push notifications is prompted
    if (this.props.isPush) {
      this.fs.copyTpl(
        this.templatePath('server.js'),
        this.destinationPath(this.appName + '/server.js'),
        { apiKey: this.props.apiKey }
      );

      this.fs.copyTpl(
        this.templatePath('js/push.js'),
        this.destinationPath(this.appName + '/app/js/push.js'),
        { apiKey: this.props.apiKey }
      );
    }
  },

  install: function () {
    this.log(
      chalk.green('\n ✔  Project structure created successfully! \n\n') +
      chalk.yellow('┌──────────────────────────────────────────────────────────────┐ \n' +
                   '| Installating Dependencies, Please wait...                    | \n' +
                   '└──────────────────────────────────────────────────────────────┘ ')
    );
    this.installDependencies();
  }
});
