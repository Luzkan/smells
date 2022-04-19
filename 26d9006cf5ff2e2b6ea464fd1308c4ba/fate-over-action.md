---
slug: "fate-over-action"
meta:
  last_update_date: 2022-04-19
  title: "Fate over Action"
  cover: "/logos/logo-text-2560x1280.png"
  known_as:
    - Data Class
categories:
  expanse: "Between"
  obstruction:
    - Couplers
  occurrence:
    - Responsibility
  tags:
    - ---
  smell_hierarchies:
    - Code Smell
    - Design Smell
relations:
  related_smells:
    - name: Mutable Data
      slug: mutable-data
      type:
        - family
    - name: Feature Envy
      slug: feature-envy
      type:
        - causes
    - name: Data Clumps
      slug: data-clumps
      type:
        - antagonistic
    - name: Primitive Obsession
      slug: primitive-obsession
      type:
        - antagonistic
problems:
  general:
    - Coupling
  violation:
    principles:
      - Tell, Don’t Ask
    patterns:
      - ---
refactors:
  - Move Method
  - Extract method
  - Freeze Variables
history:
  - author: "Marcel Jerzyk"
    type: "origin"
    named_as:
      - Fate Over Action
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
  - author: "Martin Fowler"
    type: "parentage"
    named_as:
      - Data Class
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

## Fate over Action

In Object-Oriented Programming, classes and their data go hand in hand with behavior. If a class has only the first part, it is an indicator that there could be a functionality tied to these variables, but it is missing or placed somewhere else.

Back in the days _(at the time of defining - Fowler 2003)_ _Data Class_ would be enough to be classified as a bad smell, as it is the main evil of hidden and hard-to-debug problems in large-scale systems because of mutability - data were unexpectedly different, or it was missing at the point of execution due to some other unexpected reasons. Thus, the data were supposed to be closely tied to the logic to go hand in hand. This is also one of the main reasons functional programming is rising in popularity; one of its main principles is that the data should be immutable, so there would be no more of these sorts of bugs.

_Data Class_ is still a sufficiently intuitive motive to follow. However, in programming languages, we have things like `Interface`-s or `Struct`-s to pack and type together a bunch of variables. This directly addresses and solves the [Data Clumps](./data-clump.md) Code Smell. Data Transfer Objects (DTO) are not uncommon with the dominance of web-based applications and communications over API. All of this could fall into the "Data Class" code smell category, but I rather believe we are not intentionally making everything stinky as programmers.

Data classes that cannot be changed (thus lacking setters or with some sort of "frozen" property) are much less error-prone and should not be discouraged if they are a suitable fit to remove other smells or to pass data around, especially if the alternative is to have long un-verified dictionaries straight out of configuration file or API call. The immutable data class can have the additional benefit of verifying the types _(depending on a language)_, so if it is expected to have `address` given as a `string,` then that is a good Fail Fast mechanism (check [Afraid to Fail](./afraid-to-fail.md)) if instead a `None` or `undefined` is given due to a misformed or incomplete input. And after all, when the class is already here, it can be encouraging to fill it with further validation and behavior.

### Discussion

To preserve the current idea behind the _Data Class_ code smell, I propose a new one that could take its place: _Fate over Action_ - it would be a problem not with the data class itself but rather with any case whenever the external function works only on the internal parameters of an object.

The term Fate over Action is inspired by personality psychology, precisely from the _Locus of Control_ subject. Locus of Control is the degree to which a man believes that he has control over the outcome of events in his life, as opposed to the belief that things are beyond his influence. It could be internal (a belief that one can control own life) or external (a belief that life is governed by the outside, by things one can not influence; be that chance or fate).

People with a strong internal locus of control believe that events in their lives result from their actions. That is precisely what Object Oriented Programming principles suggest as good programming practice. It would take the stigma off the _Data Class_ and pass it to the term _Fate over Action_ which captures the essence of the problem much better.

The term is a loose proposition. Some other candidates could be _Fate over Internal Locus_, or just the _Locus of Control_, but I think the proposed one is "catchy" and conveys the meaning of the smell in its name - making it much less controversial than _Data Class_.

This generalization of an existing concept is not a novel thing. That is what Fowler did with the Switch Statement and Lazy Class, renaming them to [Repeated Switching](./conditional-complexity.md) and [Lazy Element](./lazy-element.md), respectively. One of the reasons he did that is that after the publication of his book, which turned out to be quite revolutionary, the `if`/`else` and `switch`/`case` statements gained too much lousy PR exchanging the reputation points in favor of polymorphism.

### Causation

> It is common for classes to begin like this: you realize that some data are part of an independent object, so you extract it. But objects are about the commonality of behavior, and these objects are not developed enough to have much behavior yet.
> ~ Wake 2004 [[1](#sources)]

### Problems

#### **Tell, Don’t Ask Principle Violation**

The principle says that one should not ask about the object state to decide on an action but rather straightforwardly send a command.

#### **Coupling**

Objects are unnecessarily coupled with each other when a particular class could take care of itself.

### Example

<div class="example-block">

#### Smelly

```py
@dataclass
class CommitManager:
    def update_author(commit: Commit, new_author: str):
        ...

    def update_message(commit: Commit, new_message: str):
        ...


@dataclass
class Commit:
    _author: str
    _message: str


commit_manager = CommitManager()
commit = Commit(author="Marceli Jerzyk", "Fix: Button Component styled width w/ rem (from px)")
commit_manager.update_author(commit, "Marcel Jerzyk")
```

#### Solution

```py
@dataclass
class Commit:
    _author: str
    _message: str

    def set_author(self, new_author: str):
        ...

    def set_message(self, new_message: str):
        ...


commit = Commit(author="Marceli Jerzyk", "Fix: Button Component styled width w/ rem (from px)")
commit.set_author(commit, "Marcel Jerzyk")
```

</div>

### Refactoring:

- Move Method
- Extract method
- Freeze Variables

---

##### Sources

- [[1](#sources)] - William C. Wake, _"Refactoring Workbook"_ (2004)
- [Origin] - Marcel Jerzyk, _"Code Smells: A Comprehensive Online Catalog and Taxonomy"_ (2022)
- [Parentage] - Martin Fowler, _"Refactoring: Improving the Design of Existing Code"_ (1999)
