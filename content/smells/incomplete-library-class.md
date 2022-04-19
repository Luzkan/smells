---
slug: "incomplete-library-class"
meta:
  last_update_date: 2022-04-19
  title: "Incomplete Library Class"
  cover: "/logos/logo-text-2560x1280.png"
  known_as:
    - ---
categories:
  expanse: "Between"
  obstruction:
    - Other
  occurrence:
    - Interfaces
  tags:
    - ---
  smell_hierarchies:
    - Code Smell
relations:
  related_smells:
    - name: Duplicated Code
      slug: duplicated-code
      type:
        - causes
    - name: Clever Code
      slug: clever-code
      type:
        - causes
problems:
  general:
    - Duplication
  violation:
    principles:
      - ---
    patterns:
      - ---
refactors:
  - Introduce Foreign Method
  - Introduce Local Extension
history:
  - author: "Martin Fowler"
    type: "origin"
    named_as:
      - Incomplete Library Class
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

## Incomplete Library Class

Libraries are the savior of time and money in the industry of software development. If we had to reimplement our algorithms and tools every time we want to use them, then the world around us would not look the same as the world we can now see through the windows. Sometimes, however, a specific package is almost perfect for our needs but lacks some of the functionalities we want. We can, of course, ask the authors whether they plan or add what is missing, or we will try to implement what is missing if the community of a given repository allows it. Unfortunately, sometimes it is impossible, and such situations should also be dealt with by building an additional layer or introducing a foreign method. In the worst case, i.e., reimplementation, we doom the code to [Duplication](./duplicated-code.md).

### Causation

Often open-licensed library makers do this pro bono, so they cannot spend all of their time creating the perfect package for everyone to use.

### Problems

#### **Duplication**

If it's not possible to reuse code that has been already written, then reimplementing it from scratch is massive duplication of work.

### Refactoring

- Introduce Foreign Method
- Introduce Local Extension

---

##### Sources

- [Origin] - Marin Fowler, _"Refactoring: Improving the Design of Existing Code (3rd Edition)"_ (1999)
