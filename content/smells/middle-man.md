---
slug: "middle-man"
meta:
  last_update_date: 2022-04-19
  title: "Middle Man"
  cover: "/logos/logo-text-2560x1280.png"
  known_as:
    - ---
categories:
  expanse: "Between"
  obstruction:
    - Data Dealers
  occurrence:
    - Message Calls
  tags:
    - ---
  smell_hierarchies:
    - Code Smell
    - Design Smell
relations:
  related_smells:
    - name: Global Data
      slug: global-data
      type:
        - family
    - name: Message Chain
      slug: message-chain
      type:
        - antagonistic
    - name: Tramp Data
      slug: tramp-data
      type:
        - antagonistic
problems:
  general:
    - Readability
    - Unnecessary Indirection
  violation:
    principles:
      - ---
    patterns:
      - ---
refactors:
  - Remove Middle Man
  - Inline Method
  - Replace Delegation with Inheritance
  - Replace Superclass with Delegate
history:
  - author: "Martin Fowler"
    type: "origin"
    named_as:
      - Middle Man
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

## Middle Man

The class that only performs delegation work to other classes is called a _Middle Man_. This is the opposite of the [Message Chains](./message-chain.md). Encapsulation (hiding internal details) in the world of Object-Oriented Programming is a typical pattern [[1](#sources)]. However, the problem arises when it goes too far - Fowler specified that it could be said that it's terrible when half of the methods are delegators [[2](#sources)]. Mäntylä wrote that this is a problem when every time a new method has to be created, it requires the delegators to be modified with them [[1](#sources)].

### Causation

This can happen due to over-zealous refactorization of Message Chains.

### Problems

#### **Readability**

Without proper, meaningful, unambiguous naming for the delegation method, the developer might need to check what is precisely being called to be sure.

#### **Unnecessary Indirection**

Holding references instead of actual values might slightly increase project complexity in volume.

### Examples

<div class="example-block">

Note: Yes, what is smelly from _Middle Man_'s perspective might be a solution to [Message Chain](./message-chain.md).

#### Smelly

```py
class Minion:
    _location: Location

    def action(self):
        ...
        if self.is_frontline():
            ...

    def is_frontline(self)
        return self._location.is_frontline()


class Location:
    _field: Field

    def is_frontline(self)
        return self._field.is_frontline()


class Field:
    def is_frontline(self)
        ...
```

#### Solution

```py
class Minion:
    _location: Location

    def action(self):
        ...
        if self._location.field.is_frontline():
            ...

class Location:
    field: Field

class Field:
    def is_frontline(self)
        ...
```

</div>

### Exceptions

In the context of the system as a whole, some communication between modules must take place. All possibilities should be properly balanced so that none of the smells dominate ([Global Data](./global-data.md), [Tramp Data](./tramp-data.md), [Message Chain](./message-chain.md), [Middle Man](./middle-man.md)) to make the entire codebase as straightforward as possible.

### Refactoring:

- Remove Middle Man _(note: this might create [Message Chain](./message-chain.md))_
- Inline Method
- Replace Delegation with Inheritance
- Replace Superclass with Delegate

---

##### Sources

- [[1](#sources)] - Mika Mäntylä, _"Bad Smells in Software - a Taxonomy and an Empirical Study"_ (2003)
- [[2](#sources)] - Marin Fowler, "Refactoring: Improving the Design of Existing Code (3rd Edition)" (2018)
- [Origin] - Martin Fowler, _"Refactoring: Improving the Design of Existing Code"_ (1999)
