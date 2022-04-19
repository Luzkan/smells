---
slug: "insider-trading"
meta:
  last_update_date: 2022-04-19
  title: "Insider Trading"
  cover: "/logos/logo-text-2560x1280.png"
  known_as:
    - Inappropriate Intimacy
categories:
  expanse: "Between"
  obstruction:
    - Data Dealers
  occurrence:
    - Responsibility
  tags:
    - ---
  smell_hierarchies:
    - Code Smell
    - Design Smell
relations:
  related_smells:
    - name: Fate over Action
      slug: fate-over-action
      type:
        - caused
    - name: Feature Envy
      slug: feature-envy
      type:
        - co-exist
problems:
  general:
    - Coupling
    - Reusability
    - Hard to Test
  violation:
    principles:
      - ---
    patterns:
      - ---
refactors:
  - Move Method
  - Move Field
  - Encapsulate Field
  - Replace Inheritance with Delegation
  - Change Bidirectional Association to Unidirectional
history:
  - author: "Martin Fowler"
    type: "update"
    named_as:
      - Insider Trading
    regarded_as:
      - Code Smell
    source:
      year: 2018
      authors:
        - Martin Fowler
      name: "Refactoring: Improving the Design of Existing Code (3rd Edition)"
      named_as: "Inappropriate Intimacy"
      type: "book"
      href:
        isbn_13: "978-0134757681"
  - author: "Martin Fowler"
    type: "origin"
    named_as:
      - Inappropriate Intimacy
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

## Insider Trading

The classes should know as little as possible about each other. As Fowler put it, "classes spend too much time delving in each other's private parts" [[1](#sources)]. This code smell was listed in 1999 as _Inappropriate Intimacy_ and is no longer listed in the 2018 version of the book under the same name. It was replaced by the term [Insider Trading](./insider-trading.md) code smell, possibly to make the change - that now the `classes` were generalized to modules - more noticeable (similarly to the wording change in [Feature Envy](./feature-envy.md)).

The concept stays the same - instead of reaching for each other's secrets, modules/classes interchange too much information and implementation details. In other words, this occurs whenever a module/class has too much knowledge about the inner workings or data of another module/class.

### Causation

At first, two classes could intertwine, but over time, they have coupled. [[2](#sources)]

### Problems

#### **Coupling**

The modules between themselves should know as little as possible.

#### **Reduced Reusability**

Developers cannot reuse intertwined classes in isolation.

#### **Hard to Test**

Mocking is required.

### Example

<div class="example-block">

#### Smelly

```py
@dataclass
class Commit:
    name: str

    def push(self, repo: Repo):
        repo.push(self.name)

    def commit(self, url: str):
        ...


@dataclass
class Repo:
    url: str

    def push(self, name: str):
        ...

    def commit(self, commit: Commit):
        commit.commit(self.url)
```

</div>

### Refactoring:

- Move Method
- Move Field
- Encapsulate Field
- Replace Inheritance with Delegation
- Change Bidirectional Association to Unidirectional

---

##### Sources

- [[1](#sources)] [Parentage] - Martin Fowler, _"Refactoring: Improving the Design of Existing Code"_ (1999)
- [[2](#sources)] - William C. Wake, _"Refactoring Workbook"_ (2004)
- [Origin] - Martin Fowler, _"Refactoring: Improving the Design of Existing Code (3rd Edition)"_ (2018)
