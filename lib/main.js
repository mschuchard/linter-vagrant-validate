'use babel';

export default {
  config: {
    vagrantExecutablePath: {
      title: 'Vagrant Executable Path',
      type: 'string',
      description: 'Path to Vagrant executable (e.g. /usr/bin/vagrant) if not in shell env path.',
      default: 'vagrant',
    }
  },

  // activate linter to check for proper version
  activate() {
    const helpers = require("atom-linter");

    // check for vagrant >= minimum version
    helpers.exec(atom.config.get('linter-vagrant-validate.vagrantExecutablePath'), ['validate']).then(output => {
      if (/Usage: vagrant/.exec(output)) {
        atom.notifications.addError(
          'The vagrant installed in your path is too old to support the vagrant validate command.',
          {
            detail: "Please upgrade your version of vagrant to >= 1.9.4.\n"
          }
        );
      }
    });
  },

  provideLinter() {
    return {
      name: 'Vagrant',
      grammarScopes: ['source.ruby'],
      scope: 'file',
      lintsOnChange: false,
      lint: (activeEditor) => {
        // establish const vars
        const helpers = require('atom-linter');
        const file = activeEditor.getPath();

        // bail out if this is not a Vagrantfile
        if (!(/Vagrantfile/.exec(file)))
          return [];

        // regexps for matching on output
        const regex_ruby = /Vagrantfile:(\d+):(.*)/;
        const regex_vagrant = /\* (.*)/;
        const regex_ruby_vagrant = /Message: (.*)/;
        const regex_block = /^(.*):$/;
        const regex_line_num = /Line number: (\d+)/;

        return helpers.exec(atom.config.get('linter-vagrant-validate.vagrantExecutablePath'), ['validate'], {cwd: require('path').dirname(file), stream: 'stderr', allowEmptyStderr: true}).then(output => {
          var toReturn = [];
          var line_num = 0;
          output.split(/\r?\n/).forEach(function (line) {
            // matchers for output parsing and capturing
            const matches_ruby = regex_ruby.exec(line);
            const matches_vagrant = regex_vagrant.exec(line);
            const matches_ruby_vagrant = regex_ruby_vagrant.exec(line);
            const matches_block = regex_block.exec(line);
            const matches_line_num = regex_line_num.exec(line);

            if (matches_block != null)
              block = matches_block[1] + ': '
            else if (matches_line_num != null)
              line_num = Number.parseInt(matches_line_num[1] - 1);

            // check for ruby errors in current file
            if (matches_ruby != null) {
              toReturn.push({
                severity: 'error',
                excerpt: matches_ruby[2],
                location: {
                  file: file,
                  position: [[Number.parseInt(matches_ruby[1]) - 1, 0], [Number.parseInt(matches_ruby[1]) - 1, 1]],
                },
              });
            }
            // check for vagrant errors in current file
            else if (matches_vagrant != null) {
              toReturn.push({
                severity: 'error',
                excerpt: block + matches_vagrant[1],
                location: {
                  file: file,
                  position: [[0, 0], [0, 1]],
                },
              });
            }
            // check for ruby errors that vagrant catches in current file
            else if (matches_ruby_vagrant != null) {
              toReturn.push({
                severity: 'error',
                excerpt: matches_ruby_vagrant[1],
                location: {
                  file: file,
                  position: [[line_num, 0], [line_num, 1]],
                },
              });
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
                file: file,
                position: [[0, 0], [0, 1]],
              },
            });
          }
          return toReturn;
        });
      }
    };
  }
};
