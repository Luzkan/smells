---
slug: "refused-bequest"
meta:
  last_update_date: 2022-04-19
  title: "Refused Bequest"
  cover: "/logos/logo-text-2560x1280.png"
  known_as:
    - Refused Parent Bequest
categories:
  expanse: "Between"
  obstruction:
    - Object Oriented Abusers
  occurrence:
    - Interfaces
  tags:
    - ---
  smell_hierarchies:
    - Code Smell
    - Design Smell
relations:
  related_smells:
    - name: Dubious Abstraction
      slug: dubious-abstraction
      type:
        - co-exist
problems:
  general:
    - Hard to Test
  violation:
    principles:
      - Liskov Substitution
    patterns:
      - ---
refactors:
  - Extract Subclass
  - Push Down Field
  - Push Down Method
  - Replace Inheritance with Delegation
  - Replace Superclass/Subclass with Delegate
history:
  - author: "Martin Fowler"
    type: "origin"
    named_as:
      - Refused Bequest
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

## Refused Bequest

Whenever a subclass inherits from a parent but only uses a subset of the implemented parent methods, that is called _Refused Bequest_. This behavior can happen both implicitly and explicitly:

- Implicitly, when the inherited routine doesn not work
- Explicitly, if an error is thrown instead of supporting the method

Whenever a child class is created, it should fully support all the data and methods that it inherits [[1](#sources)]. Fowler says that this smell is not that strong, though, and admits that he sometimes reuses only a bit of behavior, but it can cause confusion and problems [[2](#sources)].

However, there is one crucial thing. Both Fowler and Mäntylä are pointing out a strong case of this Code Smell whenever a subclass is reusing behavior but does not want to support the superclass interface [[3](#sources)] [[1](#sources)] [[4](#sources)].

### Causation

This could happen due to bad development decisions when part of the needed functionality is already implemented in another class, but in general, the parent class is about something different from whatever the developer would like to implement in the new class. This inconsistency most likely indicates that the inheritance does not make sense, and the subclass is not an example of its parent. [[5](#sources)]

### Problems

#### **Liskov Substitution Principle Violation**

The _Liskov Substitution Principle_ describes that the relationship of subtypes and supertypes should ensure that any property proved about supertype object also holds for its subtype object.

#### **Hard to Test**

Each subclass might have different capabilities up and down the class hierarchies.

### Example

<div class="example-block">

#### Smelly

```py
class Minion(ABC):
    @abstractmethod
    def attack(self):
        """ """

    @abstractmethod
    def move(self):
        """ """

class Tower(Minion):
    def attack(self):
        ...

    def move(self):
        raise NotImplementedException
```

</div>

### Refactoring:

- Extract Subclass
- Push Down Field
- Push Down Method
- Replace Inheritance with Delegation
- Replace Superclass/Subclass with Delegate

---

##### Sources

- [[1](#sources)] - Mika Mäntylä, _"Bad Smells in Software - a Taxonomy and an Empirical Study"_ (2003)
- [[2](#sources)], [Origin] - Martin Fowler, _"Refactoring: Improving the Design of Existing Code (3rd Edition)"_ (1999)
- [[3](#sources)] - Martin Fowler, _"Refactoring: Improving the Design of Existing Code (3rd Edition)"_ (2018)
- [[4](#sources)] - MS Haque, J Carver, T Atkison, _"Causes, impacts, and detection approaches of code smell: A survey"_ (2018)
- [[5](#sources)] - William C. Wake, _"Refactoring Workbook"_ (2004)
