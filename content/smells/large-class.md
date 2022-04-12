---
slug: "large-class"
meta:
  last_update_date: 2022-02-24
  title: "Large Class"
  cover: "/logos/logo-text-2560x1280.png"
  known_as:
    - Blob
    - Brain Class
    - Complex Class
    - God Class
    - God Object
    - Schizophrenic Class
    - Ice Berg Class
categories:
  expanse: "Within"
  obstruction:
    - Bloaters
  occurrence:
    - Measured Smells
  tags:
    - Unknown
  smell_hierarchies:
    - Antipattern
    - Architecture Smell
    - Code Smell
    - Design Smell
relations:
  related_smells:
    - name: Dubious Abstraction
      slug: dubious-abstraction
      type:
        - co-exist
    - name: Long Method
      slug: long-method
      type:
        - caused
    - name: Long Parameter List
      slug: long-parameter-list
      type:
        - caused
    - name: Temporary Field
      slug: temporary-field
      type:
        - caused
problems:
  general:
    - Hard to Read
    - Comprehensibility
    - Hard to Test
  violation:
    principles:
      - ---
    patterns:
      - ---
refactors:
  - Extract Class
  - Extract Subclass
  - Extract Interface
  - Extract Domain Object
  - Replace Data Value with object
history:
  - author: "Martin Fowler"
    type: "origin"
    named_as:
      - Large Class
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

## Large Class

When one combines the smell of [Long Method](./long-method.md) and [Long Parameter List](./long-parameter-list.md) but on a higher abstraction level, then he would get the _Large Class_ code smell. The large number of long-form methods, along with an abundant number of parameters that can be passed to a class, causes Large Class problems. The point is that the class just has too many responsibilities and is doing too much.

### Causation

The reason this problem occurs is that, under time constraints, it is much easier to place a new code in an existing class than to create a whole new class for the feature.

### Problems

#### **Hard to Read and Understand**

Large components are hard to comprehend, and this amplifies if the component is not purely functional and stateless.

#### **Hard to Change**

It’s tough to assess where the change has to be made and even after if it’s done - developer has to verify whether that was the only in the class that had to be changed in order to implement his new desired functionality. There’s also the risk of breaking the functionalities of all the other responsibilities that the class has and breaking by making unexpected side effects.

#### **Hard to Test**

The larger the class, the more potential scenarios (all the methods, all the state variations) has to be covered via tests.

### Refactoring:

- Extract Class
- Extract Subclass
- Extract Interface
- Extract Domain Object
- Replace Data Value with Object

---

##### Sources

- [Origin] - Martin Fowler, _"Refactoring: Improving the Design of Existing Code"_ (1999)
