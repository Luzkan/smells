---
slug: "dubious-abstraction"
meta:
  last_update_date: 2022-04-19
  title: "Dubious Abstraction"
  cover: "/logos/logo-text-2560x1280.png"
  known_as:
    - Inconsistent Abstraction Levels
    - Functions Should Descend Only One Level of Abstraction
    - Code at Wrong Level of Abstraction
    - Choose Names at the Appropriate Level of Abstraction
categories:
  expanse: "Within"
  obstruction:
    - Change Preventers
  occurrence:
    - Responsibility
  tags:
    - ---
  smell_hierarchies:
    - Code Smell
    - Design Smell
relations:
  related_smells:
    - name: Speculative Generality
      slug: speculative-generality
      type:
        - family
    - name: Long Method
      slug: long-method
      type:
        - co-exist
    - name: Large Class
      slug: large-class
      type:
        - co-exist
    - name: Refused Bequest
      slug: refused-bequest
      type:
        - co-exist
    - name: Oddball Solution
      slug: oddball-solution
      type:
        - causes
    - name: Required Setup/Teardown Code
      slug: required-setup-or-teardown-code
      type:
        - causes
    - name: Side Effects
      slug: side-effects
      type:
        - caused
    - name: Speculative Generality
      slug: speculative-generality
      type:
        - antagonistic
problems:
  general:
    - Extendibility
    - Comprehensibility
  violation:
    principles:
      - Single Responsibility
    patterns:
      - ---
refactors:
  - Extract Superclass
  - Extract Subclass
  - Extract Class
history:
  - author: "Marcel Jerzyk"
    type: "origin"
    named_as:
      - Dubious Abstraction
    regarded_as:
      - Code Smell
    source:
      year: 2022
      authors:
        - Marcel Jerzyk
      name: "Code Smells: A Comprehensive Online Catalog and Taxonomy"
      type: "thesis"
      href:
        direct_url: "Marcel Jerzyk Source TBA"
  - author: "Steve Smith"
    type: "parentage"
    named_as:
      - Inconsistent Abstraction Levels
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
  - author: "Robert C. Martin"
    type: "parentage"
    named_as:
      - Obscured Intent
    regarded_as:
      - Code Smell
    source:
      year: 2008
      authors:
        - Robert C. Martin
      name: "Clean Code: A Handbook of Agile Software Craftsmanship"
      type: "book"
      href:
        isbn_13: "978-0132350884"
        isbn_10: "9780132350884"
---

## Dubious Abstraction

The smaller and more cohesive class interfaces are the better because they tend to degrade over time. They should provide a constant abstraction level. Function interfaces should be one level of abstraction below the operation defined in their name. Robert Martin describes the above sentences as three separate code smells: _Functions Should Descend Only One Level of Abstraction_, _Code at Wrong Level of Abstraction_, _Choose Names at the Appropriate Level of Abstraction_ [[1](#sources)]. He observed that people are having trouble with it and often mix abstraction levels. Steve Smith, in his course, uses the term "Inconsistent Abstraction Levels".

I like the smells in the granularized form presented by Martin as they address the issue directly and specifically. The name _Inconsistent Abstraction Levels_ still holds the idea, but it might be misinterpreted by just recalling the meaning through its title. I suspect that it might create a situation where somewhere out there, in at least one codebase, someone might win an argument with a non-inquisitive individual, thus leaving the abstraction levels consistent... but consistently off. I wish no one ever heard, "that is how it always has been, so it must continue to be done that way".

This frequent wrong selection of abstractions is why I decided to rename it to _Dubious Abstraction_ directly addressing the potential causation of the smell - to think about the code that one just wrote. Fowler says that "there is no way out of a misplaced abstraction, and it is one of the hardest things that software developers can do, and there is no quick fix when you get it wrong". _Dubious Abstraction_ is supposed to provoke the question as soon as possible - _"Is it dubious?"_, taking a second to think about the code at hand and then move on or immediately refactor if something seems fishy: Is the `Instrument` really querying this message? Or is it the _connection device_ doing it? Maybe I should extract it? Is `percentFull` a method of `Stack` for sure?

### Causation

It is difficult to grasp whether the abstraction or naming the developer gives to various entities is proper for psychological reasons, like Tunnel Vision. A correct solution requires stepping out of the box to think whether the abstraction is accurate, and that requires continuous and conscious mental action to be undertaken.

### Problems

#### **Extendibility**

Code written "too literally" is closed on extendibility. Disregarding any abstractions on the implementation ideas makes it hard to introduce new features.

#### **Comprehensibility**

Creating context without specifying ungeneralised concepts might be hard to follow. Varying abstraction levels make it challenging to develop a mental map of the code workflow.

#### **Single Responsibility Principle Violation**

Methods with more than one layer of abstraction are most likely doing more than one thing.

### Example

<div class="example-block">

#### Smelly

```py
from abc import ABC  # Abstract Base Class

class Instrument(ABC):
    adapter: ConnectionAdapter

    def reset(self):
        self.write("*RST")

    def write(self, command):
        ...
```

#### Solution

```py
from abc import ABC

class Instrument(ABC):
    adapter: ConnectionAdapter

    def reset(self):
        self.adapter.write("*RST")
```

</div>

#### Refactoring:

- Extract Superclass, Subclass, or new Class

---

##### Sources

- [[1](#sources)] - Robert Martin, _"Clean Code: A Handbook of Agile Software Craftsmanship"_ (2008)
- [Origin] - Marcel Jerzyk, _"Code Smells: A Comprehensive Online Catalog and Taxonomy"_ (2022)
- [Parentage2] - Steve Smith, _"Refactoring Fundamentals"_ (2013)
- [Parentage1] - Martin Fowler, _"Refactoring: Improving the Design of Existing Code"_ (1999)
