'use babel';

import * as path from 'path';

describe('The Vagrant Validate provider for Linter', () => {
  const lint = require(path.join(__dirname, '../lib/main.js')).provideLinter().lint;

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
          expect(messages[0].excerpt).toEqual("undefined local variable or method `cnfig'");
          expect(messages[0].location.file).toBeDefined();
          expect(messages[0].location.file).toMatch(/.+block_arg\/Vagrantfile$/);
          expect(messages[0].location.position).toBeDefined();
          expect(messages[0].location.position).toEqual([[2, 0], [2, 1]]);
        });
      });
    });
  });

  describe('checks a file with an invalid setting', () => {
    let editor = null;
    const badFile = path.join(__dirname, 'fixtures/invalid_setting', 'Vagrantfile');
    beforeEach(() => {
      waitsForPromise(() =>
        atom.workspace.open(badFile).then(openEditor => {
          editor = openEditor;
        })
      );
    });

    it('finds the two messages', () => {
      waitsForPromise(() =>
        lint(editor).then(messages => {
          expect(messages.length).toEqual(2);
        })
      );
    });

    it('verifies the two messages', () => {
      waitsForPromise(() => {
        return lint(editor).then(messages => {
          expect(messages[0].severity).toBeDefined();
          expect(messages[0].severity).toEqual('error');
          expect(messages[0].excerpt).toBeDefined();
          expect(messages[0].excerpt).toEqual('vm: The following settings shouldn\'t exist: bix');
          expect(messages[0].location.file).toBeDefined();
          expect(messages[0].location.file).toMatch(/.+invalid_setting\/Vagrantfile$/);
          expect(messages[0].location.position).toBeDefined();
          expect(messages[0].location.position).toEqual([[0, 0], [0, 1]]);
          expect(messages[1].severity).toBeDefined();
          expect(messages[1].severity).toEqual('error');
          expect(messages[1].excerpt).toBeDefined();
          expect(messages[1].excerpt).toEqual('vm: A box must be specified.');
          expect(messages[1].location.file).toBeDefined();
          expect(messages[1].location.file).toMatch(/.+invalid_setting\/Vagrantfile$/);
          expect(messages[1].location.position).toBeDefined();
          expect(messages[1].location.position).toEqual([[0, 0], [0, 1]]);
        });
      });
    });
  });

  describe('checks a file with multiple block syntax issues', () => {
    let editor = null;
    const badFile = path.join(__dirname, 'fixtures/multiple_blocks', 'Vagrantfile');
    beforeEach(() => {
      waitsForPromise(() =>
        atom.workspace.open(badFile).then(openEditor => {
          editor = openEditor;
        })
      );
    });

    it('finds the three messages', () => {
      waitsForPromise(() =>
        lint(editor).then(messages => {
          expect(messages.length).toEqual(3);
        })
      );
    });

    it('verifies the first message', () => {
      waitsForPromise(() => {
        return lint(editor).then(messages => {
          expect(messages[0].severity).toBeDefined();
          expect(messages[0].severity).toEqual('error');
          expect(messages[0].excerpt).toBeDefined();
          expect(messages[0].excerpt).toEqual('vm: The following settings shouldn\'t exist: bix');
          expect(messages[0].location.file).toBeDefined();
          expect(messages[0].location.file).toMatch(/.+multiple_blocks\/Vagrantfile$/);
          expect(messages[0].location.position).toBeDefined();
          expect(messages[0].location.position).toEqual([[0, 0], [0, 1]]);
          expect(messages[1].severity).toBeDefined();
          expect(messages[1].severity).toEqual('error');
          expect(messages[1].excerpt).toBeDefined();
          expect(messages[1].excerpt).toEqual('vm: A box must be specified.');
          expect(messages[1].location.file).toBeDefined();
          expect(messages[1].location.file).toMatch(/.+multiple_blocks\/Vagrantfile$/);
          expect(messages[1].location.position).toBeDefined();
          expect(messages[1].location.position).toEqual([[0, 0], [0, 1]]);
          expect(messages[2].severity).toBeDefined();
          expect(messages[2].severity).toEqual('error');
          expect(messages[2].excerpt).toBeDefined();
          expect(messages[2].excerpt).toEqual("Vagrant: Unknown configuration section 'vb'.");
          expect(messages[2].location.file).toBeDefined();
          expect(messages[2].location.file).toMatch(/.+multiple_blocks\/Vagrantfile$/);
          expect(messages[2].location.position).toBeDefined();
          expect(messages[2].location.position).toEqual([[0, 0], [0, 1]]);
        });
      });
    });
  });

  describe('checks a file with a vagrant block arg syntax issue', () => {
    let editor = null;
    const badFile = path.join(__dirname, 'fixtures/vagrant_block_arg', 'Vagrantfile');
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
          expect(messages[0].excerpt).toEqual("NameError: undefined local variable or method `vb' for main:Object");
          expect(messages[0].location.file).toBeDefined();
          expect(messages[0].location.file).toMatch(/.+vagrant_block_arg\/Vagrantfile$/);
          expect(messages[0].location.position).toBeDefined();
          expect(messages[0].location.position).toEqual([[11, 0], [11, 1]]);
        });
      });
    });
  });

  it('ignores a non-Vagrant ruby file', (done) => {
    const goodFile = path.join(__dirname, 'fixtures', 'not_vagrant.rb');
    return atom.workspace.open(goodFile).then(editor =>
      lint(editor).then(messages => {
      }, () => {
        done();
      })
    );
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
