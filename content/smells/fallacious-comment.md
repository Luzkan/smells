---
slug: "fallacious-comment"
meta:
  last_update_date: 2022-02-21
  title: "Fallacious Comment"
  cover: "/logos/logo-text-2560x1280.png"
  known_as:
    - Comment
    - Attribute Signature and Comment are Opposite
    - Method Signature and Comment are Opposite
categories:
  expanse: "Within"
  obstruction:
    - Lexical Abusers
  occurrence:
    - Names
  tags:
    - ---
  smell_hierarchies:
    - Code Smell
    - Linguistic Antipattern
relations:
  related_smells:
    - name: '"What" Comment'
      slug: what-comment
      type:
        - family
    - name: "Fallacious Method Name"
      slug: fallacious-method-name
      type:
        - family
    - name: "Duplicated Code"
      slug: duplicated-code
      type:
        - caused
problems:
  general:
    - Decreased Readability
  violation:
    principles:
      - ---
    patterns:
      - ---
refactors:
  - Remove Inconsistency
history:
  - author: "Marcel Jerzyk"
    type: "origin"
    named_as:
      - Fallacious Comment
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
  - author: "Venera Arnaoudova"
    type: "parentage"
    named_as:
      - Attribute and Comment are Opposite
      - Method Signature and Comment are Opposite
    regarded_as:
      - Linguistic Antipattern
    source:
      year: 2015
      authors:
        - Venera Arnaoudova
        - Massimiliano Di Penta
        - Giuliano Antoniol
      name: "Linguistic Antipatterns: What they are and how developers perceive them"
      type: "paper"
      href:
        journal: "Empirical Software Engineering"
        pages: "104--158"
        publisher: "Springer"
        year: 2016
        volume: 21
        number: 1
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

## Fallacious Comment

_Comments_ differ from most of the other syntaxes available in a programming languages; it is not executed. This might cause situations where, after code rework, the comments around it were left intact and no longer true to what they described. This should not even happen in the first place, as valid comments from the _**"Why"** Comment_ family are not susceptible to this kind of situation. If the comment explained **"what"** was happening, then it will be relevant as long as the code it explains is left intact. Of course, ["What" Comments](./what-comment.md) are a Code Smell themselves, and so is [Duplicated Code](./duplicated-code.md).

In real-life scenarios, this might generally happen within docstrings, which can usually be found in methods exposed to other users.

### Causation

The developer was in hurry and did not double check that everything is up to date after the changes. He could also be reaffirmed by a passing unit test - there is no practical automated way to check for correctness of comments/docstrings.

### Problems

#### Decreased Readability

Developer does not know whether he should trust the methods signature or comment.

### Example

<div class="example-block">

_["What" Comment](./what-comment.md)_ and _Fallacious Comment_.

#### Smelly

```py
def rename_description(product, manufacturer):
    """
    Adds the manufacturer footer to the
    products description.
    """
    ...


```

#### Solution

```py
def add_manufacturer_footer_to_product_description(product, manufacturer):
    ...
```

</div>

### Refactoring:

- Remove Inconsistency

---

##### Sources

- [Origin] - Marcel Jerzyk, _"Code Smells: A Comprehensive Online Catalog and Taxonomy"_ (2022)
- [Parentage1] - Venera Arnaoudova, Massimiliano Di Penta, Giuliano Antoniol _"Linguistic Antipatterns: What they are and how developers perceive them"_ (2015)
- [Parentage2] - Marin Fowler, _"Refactoring: Improving the Design of Existing Code"_ (1999)
