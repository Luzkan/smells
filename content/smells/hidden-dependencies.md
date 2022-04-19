---
slug: "hidden-dependencies"
meta:
  last_update_date: 2022-04-19
  title: "Hidden Dependencies"
  cover: "/logos/logo-text-2560x1280.png"
  known_as:
    - ---
categories:
  expanse: "Between"
  obstruction:
    - Data Dealers
  occurrence:
    - Data
  tags:
    - ---
  smell_hierarchies:
    - Code Smell
    - Design Smell
relations:
  related_smells:
    - name: Global Data
      slug: global-data
      type:
        - caused
    - name: Required Setup or Teardown Code
      slug: required-setup-or-teardown-code
      type:
        - causes
    - name: Long Parameter List
      slug: long-parameter-list
      type:
        - antagonistic
problems:
  general:
    - Hard to Test
    - Error Prone
    - Coupling
    - Comprehensibility
  violation:
    principles:
      - ---
    patterns:
      - ---
refactors:
  - Inject Dependencies
history:
  - author: "Steve Smith"
    type: "parentage"
    named_as:
      - Hidden Dependencies
    regarded_as:
      - Code Smell
    source:
      year: 2013
      authors:
        - Steve Smith
      name: "Refactoring Fundamentals"
      type: "course"
      href:
        direct_url: "https://www.pluralsight.com/courses/refactoring-fundamentals"
  - author: "Zhifeng Yu, Vaclav Rajlich"
    type: "parentage"
    named_as:
      - Hidden Dependencies
    regarded_as:
      - Antipattern
    source:
      year: 2001
      authors:
        - Zhifeng Yu
        - Vaclav Rajlich
      name: "Hidden Dependencies in Program Comprehension and Change Propagation"
      type: "paper"
      href:
        doi: "10.1109/WPC.2001.921739"
        journal: "Proceedings 9th International Workshop on Program Comprehension. IWPC 2001"
        pages: "293-299"
        year: 2001
        publisher: "IEEE"
        direct_url: "https://ieeexplore.ieee.org/abstract/document/921739"
---

## Hidden Dependencies

Hidden Dependency is a situation where, inside a class, methods are silently resolving dependencies, hiding that behavior from the caller. _Hidden Dependencies_ can cause a runtime exception when a caller has not set up the appropriate environment beforehand, which, by itself, is yet another code smell: [Required Teardown/Setup Code](./required-setup-or-teardown-code.md).

### Causation

Objects (which are not stateless) that require a constructor have an empty constructor - the essence of these objects should be passed on to creation, and even better if they are made immutable to avoid [Mutable Data](./mutable-data.md) Code Smell.

### Problems

#### **Coupling**

Each Global Variable is basically a hidden dependency that a tester has to mock.

#### **Hard to Test**

Mocking is required to test methods that use data outside of its closest scope (class or parameters).

#### **Error-Prone**

Changing or removing data might unintentionally break code in unexpected places.

#### **Decreased Comprehensibility**

It is hard to understand the method's behavior without looking up the functions or variables outside its scope.

### Example

#### Smelly

```py
class Customer:
    pass

customer = Customer()

class Cart:
    def __init__(self):
        self.customer = customer  # gets customer from global scope

cart = Cart()
```

#### Solution

```py
class Customer:
    pass

customer = Customer()

class Cart:
    def __init__(self, customer):
        self.customer = customer  # gets customer explicitly

cart = Cart(customer)
```

### Refactoring:

- Inject Dependencies

---

##### Sources

- [[1](#sources)] -
- [Origin] - Steve Smith, _"Refactoring Fundamentals"_ (2013)
- [Parentage] - Zhifeng Yu, _Hidden Dependencies in Program Comprehension and Change Propagation"_ (2001)
