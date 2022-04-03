---
slug: "magic-number"
meta:
  last_update_date: 2022-02-26
  title: "Magic Number"
  cover: "/logos/logo-text-2560x1280.png"
  known_as:
    - Uncommunicative Number
categories:
  expanse: "Within"
  obstruction:
    - Lexical Abusers
  occurrence:
    - Names
  tags:
    - ---
  smell_hierarchies:
    - Antipattern
    - Code Smell
    - Implementation Smell
relations:
  related_smells:
    - name: Uncommunicative Name
      slug: uncommunicative-name
      type:
        - family
    - name: Boolean Blindness
      slug: boolean-blindness
      type:
        - family
    - name: Obscured Intent
      slug: obscured-intent
      type:
        - causes
    - name: '"What" Comment'
      slug: what-comment
      type:
        - causes
    - name: Duplicated Code
      slug: duplicated-code
      type:
        - causes
problems:
  general:
    - Readability
    - Duplication
    - Bijection
  violation:
    principles:
      - ---
    patterns:
      - ---
refactors:
  - Replace with Symbolic Constant
  - Replace with Parameter
history:
  - author: "William C. Wake"
    type: "origin"
    named_as:
      - Remove Magic Numbers
    regarded_as:
      - Refactor Method
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

## Magic Number

The problems with floats and integers is that they convey no meaning - there's only context, which is often not enough and even if one might think it is, then leaving the unexplained number makes the code just less readable. Magic numbers also usually go in little groups which should all the more encourage to collect them under one appropriately named constant.

### Causation

It may be convenient to write down the implementation idea first with numbers but then after a task is finished, developer did not get back to add meaning to the used abstraction.

### Problems

#### **Low Readability**

Only funny numbers convey universally understood meaning, in all other cases - they are just digits without explanation.

#### **Duplication**

If the place where the magic number is placed is not a Query to some sort of database, then more likely than not, this number will be repeated somewhere later in the logic.

#### **Bijection Violation**

A number as a model is not in one to one relationship with domain (`5` can mean _5 years_, _5 apples_, _grade type_, _5 Bitcoins_).

### Examples

<div class="example-block">

#### Smelly

```py
def calculateDamage(...) -> int:
    total_damage = ...
    return math.max(100, damage)
```

#### Solution

```py
def calculateDamage(...) -> int:
    total_damage = ...

    MAX_DAMAGE_CAP: int = 100
    return math.max(MAX_DAMAGE_CAP, total_damage)
```

</div>

### Refactoring:

- Replace with Symbolic Constant
- Replace with Parameter

### Exceptions

The numbers should not always be replaced with intentional names. The best example I can give are math & physics formulas. I would write the formula for kinematic energy as `kinematic_energy = (mass * (velocity**2))/2`, leaving the _two's_ as they are. On the other hand if a formula would have a known constant like `PI`, then I would definitely create a constant expressing that in fact, the `3.14159` is `PI` _(... by the way it could be a [Clever Code](./clever-code.md), it would be best to use `math.pi` built-in instead)_.

---

##### Sources

- [[1](#sources)], [Origin] - William C. Wake, _"Refactoring Workbook"_ (2004)
