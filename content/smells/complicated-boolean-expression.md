---
slug: "complicated-boolean-expression"
meta:
  last_update_date: 2022-04-19
  title: "Complicated Boolean Expression"
  cover: "/logos/logo-text-2560x1280.png"
  known_as:
    - ---
categories:
  expanse: "Within"
  obstruction:
    - Obfuscators
  occurrence:
    - Conditional Logic
  tags:
    - ---
  smell_hierarchies:
    - Code Smell
relations:
  related_smells:
    - name: Complicated Regex Expression
      slug: complicated-regex-expression
      type:
        - family
    - name: Obscured Intent
      slug: obscured-intent
      type:
        - causes
    - name: Flag Argument
      slug: flag-argument
      type:
        - caused
    - name: '"What" Comments'
      slug: what-comments
      type:
        - causes
problems:
  general:
    - Comprehensibility
  violation:
    principles:
      - ---
    patterns:
      - ---
refactors:
  - Introduce Explaining Method or Variable
  - Use Guard Clauses
  - Simplify Conditional
history:
  - author: "William C. Wake"
    type: "origin"
    named_as:
      - Complicated Boolean Expression
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

## Complicated Boolean Expression

One should keep in mind that _Boolean Expressions_ can be troublesome for some people (in other words, not as quick to comprehend as if it were an adequately named method instead). Wake reminds the reader of _De Morgan Laws_ that could be applied to simplify the expression.

Wake also reminds us about guard checks, which could "peel off" complexity layers from the expression. [[1](#sources)] Interestingly, Robert Martin gives a minimum [example](#robert-martin-example) in his _Encapsulate Conditionals_ refactoring explanation [[2](#sources)], which could be a bit controversial but is yet another good perspective to look at the problem. Instead of simplifying the expression, he paid attention to the readable intention. As I have just mentioned, the example provided might be a bit controversial because it contains just one `AND` operation, which is not a _Discrete Mathematics 2_ type problem. Nevertheless, the point is valid: An appropriately named function or method is more comprehensible at a glance than whatever the `boolean` expression it is.

I have linked the smell to [Obscured Intent](./obscured-intent.md) as _causes_ just because of all the cases of any `if not thing.notDone()` double negated by token and name expressions, wherever they are. An unnecessary [Flag Argument](./flag-argument.md) Code Smell might imperceptibly impact the complexity of an expression.

### Causation

Similar to [Conditional Complexity](./conditional-complexity.md) - developers introduced new features, and instead of doing it cleanly, developers used a dirty method conditional method instead.

### Problems:

#### Comprehensibility

It's easier to read declarative words than to computate logic statements.

### Example

<div class="example-block">

#### Smelly (Robert C. Martin)

```py
if (timer.has_expired() and not timer.is_recurrent()):
    ...
```

#### Solution (Robert C. Martin)

```py
if (should_be_deleted(timer)):
    ...
```

<div class="example-block">

#### Smelly

```py
def cook(ready: bool, bag: list):
    if (ready):
        if (['raspberry', 'apple', 'tomato'] in bag and ['carrot', 'spinach', 'garlic'] not in bag):
            ...

```

#### Solution

```py
# "ready" extracted out of the function scope
def cook(bag: list):
    def hasFruit(container: list) -> bool:
        return ['raspberry', 'apple', 'tomato'] in container
    def hasVeggie(container: list) -> bool:
        return ['carrot', 'spinach', 'garlic'] in container

    if not hasFruit(bag):
        return
    if hasVeggie(bag):
        return
    ...
```

</div>

### Refactoring

- Introduce Explaining Method or Variable
- Use Guard Clauses
- Simplify Conditional

---

##### Sources

- [[1](#sources)], [Origin] - William C. Wake, _"Refactoring Workbook"_ (2004)
- [[2](#sources)] - Robert C. Martin - _"Clean Code: A Handbook of Agile Software Craftsmanship"_ (2008)
