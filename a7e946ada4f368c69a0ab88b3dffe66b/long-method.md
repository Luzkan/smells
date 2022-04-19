---
slug: "long-method"
meta:
  last_update_date: 2022-04-19
  title: "Long Method"
  cover: "/logos/logo-text-2560x1280.png"
  known_as:
    - Complex Method
    - God Method
    - Brain Method
categories:
  expanse: "Within"
  obstruction:
    - Bloaters
  occurrence:
    - Measured Smells
  tags:
    - ---
  smell_hierarchies:
    - Antipattern
    - Code Smell
    - Design Smell
    - Implementation Smell
relations:
  related_smells:
    - name: Large Class
      slug: large-class
      type:
        - causes
    - name: Side Effects
      slug: side-effects
      type:
        - causes
    - name: Dubious Abstraction
      slug: dubious-abstraction
      type:
        - co-exist
    - name: Side Effects
      slug: side-effects
      type:
        - co-exist
    - name: Long Parameter List
      slug: long-parameter-list
      type:
        - co-exist
    - name: Flag Arguments
      slug: flag-argument
      type:
        - caused
problems:
  general:
    - Hard to Read
    - Hard to Reason About
    - Low Reuse
  violation:
    principles:
      - ---
    patterns:
      - ---
refactors:
  - Extract Method
  - Replace Conditional with Polymorphism
  - Replace Method with Command
  - Introduce Parameter Object
  - Preserve the Whole Object
  - Split Loop
history:
  - author: "Martin Fowler"
    type: "origin"
    named_as:
      - Long Method
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

## Long Method

One of the most apparent complications developers can encounter in the code is the length of a method. The more lines of code a function has, the more the developer has to strain himself mentally to comprehend what the particular block of code does thoroughly. The longer a procedure is, the more difficult it is to understand it [[1](#sources)]. It is also harder to change or extend [[2](#sources)]. In addition, reading more lines requires more time, which quickly adds up because the code is read more than it is written [[3](#sources)]. Fowler strongly believes in short methods as a better option.

### Causation

The author adds another code line rather than breaking the flow to identify the helper objects [[4](#sources)].

### Problems

#### **Hard to Read and Reason About**

- Every time a developer wants to make any change to any part of it, he has to grasp the whole thing every time, which is time-consuming.

#### **Low Reuse**

- Longer methods most likely have more functionalities, so developers cannot reuse them as easily as methods that are short and specific

#### **[Side Effects](./side-effects.md)**

- If a method is long, it is not very likely that it does only what the name of the method could indicate.

### Refactoring:

- Extract Method
- Replace Conditional with Polymorphism
- Replace Method with Command
- Introduce Parameter Object
- Preserve the Whole Object
- Split Loop

---

##### Sources

- [[1](#sources)], [Origin] - Martin Fowler, "Refactoring: Improving the Design of Existing Code" (1999)
- [[2](#sources)] - Mika Mäntylä, _"Bad Smells in Software - a Taxonomy and an Empirical Study"_ (2003)
- [[3](#sources)] - Robert Martin, "Clean Code: Handbook of Agile Software Craftsmanship" (2008)
- [[4](#sources)] - William C. Wake, _"Refactoring Workbook"_ (2004)
