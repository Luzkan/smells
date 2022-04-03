---
slug: "null-check"
meta:
  last_update_date: 2022-02-26
  title: "Null Check"
  cover: "/logos/logo-text-2560x1280.png"
  known_as:
    - ---
categories:
  expanse: "Between"
  obstruction:
    - Bloaters
  occurrence:
    - Conditional Logic
  tags:
    - Unknown
  smell_hierarchies:
    - Code Smell
    - Design Smell
relations:
  related_smells:
    - name: Special Case
      slug: special-case
      type:
        - family
    - name: Afraid To Fail
      slug: afraid-to-fail
      type:
        - caused
    - name: Flag Argument
      slug: flag-argument
      type:
        - causes
    - name: Conditional Complexity
      slug: conditional-complexity
      type:
        - causes
problems:
  general:
    - Duplication
    - Increased Complexity
    - Bijection
  violation:
    principles:
      - ---
    patterns:
      - ---
refactors:
  - Introduce Null Object
  - Introduce Maybe
  - Introduce Optional
history:
  - author: "William C. Wake"
    type: "origin"
    named_as:
      - Null Check
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

## Null Check

Null check is wide-spread everywhere because the programming languages allow it. It causes multum of `undefined` or `null` checks everywhere - in guard checks, in condition blocks, and in verifications clauses. Instead, special objects could be created that implement the missing-event behavior, errors could be thrown and catched and lots of duplications would be removed. There is this even a fact that sometimes appears here and there on discussion forums, that the inventor of `null` reference, Tony Hoare (also known as the creator of the Quick Sort algorithm), apologizes for its invention and call it a _billion-dollar mistake_.

_Null Check_ is a special case of [Special Case](./special-case.md) code smell.

### Causation

Direct cause of null checking is the lack of proper Null Object that might implement behaviour of the object in case its null. There are strong views that `null` or `undefined` are detrimentally bad idea in programming languages [[1](#sources)].

### Problems

#### **Duplication**

Usually the null check is reoccurring.

#### **Increased Complexity**

Special case must be made for an object that might be undefined.

#### **Bijection Violation**

A `null`/`undefined` as a model is not in one to one relationship with domain. Moreover, actually there is no representation.

### Examples

<div class="example-block">

#### Smelly

```py
class BonusDamage(ABC):
    @abstractmethod
    def increase_damage(self, damage: float) -> float:
        """ Increases the output damage """


class Critical(BonusDamage):
    multiplier: float

    def increase_damage(self, damage: float):
        def additional_damage() -> float:
            return damage * self.multiplier * math.random(0, 2)

        return damage + additional_damage()


class Magical(BonusDamage):
    multiplier: float

    def increase_damage(self, damage: float):
        return damage * multiplier


bonus_damage: BonusDamage | None = perk.get_bonus_damage()

def example_of_doing_something_with_bonus_damage(bonus_damage: BonusDamage | None) -> ... | None:
    if not bonus_damage:
        return

    ...
```

#### Solution

```py
class BonusDamage(ABC):
    @abstractmethod
    def increase_damage(self, damage: float) -> float:
        """ Increases the output damage """


class Critical(BonusDamage):
    multiplier: float

    def increase_damage(self, damage: float):
        def additional_damage() -> float:
            return damage * self.multiplier * math.random(0, 2)

        return damage + additional_damage()


class Magical(BonusDamage):
    multiplier: float
    def increase_damage(self, damage: float):
        return damage * multiplier


class NullBonusDamage(BonusDamage):
    def increase_damage(self, damage: float):
        return damage


bonus_damage: BonusDamage = perk.get_bonus_damage()

def example_of_doing_something_with_bonus_damage(bonus_damage: BonusDamage) -> ...:
    ...
```

</div>

### Refactoring:

- Introduce Null Object
- Introduce `Maybe`/`Optional`

### Exceptions

Similarly to the `if` statements - one usually is not problematic and creating a separate Null Object just to handle this one case (for example, when its only in the Factory method [WAKE]) might be not worth the hassle.

---

##### Sources

- [[1](#sources)], [Origin] - William C. Wake, _"Refactoring Workbook"_ (2004)
