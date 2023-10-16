---
slug: "vertical-separation"
meta:
  last_update_date: 2022-04-19
  title: "Vertical Separation"
  cover: "/logos/logo-text-2560x1280.png"
  known_as:
    - Regions
categories:
  expanse: "Within"
  obstruction:
    - Obfuscators
  occurrence:
    - Measured Smells
  tags:
    - ---
  smell_hierarchies:
    - Code Smell
relations:
  related_smells:
    - name: Obscured Intent
      slug: obscured-intent
      type:
        - causes
problems:
  general:
    - Encouraged Grouping by Visibility instead of Functionality
    - Hidden Perspective
    - No Value
  violation:
    principles:
      - Law of Demeter
    patterns:
      - ---
refactors:
  - Remove the Code Smells
history:
  - author: "Robert C. Martin"
    type: "origin"
    named_as:
      - Vertical Separation
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

## Vertical Separation

There is a tendency to declare variables in one place together before the main "logic" of the method begins. This detachment creates an artificial vertical separation between the variables and the place where they are used. This distancing is an undesirable situation. The same applies to private, utility, or helper functions, which developers should preferably find directly under their first usage [[1](#sources)].

There are programming languages (like C#) that support _Regions_, a code smell that regards the same issue but also supports it through the offered functionality. There are also IDE and editor add-ons that add this externally as a feature. Regions are markers that allow the code to collapse from one particular place to another. It may seem innocent, although this is just a plaster for _Vertical Separation's_ unhealed wound. It is often used to conceal that a method or class is too large, which does not solve the underlying problem.

Sometimes it is used, regardless of the size of the code, to mark separate "regions" for fields, properties, public methods, private methods - even if there are none implemented, to have a certain common standard.

If the code is well written, the default collapsible places based on the code (on methods or classes) should be good enough as an organizing tool.

### Causation:

The Vertical Separation may result from the past optimization habits, which were required a long time ago. However, nowadays, the code compilers will optimize it (function variables are put on the stack before the first line of code even gets executed). This could also be a matter of personal preference, but the standard rule is that things should not be too far from each other.

Regions could be used to hide bloat and be a very inexpensive deodorant for other code smells such as [Clever Code](./clever-code.md), [Long Method](./long-method.md), [Loops](./imperative-loops.md), but it just bloats the code even further.

### Problems

#### **Encouraged Grouping by Visibility instead of Functionality**

It is much better to group code by functionality [[16](#sources)]. It leads to better cohesion.

#### **Hidden Perspective**

In order to see the code in which the regions are used, more clicks are required due to unfolding.

#### **Law of Demeter Principle Violation**

Things related to each other should be as close to each other as possible.

#### **No Additional Value**

### Examples

<div class="example-block">

#### Smelly

Regions in C#

```cs
public class Foo
{
  #region Constructor
  public Foo() {}
  #endregion
  #region Methods
  ...
  #endregion
}
```

Regions in Python

```py
class Foo:
    def __init__(self, args):
        #region InitVariables
        ...
        #endregion
```

</div>

<div class="example-block">

#### Smelly

```py
repeat = 5

...

doing_something()
doing_something_else()

...

for index in range(0, repeat):
    ...
```

#### Solution

```py
...

doing_something()
doing_something_else()

...


repeat = 5
for index in range(0, repeat):
    ...
```

</div>

### Refactoring:

- Remove the Code Smells instead of Hiding Them

---

##### Sources

- [[1](#sources)], [Origin] - Robert C. Martin, _"Clean Code: A Handbook of Agile Software Craftsmanship"_ (2008)
