---
slug: "lazy-element"
meta:
  last_update_date: 2022-04-19
  title: "Lazy Element"
  cover: "/logos/logo-text-2560x1280.png"
  known_as:
    - Lazy Class
categories:
  expanse: "Between"
  obstruction:
    - Dispensables
  occurrence:
    - Unnecessary Complexity
  tags:
    - ---
  smell_hierarchies:
    - Antipattern
    - Code Smell
    - Design Smell
relations:
  related_smells:
    - name: Dubious Abstraction
      slug: dubious-abstraction
      type:
        - family
    - name: Speculative Generality
      slug: speculative-generality
      type:
        - caused
    - name: Primitive Obsession
      slug: primitive-obsession
      type:
        - antagonistic
problems:
  general:
    - Increased Complexity
  violation:
    principles:
      - ---
    patterns:
      - ---
refactors:
  - Inline Class
  - Inline Function
  - Collapse Hierarchy
history:
  - author: "Martin Fowler"
    type: "update"
    named_as:
      - Lazy Element
    regarded_as:
      - Code Smell
    source:
      year: 2018
      authors:
        - Martin Fowler
      name: "Refactoring: Improving the Design of Existing Code (3rd Edition)"
      named_as: "Lazy Element"
      type: "book"
      href:
        isbn_13: "978-0134757681"
  - author: "Martin Fowler"
    type: "origin"
    named_as:
      - Lazy Class
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

## Lazy Element

A Lazy Element is an element that does not do enough. If a method, variable, or class does not do enough to pay for itself (for increased complexity of the project), it should be combined into another entity.

### Causation

This smell can happen due to the aggressive refactorization process in which the functionality of a class was truncated. It can also occur due to the unnecessary pre-planning - [Speculative Generality](./speculative-generality.md) - developer made it in anticipation of a future need that never eventuates.

### Problems

#### **Increased Complexity**

Projects complexity increases with the number of entities.

### Example

<div class="example-block">

#### Smelly

```py
class Strength:
    value: int

class Person:
    health: int
    intelligence: int
    strength: Strength
```

#### Solution

```py
class Person:
    health: int
    intelligence: int
    strength: int
```

</div>

### Refactoring:

- Inline Class
- Inline Function
- Collapse Hierarchy

---

##### Sources

- [Origin] - Martin Fowler, _"Refactoring: Improving the Design of Existing Code"_ (1999)
