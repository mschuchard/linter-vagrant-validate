![Preview](https://raw.githubusercontent.com/mschuchard/linter-vagrant-validate/master/linter_vagrant_validate.png)

### Linter-Vagrant-Validate
[![Build Status](https://travis-ci.org/mschuchard/linter-vagrant-validate.svg?branch=master)](https://travis-ci.org/mschuchard/linter-vagrant-validate)

`Linter-Vagrant-Validate` aims to provide functional and robust `vagrant validate` linting functionality within Atom.

### Installation
The `vagrant` package >= 1.9.4 is required to be installed before using this, since the new `validate` command feature was added for that version by hasyimibhar. The `Linter` and `Language-Ruby` Atom packages are also required, but should be automatically installed as dependencies thanks to steelbrain's `package-deps`.

### Usage
- All files named `Vagrantfile` will be linted with this linter. Some output may be redundant with Ruby linters such as the syntax checker, Rubocop, and Reek.
