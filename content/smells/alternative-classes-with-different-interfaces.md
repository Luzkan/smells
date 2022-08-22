---
slug: "alternative-classes-with-different-interfaces"
meta:
  last_update_date: 2022-04-19
  title: "Alternative Classes with Different Interfaces"
  cover: "/logos/logo-text-2560x1280.png"
  known_as:
    - Duplicate Abstraction
categories:
  expanse: "Between"
  obstruction:
    - Object Oriented Abusers
  occurrence:
    - Duplication
  tags:
    - ---
  smell_hierarchies:
    - Code Smell
    - Design Smell
relations:
  related_smells:
    - name: Oddball Solution
      slug: oddball-solution
      type:
        - family
    - name: Duplicated Code
      slug: duplicate-code
      type:
        - co-exist
problems:
  general:
    - ---
  violation:
    principles:
      - Don't Repeat Yourself
    patterns:
      - ---
refactors:
  - Move Method
history:
  - author: "Martin Fowler"
    type: "origin"
    named_as:
      - Alternative Classes with Different Interfaces
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

## Alternative Classes with Different Interfaces

If two classes have the same functionality but different implementations, developers should merge them, or developers should extract a superclass to limit [Code Duplication](./duplicated-code.md). This smell occurs whenever a class can operate on two alternative classes (for example, take `Zombie` and `Snowman`). However, the interface to these alternative classes is different - when it operates with `Zombie`, it calls `hug_zombie()`, and with `Snowman`, it has to call `hug_snowman()`.

### Causation

This may happen due to the oversight that a functionally equivalent class already exists or when two or more developers are working on code to handle a similar situation. However, they did not know about the other's work — lack of abstract methods that enforce the common implementation method names.

### Problems

#### **Don't Repeat Yourself Violation**

_DRY Principle_ - as the name suggests - is aimed to reduce repetition of the same code implementations.

### Example

<div class="example-block">

#### Smelly:

Each individual of Humanoid have similar but personalised logic but under different method names

```py
class Snowman(Humanoid):
    def hug_snowman():
        ...

class Zombie(Humanoid):
    def hug_zombie():
        ...
```

#### Solution:

Use common method.

```py
class Snowman(Humanoid):
    def hug():
        ...

class Zombie(Humanoid):
    def hug():
        ...
```

</div>

### Refactoring:

- _Change Function Declaration_
- _Move Function_
- _Extract Superclass_

---

##### Sources

- [Origin] - Martin Fowler, _"Refactoring: Improving the Design of Existing Code"_ (1999)
