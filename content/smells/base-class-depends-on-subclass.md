---
slug: "base-class-depends-on-subclass"
meta:
  last_update_date: 2022-02-17
  title: "Base Class depends on Subclass"
  cover: "/logos/logo-text-2560x1280.png"
  known_as:
    - Base Classes Depending on Their Derivatives
categories:
  expanse: "Between"
  obstruction:
    - Object Oriented Abusers
  occurrence:
    - Interfaces
  tags:
    - ---
  smell_hierarchies:
    - Antipattern
    - Code Smell
    - Design Smell
relations:
  related_smells:
    - name: Shotgun Surgery
      slug: shotgun-surgery
      type:
        - causes
problems:
  general:
    - ---
  violation:
    principles:
      - Liskov Substitution
    patterns:
      - ---
refactors:
  - ---
history:
  - author: "Robert C. Martin"
    type: "origin"
    named_as:
      - Base Classes Depending on Their Derivatives
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

## Base Class depends on Subclass

The rule is that the child classes should be deployable independently from the parent class. That allows to deploy the system in discrete and independent components.

When one of these subclasses is modified, the base class does not need to be redeployed as well. This way the impact of change is much smaller and so is proportionally the maintenance effort [[1](#sources)]. This smell is closely linked with the [Shotgun Surgery](./shotgun-surgery.md) code smell.

### Problems

#### **Liskov Substitution Principle Violation**

Base class and Subclass should be interchangeable without breaking the logic of the program.

---

##### Sources

- [[1](#sources)], [Origin] - Robert Martin, "Clean Code: A Handbook of Agile Software Craftsmanship" (2008)
