---
slug: "status-variable"
meta:
  last_update_date: 2022-02-27
  title: "Status Variable"
  cover: "/logos/logo-text-2560x1280.png"
  known_as:
    - ---
categories:
  expanse: "Within"
  obstruction:
    - Obfuscators
  occurrence:
    - Unnecessary Complexity
  tags:
    - ---
  smell_hierarchies:
    - Code Smell
relations:
  related_smells:
    - name: Special Case
      slug: special-case
      type:
        - family
    - name: Clever Code
      slug: clever-code
      type:
        - co-exist
    - name: Loops
      slug: loops
      type:
        - co-exist
    - name: Afraid to Fail
      slug: afraid-to-fail
      type:
        - co-exist
    - name: Mutable Data
      slug: mutable-data
      type:
        - co-exist
    - name: Binary Operator in Name
      slug: binary-operator-in-name
      type:
        - co-exist
    - name: Loops
      slug: loops
      type:
        - caused
problems:
  general:
    - Comprehensibility
  violation:
    principles:
      - ---
    patterns:
      - ---
refactors:
  - Replace with Built-In
  - Extract Method
  - Remove Status Variables
history:
  - author: "Marcel Jerzyk"
    type: "origin"
    named_as:
      - Status Variable
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
---

## Status Variable

Status Variables are mutable primitives that are initialized before an operation to store some information based on the operation, and are later used as a switch for some action.

The _Status Variables_ can be identified as a separate code smell, although they are really just a signal for five other code smells:

- [Clever Code](./clever-code.md),
- [Imperative Loops](./imperative-loops.md),
- [Afraid To Fail](./afraid-to-fail.md),
- [Mutable Data](./mutable-data.md),
- [Special Case](./special-case.md).

They come in different types and forms, but common examples are the `success: bool = False`-s before performing an operation block or `i: int = 0` before a loop statement. The code that has them increases in complexity by a lot, and usually for no particular reason, because there most likely exists a proper solution using first-class functions. Sometimes, they just clutter the code, demanding other methods or classes to make [additional checks](./special-case.md) before execution resulting in [Required Setup/Teardown Code](./required-setup-or-teardown-code.md).

### Causation

The developer might have special cases that could be handled only inside a loop, could not figure out a better solution.

### Problems

#### **Comprehensibility**

It is more difficult to understand the inner workings of a method compared to declarative solution.

### Examples

<div class="example-block">

#### Smelly

```py
def find_foo_index(names: list[str]):
    found = False
    i = 0
    while not found:
        if names[i] == 'foo':
            found = True
        else:
            i += 1
    return i
```

#### Solution

Solution, which removes the usage of Status Variables.

```py
def find_foo_index(names: list[str]):
    for index, value in enumerate(names):
        if value == 'foo':
            return index
```

#### Solution

Solution, which removes the usage of Status Variables and [Clever Code](./clever-code.md).

```py
def find_foo_index(names: list[str]):
    return names.index('foo')
```

</div>

### Refactoring:

- Replace with Built-In
- Extract Method
- Remove Status Variables

---

##### Sources

- [Origin] - Marcel Jerzyk, _"Code Smells: A Comprehensive Online Catalog and Taxonomy"_ (2022)
