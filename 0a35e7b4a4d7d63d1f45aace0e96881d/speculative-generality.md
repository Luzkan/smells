---
slug: "speculative-generality"
meta:
  last_update_date: 2022-04-19
  title: "Speculative Generality"
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
    - Antipattern
    - Code Smell
    - Design Smell
relations:
  related_smells:
    - name: Dubious Abstraction
      slug: dubious-abstraction
      type:
        - antagonistic
    - name: Lazy Element
      slug: lazy-element
      type:
        - causes
    - name: Dead Code
      slug: dead-code
      type:
        - causes
problems:
  general:
    - Increased Complexity
  violation:
    principles:
      - You Ain't Gonna Need It
    patterns:
      - ---
refactors:
  - Collapse Hierarchy
  - Inline Function
  - Inline Class
  - Rename Method
history:
  - author: "Martin Fowler"
    type: "origin"
    named_as:
      - Speculative Generality
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

## Speculative Generality

Developers are humans, and humans are bad guessers [[1](#sources)]. Developers tend to create additional features in preparation for the future, guessing they will be useful, but that time never came. This problem lies within the human psychological nature and, contrary to their best intentions, it just clutters the code.

### Causation

Psychologically, humans tend to anticipate scenarios and prepare for them.

### Problems

#### **You Ain't Gonna Need It Principle Violation**

The whole system is trying or expecting to do more than it is supposed to.

#### **Increased Complexity**

Each additional method, class, or module increases the required time and effort to understand it as a whole.

### Examples

<div class="example-block">

#### Smelly

Context: _Medieval Fighting Game_

```py
class Animal:
    health: int

class Human(Animal):
    name: str
    attack: int
    defense: int

class Swordsman(Human):
    ...

class Archer(Human):
    ...

class Pikeman(Human):
    ...

```

#### Solution

```py
class Human:
    name: str
    health: int
    attack: int
    defense: int

class Swordsman(Human):
    ...

class Archer(Human):
    ...

class Pikeman(Human):
    ...
```

</div>

### Refactoring:

- Collapse Hierarchy
- Inline Function
- Inline Class
- Rename Method

---

##### Sources

- [[1](#sources)] - Leah T. Braun, _"Guessing right – whether and how medical students give incorrect reasons for their correct diagnoses"_ (2019)
- [Origin] - Martin Fowler, _"Refactoring: Improving the Design of Existing Code"_ (1999)
