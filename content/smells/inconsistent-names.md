---
slug: "inconsistent-names"
meta:
  last_update_date: 2022-02-24
  title: "Inconsistent Names"
  cover: "/logos/logo-text-2560x1280.png"
  known_as:
    - Use Standard Nomenclature Where Possible
categories:
  expanse: "Within"
  obstruction:
    - Lexical Abusers
  occurrence:
    - Names
  tags:
    - ---
  smell_hierarchies:
    - Code Smell
relations:
  related_smells:
    - name: Inconsistent Style
      slug: inconsistent-style
      type:
        - family
problems:
  general:
    - Comprehensibility
    - Flow State Disruption
  violation:
    principles:
      - ---
    patterns:
      - ---
refactors:
  - Rename Method
history:
  - author: "William C. Wake"
    type: "origin"
    named_as:
      - Inconsistent Names
    regarded_as:
      - Code Smell (Names)
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

## Inconsistent Names

Human brains work in a pattern-like fashion. Starting from the first class, the concept of operation and use of each subsequent class should be generalized throughout the project, facilitating and iteratively accelerating the speed of understanding how the code works.

For this reason, once we know that one class uses the method, `store()` it should be expected that another class for the very same mechanic also uses the `store()` name for that, instead of `add()`, `put()` or `place()`.

### Causation

In a team project, members could have omitted checking the existing naming in other classes, or even did that intentionally to distinguish the names [[1](#sources)].

### Problems

#### **Comprehensibility**

Standardized communication through names is very important for mental shortcuts.

#### **Flow State Disruption**

Developer expects a method inside of a sibling class, but can't find it and has to look up synonymous variation of the method he wants.

### Example

<div class="example-block">

#### Smelly

```py
class Human:
    def talk():
        ...

class Elf:
    def chat():
        ...
```

#### Solution

```py
class Character(ABC):
    @abstractmethod
    def talk():
        """ Converse """

class Human(Character):
    def talk():
        ...

class Elf(Character):
    def talk():
        ...
```

</div>

### Refactoring

- Rename Method

---

##### Sources

- [[1](#sources)], [Origin] - William C. Wake, _"Refactoring Workbook"_ (2004)
