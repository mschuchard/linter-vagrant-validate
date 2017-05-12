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

  // activate linter
  activate() {
    require('atom-package-deps').install('linter-vagrant-validate');
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
        const regex_block = /^(.*):$/

        return helpers.exec(atom.config.get('linter-vagrant-validate.vagrantExecutablePath'), ['validate'], {cwd: require('path').dirname(file), stream: 'stderr', allowEmptyStderr: true}).then(output => {
          var toReturn = [];
          output.split(/\r?\n/).forEach(function (line) {
            // matchers for output parsing and capturing
            const matches_ruby = regex_ruby.exec(line);
            const matches_vagrant = regex_vagrant.exec(line);
            const matches_ruby_vagrant = regex_ruby_vagrant.exec(line);
            const matches_block = regex_block.exec(line)

            if (matches_block != null)
              block = matches_block[1] + ': '

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
                  position: [[0, 0], [0, 1]],
                },
              });
            }
          });
          return toReturn;
        });
      }
    };
  }
};
