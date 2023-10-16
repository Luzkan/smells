---
slug: "special-case"
meta:
  last_update_date: 2022-04-19
  title: "Special Case"
  cover: "/logos/logo-text-2560x1280.png"
  known_as:
    - Complex Conditional
categories:
  expanse: "Within"
  obstruction:
    - Change Preventers
  occurrence:
    - Conditional Logic
  tags:
    - ---
  smell_hierarchies:
    - Code Smell
    - Implementation Smell
relations:
  related_smells:
    - name: Null Check
      slug: null-check
      type:
        - family
    - name: Temporary Field
      slug: temporary-field
      type:
        - caused
problems:
  general:
    - Comprehensibility
    - Increased Test Complexity
  violation:
    principles:
      - ---
    patterns:
      - ---
refactors:
  - Consolidate Conditional Expression
  - Replace Conditional with Polymorphism
  - Introduce Null Object
  - Replace Exception with Test
history:
  - author: "William C. Wake"
    type: "origin"
    named_as:
      - Special Case
    regarded_as:
      - Code Smell
    source:
      year: 2004
      authors:
        - William C. Wake
      name: "Refactoring Workbook"
      type: "book"
      href:
        isbn_13: "978-0321109293"
        isbn_10: "0321109295"
---

## Special Case

Wake addresses the complex conditional situation as a _Special Case_ code smell with two symptoms - a complex `if` statement and/or value checking [before doing the actual work](./required-setup-or-teardown-code.md) [[1](#sources)].

### Causation

There was a need for a special case to handle. A hotfix that was never adequately fixed could also be the reason for the smell.

### Problems:

#### **Comprehensibility**

The method is doing a specific task, but there is "one special case" to consider.

#### **Increased Test Complexity**

Special case has to have an extra special test.

### Example

<div class="example-block">

#### Smelly

```py
def parse_foo(foo: Foo) -> Goo:
    if 'zoo' in foo.sample_attribute:
        ...
        ...
        ...

    ...
    ...
    ...
    ...
```

</div>

### Refactoring

- Consolidate Conditional Expression
- Replace Conditional with Polymorphism
- Introduce Null Object
- Replace Exception with Test

### Exceptions

Recursive methods always have to have a base case to stop the recursion.

---

##### Sources

- [[1](#sources)], [Origin] - William C. Wake, _"Refactoring Workbook"_ (2004)
