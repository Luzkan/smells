---
slug: "data-clump"
meta:
  last_update_date: 2022-02-16
  title: "Data Clump"
  cover: "/logos/logo-text-2560x1280.png"
  known_as:
    - ---
categories:
  expanse: "Between"
  obstruction:
    - Bloaters
  occurrence:
    - Data
  tags:
    - ---
  smell_hierarchies:
    - Code Smell
    - Design Smell
relations:
  related_smells:
    - name: Mutable Data Class
      slug: mutable-data-class
      type:
        - antagonistic
problems:
  general:
    - Hidden Abstraction
    - More Complex API
  violation:
    principles:
      - ---
    patterns:
      - ---
refactors:
  - Extract Class
  - Introduce Parameter Object
history:
  - author: "Martin Fowler"
    type: "origin"
    named_as:
      - Data Clump
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

## Data Clump

Data Clumps refer to a situation when a few variables are passed around together many times around the codebase instead of being packed into a separate object. Think of it as having to hold different groceries in a shopping mall by hand, instead of putting them into a basket or at least a handy cardboard box — this is just not convenient. Any set of data items that are always or almost always used together, but are not organized together, should be packed into a class. An example could be `RGB` values held separately instead of in a `RGB` object.

### Causation

People just tend to think that keeping things are too small or unimportant to create a separate class for them. [[1](#sources)]

### Problems

#### **Hidden Abstraction**

Variables grouped into object of its own increases the readability of the code, thus making the concept more clear.

#### **More Complex API’s**

Components Interfaces complexity increases with the number of accepted data

---

### Example

<div class="example-block">

#### Smelly

```py
def colorize(red: int, green: int, blue: int):
    ...
```

#### Solution

```py
@dataclass(frozen=True)
class RGB:
    red: int
    green: int
    blue: int


def colorize(rgb: RGB):
    ...
```

</div>

### Refactoring:

- Extract Class (and additionally maybe there is possibility for Move Method)
- Introduce Parameter Object

##### Sources

- [[1](#sources)] - William C. Wake, _"Refactoring Workbook"_ (2004)
- [Origin] - Martin Fowler, _"Refactoring: Improving the Design of Existing Code"_ (1999)
