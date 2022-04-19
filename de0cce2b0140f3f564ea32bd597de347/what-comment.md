---
slug: "what-comment"
meta:
  last_update_date: 2022-04-19
  title: '"What" Comment'
  cover: "/logos/logo-text-2560x1280.png"
  known_as:
    - Comment
categories:
  expanse: "Within"
  obstruction:
    - Dispensables
  occurrence:
    - Names
  tags:
    - ---
  smell_hierarchies:
    - Code Smell
relations:
  related_smells:
    - name: Fallacious Comment
      slug: fallacious-comment
      type:
        - family
    - name: Uncommunicative Name
      slug: uncommunicative-name
      type:
        - caused
    - name: Magic Number
      slug: magic-number
      type:
        - caused
    - name: Boolean Blindness
      slug: boolean-blindness
      type:
        - caused
    - name: Complicated Regex Expression
      slug: complicated-regex-expression
      type:
        - caused
    - name: Complicated Boolean Expression
      slug: complicated-boolean-expression
      type:
        - caused
    - name: Obscured Intent
      slug: obscured-intent
      type:
        - caused
problems:
  general:
    - Duplication
    - Cover Other Smells
  violation:
    principles:
      - ---
    patterns:
      - ---
refactors:
  - Extract Method
  - Rename Method
  - Introduce Assertion
history:
  - author: "Marcel Jerzyk"
    type: "origin"
    named_as:
      - '"What" Comment'
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
  - author: "William C. Wake"
    type: "mention"
    source:
      year: 2004
      authors:
        - William C. Wake
      name: "Refactoring Workbook"
      type: "book"
      href:
        isbn_13: "978-0321109293"
        isbn_10: "0321109295"
  - author: "Martin Fowler"
    type: "parentage"
    named_as:
      - Comments
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

## "What" Comment

Recognizing all comments as Code Smells is controversial and raises many different opinions. For this reason, I define a concrete subcategory of comments named _"What" Comments_ that clearly defines only these comments, which in the vast majority will hint at something smells. The rule is simple: If a comment describes _what_ is happening in a particular code section, it is probably trying to mask some other Code Smell.

This distinction leaves room for the _"Why" Comments_ which were already defined by Wake in 2004 and were considered helpful. Wake also notes that comments that cite non-obvious algorithms are also acceptable [[1](#sources)]. I wanted to mention that comments may have their places in a few more cases, such as extreme optimizations, note discussion conclusions for future reference after a code review, or some additional explanations in domain-specific knowledge.

The problem is that _Comments_ are generally smelly, as I have mentioned. This is because they are a deodorant for other smells [[2](#sources)]. They may also quickly degrade with time and become another category of comments [Fallacious Comments](./fallacious-comment.md), which are a rotten, misleading subcategory of [_"What" Comments_].

### Causation

The author sees that the code is confusing and tries to be helpful by adding explanations.

### Problems

#### **Duplication**

Bad docstrings, which are just duplicating everything that can be understood from the method name and parameter names & type annotations, are cluttering the code, possibly sooner or later on the first occasion, they might become [Fallacious Comments](./fallacious-comment.md).

#### **Cover up for other smells**

A comment that must explain what is happening in the code indicates that it can't speak for itself, which is a strong indicator of present code smells.

### Examples

<div class="example-block">

_"What" Comment_ as a Grouping Label

#### Smelly

```py
class Foo:
    def run(...):
        ...

        # Creating Report
        vanilla_report = get_vanilla_report(...)
        tweaked_report = tweaking_report(vanilla_report)
        final_report = format_report(tweaked_report)

        # Sending Report
        send_report_to_headquarters_via_email(final_report)
        send_report_to_developers_via_chat(final_report)
        ...

```

#### Solution

```py
class Foo:
    def run(...):
        ...

        report = self.create_report(...)
        self.send_report(report)


    def create_report(self, ...):
        vanilla_report = get_vanilla_report(...)
        tweaked_report = tweaking_report(vanilla_report)
        return format_report(tweaked_report)

    def send_report(self, report):
        send_report_to_headquarters_via_email(final_report)
        send_report_to_developers_via_chat(final_report)
        ...
```

</div>

<div class="example-block">

_"What" Comment_ as a cover for [Uncommunicative Name](./uncommunicative-name.md) code smell.

#### Smelly

```py

def get_gross_value(p, t):
    """
    params
     - price: float
     - tax: float
    """
    ...

```

#### Solution

```py
def get_gross_value(price: float, tax: float):
    ...
```

</div>

<div class="example-block">

_"What" Comment_ as a cover for [Uncommunicative Name](./uncommunicative-name.md) code smell.

#### Smelly

Example of useless comment as a docstring.

```py
def increase_attack(self, value: int):
    """ Increases attack by the given value.

    params:
      - value: integer
    """
    self.attack += value
```

#### Counter example

Example of more useful comment as a docstring.

```py
def destroy_character(character_id: int):
    """
    Removes the character from the main game world scene
    if it's present, otherwise throws a warning (character
    could be removed due to some other trigger event).
    """
```

#### Solution

The only counter indication for removing the docstring, would be when poor auto-documentation requirements are enforced.

```py
def increase_attack(self, value: int):
    self.attack += value
```

</div>

### Refactoring:

- Extract Method
- Rename Method
- Introduce Assertion

---

##### Sources

- [[1](#sources)], [Parentage2] - William C. Wake, _"Refactoring Workbook"_ (2004)
- [[2](#sources)], [Parentage1] - Martin Fowler, _"Refactoring: Improving the Design of Existing Code"_ (1999)
- [Origin] - Marcel Jerzyk, _"Code Smells: A Comprehensive Online Catalog and Taxonomy"_ (2022)
