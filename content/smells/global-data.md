---
slug: "global-data"
meta:
  last_update_date: 2022-02-23
  title: "Global Data"
  cover: "/logos/logo-text-2560x1280.png"
  known_as:
    - Global Variables
categories:
  expanse: "Between"
  obstruction:
    - Data Dealers
  occurrence:
    - Data
  tags:
    - ---
  smell_hierarchies:
    - Code Smell
    - Design Smell
relations:
  related_smells:
    - name: Middle Man
      slug: middle-man
      type:
        - family
    - name: Hidden Dependencies
      slug: hidden-dependencies
      type:
        - causes
    - name: Inappropriate Static
      slug: inappropriate-static
      type:
        - co-exist
    - name: Tramp Data
      slug: tramp-data
      type:
        - antagonistic
    - name: Long Parameter List
      slug: long-parameter-list
      type:
        - antagonistic
    - name: Message Chain
      slug: message-chain
      type:
        - antagonistic
problems:
  general:
    - Hard to Test
    - Hard to Reason About
    - Coupling
  violation:
    principles:
      - Encapsulation
    patterns:
      - ---
refactors:
  - Encapsulate Variable
history:
  - author: "Martin Fowler"
    type: "origin"
    named_as:
      - Global Data
    regarded_as:
      - Code Smell
    source:
      year: 2018
      authors:
        - Martin Fowler
      name: "Refactoring: Improving the Design of Existing Code"
      type: "book"
      href:
        isbn_13: "978-0201485677"
        isbn_10: "0201485672"
---

## Global Data

The _Global Data_ is quite similar to the [Middle Man](./middle-man.md) code smell, but here rather than a class, the broker is the _global scope_ in which the data is freely available for everyone. This is undesirable because it directly causes the [Hidden Dependencies](./hidden-dependencies.md) code smell and an extremely nasty [Mutable Data](./mutable-data.md) code smell. Global Data can be read from anywhere and there is no easy way to discover what bit of code touches it. If the variable in in the global scope is additionally mutable then this becomes an extremally bad case of _[Mutable](./mutable-data.md) [Fate over Action](./fate-over-action.md) (data class)_. Fowler in 1999 recalled that in early days of programming, back when there was no objects, even causing the [Long Parameter List](./long-paramter-list.md) code smell was a preferable to the Global Data [[35](#sources)]. For very same reasons, a Singleton Pattern can also be problematic [[17](#sources)].

### Problems

#### **Hard to Test**

Each Global Variable is basically a hidden dependency that a tester has to mock.

#### **Hard to Reason About**

Global Variables exponentially fuzz the clarity of the codebase.

#### **Inter Component Coupling**

#### **Encapsulation Violation**

### Refactoring:

- Encapsulate Variable

### Exceptions

In the context of the system as a whole, some communication between modules must take place. All possibilities should be properly balanced so that none of the smells dominate ([Global Data](./global-data.md), [Tramp Data](./tramp-data.md), [Message Chain](./message-chain.md), [Middle Man](./middle-man.md)) with the focus to make the whole codebase as clear as possible.

---

##### Sources

- [[17](#sources)] - Marin Fowler, "Refactoring: Improving the Design of Existing Code (3rd Edition)" (2018)
- [[35](#sources)] -
