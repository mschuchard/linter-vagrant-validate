![Preview](https://raw.githubusercontent.com/mschuchard/linter-vagrant-validate/master/linter_vagrant_validate.png)

### Linter-Vagrant-Validate
[![Build Status](https://travis-ci.com/mschuchard/linter-vagrant-validate.svg?branch=master)](https://travis-ci.com/mschuchard/linter-vagrant-validate)

`Linter-Vagrant-Validate` aims to provide functional and robust `vagrant validate` linting functionality within Atom/Pulsar.

### APM (Atom) and PPM (Pulsar) Support

`apm` was discontinued prior to the sunset by the Atom Editor team. `ppm` for Pulsar does not yet support package publishing. Therefore, the installation instructions are now as follows if you want the latest version in Atom, Atom Beta, or Atom Dev:

- Locate the Atom or Pulsar packages directory on your filesystem (normally at `<home>/.{atom,pulsar}/packages`)
- Retrieve the code from this repository either via `git` or the Code-->Download ZIP option in Github.
- Place the directory containing the repository's code in the Atom or Pulsar packages directory.
- Execute `npm install` in the package directory (requires NPM).
- Repeat for any missing or outdated dependencies.

and Pulsar:

- Install the old version of the package as usual with either PPM or the GUI installer in the editor.
- Locate the Atom or Pulsar packages directory on your filesystem (normally at `<home>/.{atom,pulsar}/packages`)
- Replace the `lib/main.js` file in the package directory with the file located in this remote Github repository.

Additionally: this package is now in maintenance mode. All feature requests and bug reports in the Github repository issue tracker will receive a response, and possibly also be implemented (especially bug fixes). However, active development on this package has ceased.

Note that at this current time the package unit tests (outside of CI which will be Atom Beta `1.61.0` for the time being) and acceptance testing are performed with the latest stable version of Pulsar.

### Installation
The `vagrant` package >= 1.9.4 is required to be installed before using this, since the new `validate` command feature was added for that version by hasyimibhar. The `Linter` and `Language-Ruby` Atom packages are also required.

### Usage
- All files with `Vagrantfile` in their name will be linted with this linter. Some output may be redundant with Ruby linters such as the syntax checker, Rubocop, and Reek.
