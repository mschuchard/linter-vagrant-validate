![Preview](https://raw.githubusercontent.com/mschuchard/linter-vagrant-validate/master/linter_vagrant_validate.png)

### Linter-Vagrant-Validate
[![Build Status](https://travis-ci.com/mschuchard/linter-vagrant-validate.svg?branch=master)](https://travis-ci.com/mschuchard/linter-vagrant-validate)

`Linter-Vagrant-Validate` aims to provide functional and robust `vagrant validate` linting functionality within Atom.

### Atom Editor Sunset Updates

`apm` was discontinued prior to the sunset by the Atom Editor team. Therefore, the installation instructions are now as follows:

- Locate the Atom packages directory on your filesystem (normally at `<home>/.atom/packages`)
- Retrieve the code from this repository either via `git` or the Code-->Download ZIP option in Github.
- Place the directory containing the repository's code in the Atom packages directory.
- Execute `npm install` in the package directory.

Additionally, this package is now in maintenance mode. All feature requests and bug reports in the Github repository issue tracker will receive a response, and possibly also be implemented. However, active development on this package has ceased.

### Installation
The `vagrant` package >= 1.9.4 is required to be installed before using this, since the new `validate` command feature was added for that version by hasyimibhar. The `Linter` and `Language-Ruby` Atom packages are also required.

### Usage
- All files with `Vagrantfile` in their name will be linted with this linter. Some output may be redundant with Ruby linters such as the syntax checker, Rubocop, and Reek.
