# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [[1.0.3]] - 2022-04-12

### Changed

- Language Tweaks in Smells content

### Removed

- Old, leftover _to-do_ in [Occurrences](../src/model/Occurrences.tsx) regarding icon

## [[1.0.2]] - 2022-04-08

### Changed

- Website Description
- Icons for:
  - Obstruction:
    - Other
  - Occurrence:
    - Responsibility
    - Unnecessary Complexity
  - Smell Hierarchies:
    - Linguistic Smell

## [[1.0.1]] - 2022-04-04

**Migrated from [Material v4](https://v4.mui.com/) to [Material v5](https://mui.com/)**

### Fixed

- [FOUC](https://en.wikipedia.org/wiki/Flash_of_unstyled_content) by [force-reloading](../src/utils/reloadPageOnFirstVisit.ts) page on first visit (only on the Catalog page).

## [[1.0.0]] - 2022-04-03

**Project Published**

### Added

- **Code Smells**:
  - [Afraid to Fail](../content/smells/afraid-to-fail.md)
  - [Alternative Classes with Different Interfaces](../content/smells/alternative-classes-with-different-interfaces.md)
  - [Base Class Depends on Subclass](../content/smells/base-class-depends-on-subclass.md)
  - [Binary Operator in Name](../content/smells/binary-operator-in-name.md)
  - [Boolean Blindness](../content/smells/boolean-blindness.md)
  - [Callback Hell](../content/smells/callback-hell.md)
  - [Clever Code](../content/smells/clever-code.md)
  - [Combinatorial Explosion](../content/smells/combinatorial-explosion.md)
  - [Complicated Boolean Expression](../content/smells/combinatorial-explosion.md)
  - [Complicated Regex Expression](../content/smells/complicated-regex-expression.md)
  - [Conditional Complexity](../content/smells/conditional-complexity.md)
  - [Data Clump](../content/smells/data-clump.md)
  - [Dead Code](../content/smells/dead-code.md)
  - [Divergent Change](../content/smells/divergent-change.md)
  - [Dubious Abstraction](../content/smells/dubious-abstraction.md)
  - [Duplicated Code](../content/smells/duplicated-code.md)
  - [Fallacious Comment](../content/smells/fallacious-comment.md)
  - [Fallacious Method Name](../content/smells/fallacious-method-name.md)
  - [Fate Over Action](../content/smells/fate-over-action.md)
  - [Feature Envy](../content/smells/feature-envy.md)
  - [Flag Argument](../content/smells/flag-argument.md)
  - [Global Data](../content/smells/global-data.md)
  - [Hidden Dependencies](../content/smells/hidden-dependencies.md)
  - [Imperative Loops](../content/smells/imperative-loops.md)
  - [Inappropriate Static](../content/smells/inappropriate-static.md)
  - [Incomplete Library Class](../content/smells/incomplete-library-class.md)
  - [Inconsistent Names](../content/smells/inconsistent-names.md)
  - [Inconsistent Style](../content/smells/inconsistent-style.md)
  - [Indecent Exposure](../content/smells/indecent-exposure.md)
  - [Insider Trading](../content/smells/insider-trading.md)
  - [Large Class](../content/smells/large-class.md)
  - [Lazy Element](../content/smells/lazy-element.md)
  - [Long Method](../content/smells/long-method.md)
  - [Long Parameter List](../content/smells/long-parameter-list.md)
  - [Magic Number](../content/smells/magic-number.md)
  - [Message Chain](../content/smells/message-chain.md)
  - [Middle Man](../content/smells/middle-man.md)
  - [Mutable Data](../content/smells/mutable-data.md)
  - [Null Check](../content/smells/null-check.md)
  - [Obscured Intent](../content/smells/obscured-intent.md)
  - [Oddball Solution](../content/smells/oddball-solution.md)
  - [Parallel Inheritance Hierarchies](../content/smells/parallel-inheritance-hierarchies.md)
  - [Primitive Obsession](../content/smells/primitive-obsession.md)
  - [Refused Bequest](../content/smells/refused-bequest.md)
  - [Required Setup or Teardown Code](../content/smells/required-setup-or-teardown-code.md)
  - [Shotgun Surgery](../content/smells/shotgun-surgery.md)
  - [Side Effects](../content/smells/side-effects.md)
  - [Special Case](../content/smells/special-case.md)
  - [Speculative Generality](../content/smells/speculative-generality.md)
  - [Status Variable](../content/smells/status-variable.md)
  - [Temporary Field](../content/smells/temporary-field.md)
  - [Tramp Data](../content/smells/tramp-data.md)
  - [Type Embedded In Name](../content/smells/type-embedded-in-name.md)
  - [Uncommunicative Name](../content/smells/uncommunicative-name.md)
  - [Vertical Separation](../content/smells/vertical-separation.md)
  - ["What" Comment](../content/smells/what-comment.md)
- **Documentation**:
  - [`README.md`](../README.md)
  - [`CHANGELOG.md`](CHANGELOG.md)
- **Data Scraping Scripts** (Python) to parse contents of [`/content/smells/`](../content/smells/) into `.json` files. They main method is located in [`/data/main.py`](../data/main.py) and can be run via `python main.py`. The only package requirement can be installed via `python -m pip install` [`python-frontmatter`](https://pypi.org/project/python-frontmatter/).
- **Website**:
  - Homepage with catalog for all the smells from [`/content/smells/`](../content/smells/) displayed as cards. They can be clicked on to show up a modal dialog with all the available information.
  - The homepage has a filter sidebar for easier browsing. Smells can be filtered by the categorization types (_occurrence_, _expanse_, _obstruction_, _type_of_smell_, _tags_)
  - Separate page articles for each smell, so they can be directly linked to by anyone for any reason.
  - Separate page articles navigation bar on the left to browse to other smells. This navigation bar can be turned to list by a different type of categorization types.

[1.0.3]: https://github.com/Luzkan/smells/releases/tag/1.0.3
[1.0.2]: https://github.com/Luzkan/smells/releases/tag/1.0.2
[1.0.1]: https://github.com/Luzkan/smells/releases/tag/1.0.1
[1.0.0]: https://github.com/Luzkan/smells/releases/tag/1.0.0
