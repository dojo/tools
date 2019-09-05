# Change Log

All notable changes to the "vscode-dojo-snippets" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## [6.0.11]

- **Bugfix** - Remove extra `}` from Widget Classes Property snippet

## [6.0.10]

- **Enhancement** - Test Runner - Save file at start of execution.
- **Bugfix** - Properly add theme.classes and i18n.localize lines to multi line factory calls with a single middleware line.

## [6.0.9]

- **Bugfix** - Properly add middleware to factory calls with renamed middleware.
- **Bugfix** - Match `test` statements when finding the test to run in Jest.

## [6.0.8]

- **New Feature** - Add the following new middleware snippets:
  
  | Snippet                           | Purpose                                                      |
  | --------------------------------- | ------------------------------------------------------------ |
  | `d-icache-get`                    | icache middleware get                                        |
  | `d-icache-getorset`               | icache middleware getOrSet                                   |
  | `d-icache-getorset-typeed`        | icache middleware getOrSet with typed return                 |
  | `d-icache-set`                    | icache middleware set                                        |
  | `d-cache-get`                     | cache middleware get                                         |
  | `d-cache-set`                     | cache middleware set                                         |
  | `d-localize`                      | localize nls bundle                                          |
  | `d-theme-classes`                 | theme css module                                             |
  | `d-block-run`                     | block middleware run                                         |
  | `d-breakpoint-get`                | breakpoint middleware get                                    |
  | `d-breakpoint-get-custom`         | breakpoint middleware get with custom breakpoints            |
  | `d-dimensions-get`                | breakpoint dimensions get                                    |
  | `d-focus-isFocused`               | focus middleware isFocused                                   |
  | `d-intersection-get`              | intersection middleware get                                  |
  | `d-resize-get`                    | resize middleware get                                        |

## [6.0.7]

- **Enhancement** - Add `defaultRoute: true` to initial entry in `d-routes` snippet.
- **Enhancement** - All snippets are available now in both `ts` and `tsx` files, with appropriate versions being used based on file type.
- **New Feature** - Add the following new snippets:
  
  | Snippet                           | Purpose                                                      |
  | --------------------------------- | ------------------------------------------------------------ |
  | `d-route-default`                 | route with `defaultRoute: true`                              |
  | `d-route-default-params`          | route with default parameter values                          |
  | `d-route-children-default-params` | route with default parameter values and children             |
  | `d-block`                         | block function (used by block middleware)                    |
  | `d-block-options`                 | block function with options (used by block middleware)       |
  | `d-store-get`                     | store middleware get operation                               |
  | `d-store-apply`                   | store middleware apply operation                             |
  | `d-widget-classes`                | adds widget classes property                                 |

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
