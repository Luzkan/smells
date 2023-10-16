---
slug: "tramp-data"
meta:
  last_update_date: 2022-04-19
  title: "Tramp Data"
  cover: "/logos/logo-text-2560x1280.png"
  known_as:
    - ---
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
    - name: Message Chain
      slug: message-chain
      type:
        - family
    - name: Long Parameter List
      slug: long-parameter-list
      type:
        - co-exist
    - name: Dubious Abstraction
      slug: dubious-abstraction
      type:
        - co-exist
    - name: Global Data
      slug: global-data
      type:
        - antagonistic
problems:
  general:
    - ---
  violation:
    principles:
      - Law of Demeter
    patterns:
      - ---
refactors:
  - Extract Method
  - Hide Delegate
  - Move Method
history:
  - author: "Steve Smith"
    type: "origin"
    named_as:
      - Tramp Data
    regarded_as:
      - Code Smell
    source:
      year: 2013
      authors:
        - Steve Smith
      name: "Refactoring Fundamentals"
      type: "course"
      href:
        direct_url: "https://www.pluralsight.com/courses/refactoring-fundamentals"
  - author: "Steve McConnell"
    type: "origin"
    named_as:
      - Tramp Data
    regarded_as:
      - Reason to Refactor
    source:
      year: 1993
      authors:
        - "Steve McConnell"
      name: "Code Complete"
      type: "book"
      href:
        isbn_13: "978-1556154843"
---

## Tramp Data

This is very similar to the [Message Chains](./message-chain.md) code smell, but with the difference that there, the pizza supplier was ordered to go through a long chain of method calls. Here, the pizzeria supplier additionally delivers _"pizza"_ through that long chain of method calls, with _"pizza"_ present in each of the method parameters. This is an indicator of [Dubious Abstraction](./dubious-abstraction.md) code smell - the data that pass through long chains of calls, most likely at least one of the levels, are not consistent with the abstraction presented by each of the routine interfaces. [[1](#sources)]

### Causation

This can happen due to a cheap way of [Global Data](./global-data.md) code smell refactorization.

### Problems

#### **Law of Demeter Principle Violation**

The functionality should be as close to the data it uses as possible. This doesn't seem to be the case when _Tramp Data_ is present.

### Examples

<div class="example-block">

#### Smelly

```py

class Game:
    timer: int
    match: Match

    def start_turn():
        match(timer).field(timer).players(timer).troops(timer)

```

</div>

### Refactoring:

- Extract Method
- Hide Delegate
- Move Method

### Exceptions

In the context of the system as a whole, some communication between modules must take place. All possibilities should be properly balanced so that none of the smells dominate ([Global Data](./global-data.md), [Tramp Data](./tramp-data.md), [Message Chain](./message-chain.md), [Middle Man](./middle-man.md)) to make the entire codebase as straightforward as possible.

---

##### Sources

- [[1](#sources)] - Steve McConnell, _"Code Complete"_ (2004)
- [Origin] - Steve Smith, _"Refactoring Fundamentals"_ (2013)
- [Parentage] - Steve McConnell, _"Code Complete"_ (1993)
