---
slug: "duplicated-code"
meta:
  last_update_date: 2022-02-21
  title: "Duplicated Code"
  cover: "/logos/logo-text-2560x1280.png"
  known_as:
    - Clones
    - Code Clone
    - Duplicate Code
    - Common Methods in Sibling Class
    - External Duplication
categories:
  expanse: "Within"
  obstruction:
    - Dispensables
  occurrence:
    - Duplication
  tags:
    - ---
  smell_hierarchies:
    - Code Smell
    - Design Smell
    - Implementation Smell
relations:
  related_smells:
    - name: Alternative Classes With Different Interfaces
      slug: alternative-classes-with-different-interfaces
      type:
        - co-exist
    - name: Oddball Solution
      slug: oddball-solution
      type:
        - co-exist
    - name: Incomplete Library Class
      slug: incomplete-library-class
      type:
        - caused
    - name: Magic Number
      slug: magic-number
      type:
        - caused
    - name: Required Setup/Teardown Code
      slug: required-setup-or-teardown-code
      type:
        - caused
    - name: Type Embedded In Name
      slug: type-embedded-in-name
      type:
        - caused
problems:
  general:
    - ---
    - ---
  violation:
    principles:
      - ---
    patterns:
      - ---
refactors:
  - Extract Class
  - Extract Function
  - Pull Up Method
  - Slide Statement
  - Form Template Method
history:
  - author: "Martin Fowler"
    type: "origin"
    named_as:
      - Duplicated Code
    regarded_as:
      - Code Smell
    source:
      year: 1999
      authors:
        - Martin Fowler
        - Kent Beck (contributor)
        - Don Roberts (contributor)
      name: "Refactoring: Improving the Design of Existing Code"
      type: "book"
      href:
        isbn_13: "978-0201485677"
        isbn_10: "0201485672"
---

## Duplicated Code

Duplicate Code needs no further explanation. According to Fowler, redundant code is one of the worst smells [[1](#sources)]. One thing is that this make it more difficult to read the program. Checking whether the copies are identical is yet another issue - looking whether they are for sure without any tiny difference ([Oddball Solution](./oddball-solution.md)). Yet another thing is that whenever a change is made, one need to check if this should have happen to just one or to all of the existing copies of code, wherever they are.

### Refactoring:

- Extract Class
- Extract Function
- Pull Up Method
- Slide Statement
- Form Template Method

---

##### Sources

- [[1](#sources)], [Origin] - Martin Fowler, _"Refactoring: Improving the Design of Existing Code"_ (1999)
