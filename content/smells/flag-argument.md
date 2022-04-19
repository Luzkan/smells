---
slug: "flag-argument"
meta:
  last_update_date: 2022-04-19
  title: "Flag Argument"
  cover: "/logos/logo-text-2560x1280.png"
  known_as:
    - Boolean in Method Parameter
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
relations:
  related_smells:
    - name: Binary Operator in Name
      slug: binary-operator-in-name
      type:
        - caused
    - name: Long Method
      slug: long-method
      type:
        - causes
    - name: Long Parameter List
      slug: long-parameter-list
      type:
        - causes
    - name: Conditional Complexity
      slug: conditional-complexity
      type:
        - causes
    - name: Loops
      slug: loops
      type:
        - caused
    - name: Null Check
      slug: null-check
      type:
        - caused
    - name: Side Effects
      slug: side-effects
      type:
        - antagonistic
problems:
  general:
    - Hard to Read
    - Hard to Change
  violation:
    principles:
      - ---
    patterns:
      - ---
refactors:
  - Remove Flag Argument
  - Extract Method
history:
  - author: "Robert C. Martin"
    type: "origin"
    named_as:
      - Flag Arguments
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
  - author: "Martin Fowler"
    type: "parentage"
    named_as:
      - Remove Flag Argument
    regarded_as:
      - Refactoring Method
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

## Flag Argument

Martin Fowler defines Flag Arguments as a "kind of function argument that tells the function to carry out a different operation depending on its value." [[1](#sources)] There are two reasons why this is smelly. First of all - it can be a candidate for [Boolean Blindness](./boolean-blindness.md) Code Smell. Fowler gives a great example with _Concert_ class and the` book(customer: Customer, is_premium: bool)` method. While reading the code, without knowing much more context, one will be stopped by invocation of this method: `book(marcel, false)` - excuse me, but precisely what "`false`"? The situation is clear if the method is divided into two separate parts instead of using a flag argument. Then, calling a method that provides more meaning through a name like `regularBook(marcel)` is much better in terms of comprehensibility.

The second problem is that it might be a cocoon phase before it develops into a beautiful full-fledged [Conditional Complexity](./conditional-complexity.md). First, what you see is `is_premium: bool`. The second time you come by, it is already transformed to `ticket_type: str,` switching through different options based on the value and the smell of the [Primitive Obsession](./primitive-obsession.md) on top.

### Causation

Quick dirty tweaking can cause them for new features because it might be as easy and tempting as adding `else if` clause to the conditional-checking block. The developer felt that it was just a tiny difference and didn't bother to create a separate method for its implementation.

### Problems

#### **Hard to Read**

In most cases, you will not know what `false` or what `true` is going on until you hover over the method.

#### **Hard to Change**

Boolean as a flag argument implies that a method has two ways of working.

### Example

#### Smelly

```py
class Concert:
    def book(self, customer: Customer, is_premium: bool):
        if is_premium:
            ...
        else:
            ...

book(marcel, false) # ? false what
```

#### Solution

```py
class Concert:
    def book_premium(self, customer: Customer):
        ...

    def book_regular(self, customer: Customer):
        ...

book_regular(marcel)
```

### Refactoring:

- Remove Flag Argument
- Extract Method

---

##### Sources

- [[1](#sources)] - Martin Fowler ["FlarArgument"](https://martinfowler.com/bliki/FlagArgument.html) (2011)
- [Origin] - Martin Fowler, _"Refactoring: Improving the Design of Existing Code (3rd Edition)"_ (2018)
- [Parentage] - Martin Fowler, _"Refactoring: Improving the Design of Existing Code"_ (1999)
