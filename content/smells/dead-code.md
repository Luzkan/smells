---
slug: "dead-code"
meta:
  last_update_date: 2022-02-21
  title: "Dead Code"
  cover: "/logos/logo-text-2560x1280.png"
  known_as:
    - ---
categories:
  expanse: "Between"
  obstruction:
    - Dispensables
  occurrence:
    - Unnecessary Complexity
  tags:
    - ---
  smell_hierarchies:
    - Code Smell
relations:
  related_smells:
    - name: Speculative Generality
      slug: speculative-generality
      type:
        - caused
problems:
  general:
    - Hidden Abstraction
    - More Complex API
  violation:
    principles:
      - You Ain't Gonna Need It
    patterns:
      - ---
refactors:
  - Remove It
history:
  - author: "William C. Wake"
    type: "origin"
    named_as:
      - Dead Code
    regarded_as:
      - Code Smell
    source:
      year: 2004
      authors:
        - William C. Wake
      name: "Refactoring Workbook"
      type: "book"
      href:
        isbn_13: "978-0321109293"
        isbn_10: "0321109295"
---

## Dead Code

If a part of code is not executed then it is Dead Code. This includes any place that the code executor will never reach - including the code which was commented out. Any if or case condition that can never be reached, any code in methods and functions after final `return` statement or any code inside of a `try` `except`/`catch` block which will never throw an error. [[1](#sources)] This usually is not that easy to detect and requires tool assistance. [[2](#sources)]

### Causation

Never refactored [long else-if blocks](./conditional-complexity.md) that eventually has so many paths that no one even remembers if they are accessed anymore. Maybe a new way of working was introduced and old code was never tidied up.

### Problems

#### **You Ain't Gonna Need It Principle Violation**

Old code that was not deleted but commented out _"just in-case"_ is just bloating the codebase.

### Refactoring:

- Remove It

---

##### Sources

- [[1](#sources)] - Robert Martin, _"Clean Code: A Handbook of Agile Software Craftsmanship"_ (2008)
- [[2](#sources)], [Origin] - William C. Wake, _"Refactoring Workbook"_ (2004)
