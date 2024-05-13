'use babel';

export default {
  config: {
    vagrantExecutablePath: {
      title: 'Vagrant Executable Path',
      type: 'string',
      description: 'Path to Vagrant executable (e.g. /usr/bin/vagrant) if not in shell env path.',
      default: 'vagrant',
    },
  },

  // activate linter to check for proper version
  activate() {
    const helpers = require('atom-linter');

    // check for vagrant >= minimum version
    helpers.exec(atom.config.get('linter-vagrant-validate.vagrantExecutablePath'), ['--help']).then(output => {
      if (!(/validate/.exec(output))) {
        atom.notifications.addError(
          'The vagrant installed in your path is too old to support the vagrant validate command.',
          { detail: 'Please upgrade your version of vagrant to >= 1.9.4.' }
        );
      }
    });
  },

  deactivate() {
    this.idleCallbacks.forEach((callbackID) => window.cancelIdleCallback(callbackID));
    this.idleCallbacks.clear();
    this.subscriptions.dispose();
  },

  provideLinter() {
    return {
      name: 'Vagrant',
      grammarScopes: ['source.ruby'],
      scope: 'file',
      lintsOnChange: false,
      lint: async (textEditor) => {
        // establish const vars
        const helpers = require('atom-linter');
        const file = textEditor.getPath();

        // bail out if this is not a Vagrantfile
        if (!(/Vagrantfile/.exec(file))) return [];

        // initialize linter return
        const toReturn = [];

        return helpers.exec(atom.config.get('linter-vagrant-validate.vagrantExecutablePath'), ['validate', '--no-color'], { cwd: require('path').dirname(file), stream: 'stderr', allowEmptyStderr: true }).then(output => {
          let lineNum = 0;
          let block = '';

          output.split(/\r?\n/).forEach((line) => {
            // matchers for output parsing and capturing
            const matchesRuby = /Vagrantfile:(\d+):(.*)/.exec(line);
            const matchesVagrant = /\* (.*)/.exec(line);
            const matchesRubyVagrant = /Message: (.*)/.exec(line);
            const matchesBlock = /^(.*):$/.exec(line);
            const matchesLineNum = /Line number: (\d+)/.exec(line);

            // check for block or line number info
            if (matchesBlock != null)
              block = matchesBlock[1] + ': ';
            else if (matchesLineNum != null)
              lineNum = Number.parseInt(matchesLineNum[1], 10) - 1;
            // check for ruby errors in current file
            else if (matchesRuby != null) {
              toReturn.push({
                severity: 'error',
                excerpt: matchesRuby[2],
                location: {
                  file,
                  position: [[Number.parseInt(matchesRuby[1], 10) - 1, 0], [Number.parseInt(matchesRuby[1], 10) - 1, 1]],
                },
              });
            } else if (matchesVagrant != null) {
              // check for vagrant errors in current file
              toReturn.push({
                severity: 'error',
                excerpt: block + matchesVagrant[1],
                location: {
                  file,
                  position: [[0, 0], [0, 1]],
                },
              });
            } else if (matchesRubyVagrant != null) {
              // check for ruby errors that vagrant catches in current file
              toReturn.push({
                severity: 'error',
                excerpt: matchesRubyVagrant[1],
                location: {
                  file,
                  position: [[lineNum, 0], [lineNum, 1]],
                },
              });
              // reset lineNum
              lineNum = 0;
            }
          });
          return toReturn;
        })
          .catch(error => {
            // check for stdin lint attempt
            if (/\.dirname/.exec(error.message) != null) {
              toReturn.push({
                severity: 'info',
                excerpt: 'Vagrant cannot lint on stdin due to nonexistent Vagrantfile/Vagrant machine. Please save this Vagrantfile to your filesystem.',
                location: {
                  file: 'Save this Vagrantfile.',
                  position: [[0, 0], [0, 1]],
                },
              });
            } else {
              // notify on other errors
              atom.notifications.addError(
                'An error occurred with linter-vagrant-validate.',
                { detail: error.message }
              );
            }
            return toReturn;
          });
      }
    };
  }
};
