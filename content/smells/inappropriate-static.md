---
slug: "inappropriate-static"
meta:
  last_update_date: 2022-02-24
  title: "Inappropriate Static"
  cover: "/logos/logo-text-2560x1280.png"
  known_as:
    - Static Cling
categories:
  expanse: "Between"
  obstruction:
    - Object Oriented Abusers
  occurrence:
    - Interfaces
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
        - co-exist
problems:
  general:
    - Hard to Test
    - Coupling
  violation:
    principles:
      - Single Responsibility
    patterns:
      - ---
refactors:
  - Inject Dependencies
history:
  - author: "Robert Martin"
    type: "origin"
    named_as:
      - Inappropriate Static
    regarded_as:
      - Code Smell
    source:
      year: 2008
      authors:
        - Robert C. Martin
      name: "Clean Code: A Handbook of Agile Software Craftsmanship"
      type: "book"
      href:
        isbn_13: "978-0132350884"
        isbn_10: "9780132350884"
---

## Inappropriate Static

The rule of a thumb given by the uncle Robert is that when in doubt one should prefer non-static methods to static methods. The best way to check whether a method should be static, would be to think if the method should behave polymorphically. A good example of a static method given by Martin is `math.max(double a, double b)` - it is hard to think of polymorphic behaviour for a `max` function. On the other hand `HourlyPayCalculator.calculate_pay(employee, overtime_rate)` is dubious - there could be different algorithms to calculate the payment and thus it should a non-static method of `Employee` class. Although, one should be aware and take caution of [Speculative Generality](./speculative-generality.md) code smell. At the very present moment, when there are no different algorithms yet requested or planned, this is a stateless operations, which is fine for static methods. Steve Smiths addresses that statics should be reserved for behaviour that will never change, besides the previously mentioned stateless operations, giving global constants as one of the examples [[1](#sources)].

[Static Cling](./inappropriate-static.md) is a code smell, that headquarters on the border of the test code and the source code, although following the Fail Fast principle, the issue starts in the developmental parts of the codebase.

Whenever a static function is called, in majority of the languages it is, to say the least, not trivial to test and/or mock the method in which it does happen. There are 3rd party mocking frameworks, but that is more of a workaround for bad design. This should be watched out for, because such dependency is easily introduced into the code in styles other than the Test Driven Development.

### Problems

#### **Hard to Test**

Using static functions and variables makes the code harder to test; requires mocking.

#### **Coupling**

#### **Single Responsibility Principle Violation**

### Example

<div class="example-block">

#### Smelly

```py
class FooUtils:
    @staticmethod
    def wrap_tag_premium(foo: Foo):
        return f"[TAG]: {foo.action()}"

    @staticmethod
    def wrap_tag_special(foo: Foo):
        return f"[TAG]: {foo.action()}"
```

#### Solution

```py
@dataclass
class FooTagWrapper:
    foo: Foo

    def wrap_tag_premium(self):
        return f"[PREMIUM]: {self.foo}"

    def wrap_tag_special(self):
        return f"[SPECIAL]: {self.foo}"
```

</div>

#### Refactoring:

- Encapsulate Method

---

##### Sources

- [[1](#sources)] - Steve Smith, _"Refactoring Fundamentals"_ (2013)
- [Origin] - Robert Martin, _"Clean Code: A Handbook of Agile Software Craftsmanship"_ (2008)
