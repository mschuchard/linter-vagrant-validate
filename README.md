![Preview](https://raw.githubusercontent.com/mschuchard/linter-vagrant-validate/master/linter_vagrant_validate.png)

### Linter-Vagrant-Validate
`Linter-Vagrant-Validate` aims to provide functional and robust `vagrant validate` linting functionality within Pulsar.

This package is now in maintenance mode. All feature requests and bug reports in the Github repository issue tracker will receive a response, and possibly also be implemented (especially bug fixes). However, active development on this package has ceased.

### Installation
The `vagrant` package >= 1.9.4 is required to be installed before using this, since the new `validate` command feature was added for that version by hasyimibhar. The Atom-IDE-UI and Language-Ruby packages are also required.

All testing is performed with the latest stable version of Pulsar. Any version of Atom or any pre-release version of Pulsar is not supported.

### Usage
- All files with `Vagrantfile` in their name will be linted with this linter. Some output may be redundant with Ruby linters such as the syntax checker, Rubocop, and Reek.
