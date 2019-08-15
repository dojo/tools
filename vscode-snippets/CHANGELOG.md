# Change Log

All notable changes to the "vscode-dojo-snippets" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## [6.0.6]

- **Enhancement** - Test runner command now prioritizes using `npm test` over direct commands, and prioritizes using the `test` script for test runner (intern or jest) detection.
- **New Feature** - Add `run all tests` command, which runs all the tests in a file by default, adding `--coverage` to jest runs. Includes new menu item and shortcut (Ctrl+Shift+Alt+T on windows or Cmd+Shift+Alt+T on mac)
  
  

  | Command                              | Purpose                                                           | Shortcut                 |
  | -------------------------------------| ----------------------------------------------------------------- | ------------------------ |
  | Dojo: Run all tests                  | Runs the selected file's tests in intern or jest                  | `Ctrl + Shift + Alt + T` |

## [6.0.5]

- **Bugfix** - Remove fs-extra as dependency

## [6.0.4]

- **New Feature** - Add test runner command, menu item and shortcut (Ctrl+Shift+T on windows or Cmd+Shift+T on mac) for intern and jest.

  | Command                              | Purpose                                                           | Shortcut           |
  | -------------------------------------| ----------------------------------------------------------------- | ------------------ |
  | Dojo: Run test                       | Runs the selected test, test suite or test file in intern or jest | `Ctrl + Shift + T` |

## [6.0.3]

- **Bugfix** - Fix broken commands.

## [6.0.2]

- **New Feature** - Add w/v (non-tsx) versions of tsx snippets.

## [6.0.1]

- **Bugfix** - Fix placement of properties deconstruction with multiline widget creation statements.

## [6.0.0]

- Initial release
