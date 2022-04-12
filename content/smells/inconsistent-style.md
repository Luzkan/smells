---
slug: "inconsistent-style"
meta:
  last_update_date: 2022-02-24
  title: "Inconsistent Style"
  cover: "/logos/logo-text-2560x1280.png"
  known_as:
    - Sequence Inconsistency
categories:
  expanse: "Between"
  obstruction:
    - Obfuscators
  occurrence:
    - Names
  tags:
    - ---
  smell_hierarchies:
    - Code Smell
relations:
  related_smells:
    - name: Inconsistent Names
      slug: inconsistent-names
      type:
        - family
problems:
  general:
    - Error Prone
    - Comprehensibility
    - Flow State Disruption
  violation:
    principles:
      - ---
    patterns:
      - ---
refactors:
  - Introduce Linter Rules
  - Reorder Parameters
history:
  - author: "Marcel Jerzyk"
    type: "origin"
    named_as:
      - Inconsistent Style
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

## Inconsistent Style

The same thing as in [Inconsistent Names](./inconsistent-names.md) applies to the general formatting and code style used in the project. Browsing through the code should have a similar feeling to reading a good article or a book - consistent and elegant. In the project, the code layout should not be changed preferentially or randomly, but should be uniform so as not to disturb the expected form of code in the following lines

Reading a novel where on each page the reader is surprised by the new font ranging from <span style="font-family: 'Times New Roman'">Times New Roman</span> through <span style="font-family: 'Comic Sans MS'">Comic Sans</span> up to <span style="font-family: consolas">Consolas</span> is gently distracting and could break out of the flow state.

Another example of a _Inconsistent Style_ smell could be _Sequence Inconsistency_, for example, in the order of parameters within classes or methods. Once defined, the order should be kept in the group of all abstractions on that particular subject. If the order is not preserved, it leads, once again, to the unpleasant feeling of dissatisfaction after (if ever!) the mind realizes that it was again surprised wrong. Depending on the specific case, it would still be only half the trouble, if the flipped parameters were of different types (such as `string` and `int`). If the type were the same (eg: `int`) then this could lead unnoticeably to a major hidden bug.

### Causation

Team members working on the same project disagreed on one particular coding style, linter, or code formatter. In the worst case, different people could use different formatters or different formatting rules and overwrite the whole files with their style of choice over each other, littering the git history with new commits.

### Problems

#### **Error Prone**

With nowadays advances IDE's type hinting the change is smaller, but when a bug gets introduced by a sequence inconsistency, it might be annoying to find out its root cause.

#### **Comprehensibility**

Depending on the state of code, the comprehensibility issues that the inconsistent style can cause range from irrelevant up to illegible.

#### **Flow State Disruption**

Familiarity is an important factor in code orientation and navigation.

### Examples

<div class="example-block">

#### Smelly

Inconsistent Style

```py
my_first_function(
    arg1=1,
    arg2=2,
    arg3=3
)
my_second_function(arg1=1,
                   arg2=2,
                   arg3=3)
my_third_function(
    arg1=1, arg2=2, arg3=3)
```

</div>

<div class="example-block">

#### Smelly

Sequence Inconsistency

```py
class Character:
    DAMAGE_BONUS: float

    def rangeAttack(self, enemy: Character, damage: int, extra_damage: int):
        total_damage = damage + extra_damage*self.DAMAGE_BONUS
        ...

    def meleeAttack(self, enemy: Character, extra_damage: int, damage: int):
        total_damage = damage + extra_damage*self.DAMAGE_BONUS
        ...

witcher.rangeAttack(skeleton, 300, 200)
witcher.meleeAttack(skeleton, 300, 200)  # potentially overlooked error
```

</div>

### Refactoring

- Introduce Linter Rules
- Reorder Parameters

---

##### Sources

- [Origin] - Marcel Jerzyk, _"Code Smells: A Comprehensive Online Catalog and Taxonomy"_ (2022)
