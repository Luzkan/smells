---
slug: "side-effects"
meta:
  last_update_date: 2022-04-19
  title: "Side Effects"
  cover: "/logos/logo-text-2560x1280.png"
  known_as:
    - Impure Functions
categories:
  expanse: "Within"
  obstruction:
    - Functional Abusers
  occurrence:
    - Responsibility
  tags:
    - ---
  smell_hierarchies:
    - Code Smell
relations:
  related_smells:
    - name: Mutable Data
      slug: mutable-data
      type:
        - caused
    - name: Dubious Abstraction
      slug: dubious-abstraction
      type:
        - causes
    - name: Binary Operator in Name
      slug: binary-operator-in-name
      type:
        - antagonistic
    - name: Flag Arguments
      slug: flag-argument
      type:
        - antagonistic
problems:
  general:
    - ---
  violation:
    principles:
      - Single Responsibility
    patterns:
      - ---
refactors:
  - Extract Method
  - Extract Field
history:
  - author: "Marcel Jerzyk"
    type: "origin"
    named_as:
      - Side Effects
      - Impure Functions
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

## Side Effects

The first or second most essential functional programming principle (interchangeably, depending on how big we want to set the statement's tone) is that there be no side effects. Object-Oriented programming can apply this rule, too, with great benefits.

In a perfect scenario, when looking at a higher abstraction set of method calls, even an inexperienced bystander could tell what is happening more or less. The [code example](#example) appears to receive a player object identified by _Marcel Jerzyk_, sets its gold to zero, and manageable health status. That is great because one can make reasonable assumptions about the code... unless one cannot due to the side effects, which make these methods impure. By taking a closer look at the `set_gold(amount)` function, it turns out that, for some reason, this method triggers a dancing animation and resets the payday timer... of course, if one did not lose his trust yet, that the method names are representative of what they do.

The method and function names should tell what they do and do only what is anticipated to maximize code comprehension. I want to note that developers should fix this by removing the side effects to separate methods and triggering them individually, not violating the Single Responsibility Principle. Changing the name to `set_gold_and_reset_payday(amount)`, would create [Binary Operator In Name](./binary-operator-in-name.md) Code Smell and another possible bad solution, `set_gold(amount: int, is_payday: bool)`, would cause [Flag Arguments](./flag-argument.md) Code Smell.


### Causation

Developers added additional actions to existing functionalities, which usually took place in the context during typical use and are not explicitly related to the function itself.

### Problems

#### **Single Responsibility Principle Violation**

The method is doing more than one thing.

### Example

<div class="example-block">

#### Smelly

```py
@dataclass
class Player:
    gold: int
    job: Job

    def set_gold(self, amount: int):
        self.gold = amount
        self.trigger_animation(Animation.Dancing)
        self.job.reset_payday_timer()


marcel: Player = find_player_by_name(Marcel, Jerzyk)
marcel.set_gold(0)
marcel.set_health(Health.Decent)
```

#### Solution

```py
@dataclass
class Player:
    gold: int
    job: Job

    def payout_routine(self):
        self.trigger_animation(Animation.Dancing)
        self.job.reset_payday_timer()

    def set_gold(self, amount: int):
        self.gold = amount

marcel: Player = find_player_by_name(Marcel, Jerzyk)
marcel.set_gold(0)
marcel.payout_routine()
marcel.set_health(Health.Decent)
```

</div>

### Refactoring:

- Extract Method
- Extract Field

---

##### Sources

- [Origin] - Marcel Jerzyk, _"Code Smells: A Comprehensive Online Catalog and Taxonomy"_ (2022)
