---
slug: "shotgun-surgery"
meta:
  last_update_date: 2022-04-19
  title: "Shotgun Surgery"
  cover: "/logos/logo-text-2560x1280.png"
  known_as:
    - Solution Sprawl
categories:
  expanse: "Between"
  obstruction:
    - Change Preventers
  occurrence:
    - Responsibility
  tags:
    - ---
  smell_hierarchies:
    - Code Smell
    - Design Smell
relations:
  related_smells:
    - name: Divergent Change
      slug: divergent-change
      type:
        - family
    - name: Parallel Inheritance Hierarchies
      slug: parallel-inheritance-hierarchies
      type:
        - family
    - name: Oddball Solution
      slug: oddball-solution
      type:
        - caused
    - name: Base Class Depends on Subclass
      slug: base-class-depends-on-subclass
      type:
        - caused
problems:
  general:
    - Duplication
  violation:
    principles:
      - Single Responsibility
    patterns:
      - ---
refactors:
  - Extract Method
  - Combine Functions into Class
  - Combine Functions into Transform
  - Split Phase
  - Move Method and Move Field
  - Inline Function/Class
history:
  - author: "Martin Fowler"
    type: "origin"
    named_as:
      - Shotgun Surgery
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

## Shotgun Surgery

Similar to [Divergent Change](./divergent-change.md), but with a broader spectrum, the smell symptom of the _Shotgun Surgery_ code is detected by the unnecessary requirement of changing multiple different classes to introduce a single modification. Things like that can happen with the failure to use the correct design pattern for the given system. This expansion of functionality can lead to an easy miss (and thus introduce a bug) if these small changes are all over the place and they are hard to find. Most likely, [too many classes](./oddball-solution.md) solve a simple problem.

Joshua Kerievsky noted this smell as _Solution Sprawl_ [[1](#sources)]. Monteiro stated that the tiny difference between these two comes from how they are sensed. In the [Divergent Change](./divergent-change.md), one becomes aware of the smell while making the changes, and in the _Solution Sprawl_, one is aware by observing the issue. [[2](#sources)]

### Causation

Wake says it could have happened due to an "overzealous attempt to eliminate Divergent Change" [[3](#sources)]. A missing class could understand the entire responsibility and handle the existing cluster of changes by itself. That scenario could also happen with cascading relationships of classes [[4](#sources)].

### Problems

#### **Single Responsibility Principle Violation**

The codebase is non-cohesive.

#### **Duplicated Code**

The increased learning curve for new developers to effectively implement a change.

### Examples

<div class="example-block">

#### Smelly

```py
class Minion:
    energy: int

    def attack(self):
        if self.energy < 20:
            animate('no-energy')
            skip_turn()
            return
        ...

    def cast_spell(self):
        if self.energy < 50:
            animate('no-energy')
            skip_turn()
            return
        ...

    def block(self):
        if self.energy < 10:
            animate('no-energy')
            skip_turn()
            return
        ...

    def move(self):
        if self.energy < 35:
            animate('no-energy')
            skip_turn()
            return
        ...
```

#### Solution

```py
class Minion:
    energy: int

    def attack(self):
        if not self.has_energy(20):
            return
        ...

    def cast_spell(self):
        if not self.has_energy(50):
            return
        ...

    def block(self):
        if not self.has_energy(10):
            return
        ...

    def move(self):
        if not self.has_energy(35):
            return
        ...

    def has_energy(self, energy_required: int) -> bool:
        if self.energy < energy_required:
            self.handle_no_energy()
            return False
        return True

    def handle_no_energy(self) -> None:
        animate('no-energy')
        skip_turn()

```

</div>

### Refactoring:

- Extract Method
- Combine Functions into Class
- Combine Functions into Transform
- Split Phase
- Move Method and Move Field
- Inline Function/Class

##### Sources

- [[1](#sources)] - Joshua Kerievsky, _"Refactoring to Patterns"_ (2005)
- [[2](#sources)] - Monteiro, M.P., Fernandes, J.M., "Towards a catalog of aspect-oriented refactorings" (2005)
- [[3](#sources)] - William C. Wake, _"Refactoring Workbook"_ (2004)
- [[4](#sources)] - MS Haque, J Carver, T Atkison, "Causes, impacts, and detection approaches of code smell: A survey" (2018)
- [Origin] - Martin Fowler, _"Refactoring: Improving the Design of Existing Code"_ (1999)
