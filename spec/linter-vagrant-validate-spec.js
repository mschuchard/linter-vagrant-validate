'use babel';

import * as path from 'path';

describe('The Vagrant Validate provider for Linter', () => {
  const lint = require(path.join('..', 'lib', 'main.js')).provideLinter().lint;

  beforeEach(() => {
    atom.workspace.destroyActivePaneItem();
    waitsForPromise(() => {
      atom.packages.activatePackage('linter-vagrant-validate');
      return atom.packages.activatePackage('language-ruby').then(() =>
        atom.workspace.open(path.join(__dirname, 'fixtures/clean', 'Vagrantfile'))
      );
    });
  });

  describe('checks a file with a block arg syntax issue', () => {
    let editor = null;
    const badFile = path.join(__dirname, 'fixtures/block_arg', 'Vagrantfile');
    beforeEach(() => {
      waitsForPromise(() =>
        atom.workspace.open(badFile).then(openEditor => {
          editor = openEditor;
        })
      );
    });

    it('finds the first message', () => {
      waitsForPromise(() =>
        lint(editor).then(messages => {
          expect(messages.length).toEqual(1);
        })
      );
    });

    it('verifies the first message', () => {
      waitsForPromise(() => {
        return lint(editor).then(messages => {
          expect(messages[0].severity).toBeDefined();
          expect(messages[0].severity).toEqual('error');
          expect(messages[0].excerpt).toBeDefined();
          expect(messages[0].excerpt).toEqual("in `block in <top (required)>': undefined local variable or method `cnfig' for main:Object (NameError)");
          expect(messages[0].location.file).toBeDefined();
          expect(messages[0].location.file).toMatch(/.+block_arg\/Vagrantfile$/);
          expect(messages[0].location.position).toBeDefined();
          expect(messages[0].location.position).toEqual([[2, 0], [2, 1]]);
        });
      });
    });
  });

  it('finds nothing wrong with a valid file', () => {
    waitsForPromise(() => {
      const goodFile = path.join(__dirname, 'fixtures/clean', 'Vagrantfile');
      return atom.workspace.open(goodFile).then(editor =>
        lint(editor).then(messages => {
          expect(messages.length).toEqual(0);
        })
      );
    });
  });
});
