---
slug: "fallacious-method-name"
meta:
  last_update_date: 2022-04-19
  title: "Fallacious Method Name"
  cover: "/logos/logo-text-2560x1280.png"
  known_as:
    - '"Set" Method returns'
    - '"Get" Method does not Return'
    - '"Get" Method - More than an Accessor'
    - '"Is" Method - More than a Boolean'
    - Expecting but not getting a collection
    - Expecting but not getting a single instance
    - Not answered question
    - Validation method does not confirm
    - Use Standard Nomenclature Where Possible
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
    - Implementation Smell
    - Linguistic Antipattern
relations:
  related_smells:
    - name: "Fallacious Comment"
      slug: fallacious-comment
      type:
        - family
    - name: "Obscured Intent"
      slug: obscured-intent
      type:
        - family
problems:
  general:
    - Decreased Readability
    - Reduced Reliability
  violation:
    principles:
      - ---
    patterns:
      - ---
refactors:
  - Rename Method
history:
  - author: "Marcel Jerzyk"
    type: "origin"
    named_as:
      - Fallacious Method Name
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
      - '"Set" Method returns'
      - '"Get" Method does not Return'
      - '"Get" Method - More than an Accessor'
      - '"Is" Method - More than a Boolean'
      - Expecting but not getting a collection
      - Expecting but not getting a single instance
      - Not answered question
      - Validation method does not confirm
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
  - author: "Robert C. Martin"
    named_as:
      - Use Standard Nomenclature Where Possible
    regarded_as:
      - "Code Smell (Name)"
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

## Fallacious Method Name

When I started to think of Code Smells from the comprehensibility perspective (of its lack of) as one of the critical factors, I was pretty intrigued that it was not yet thoroughly researched, or at least not when researching with a focus on _"Code Smell"_ as a keyword. There is a grounded idea about code that is obfuscated from the point of [Obscured Intentions](./obscured-intent.md) or code without any explanation ([Magic Number](./magic-number.md), [Uncommunicative Name](./uncommunicative-name.md)). I felt like there was a missing hole in the code that was intentionally too clever ([Clever Code](./clever-code.md)) or the code that contradicts itself. Fortunately, I have found a fantastic article that supports my thoughts and addresses some of what I had in mind under the name _Linguistic Antipatterns_ [[1](#sources)]. I have included their subset of antipatterns under one code smell because listing them one by one would be too granular from a code perspective. The idea behind them can be summarized by one name: _Fallacious Method Name_.

This smell is caused by creating conflicting methods or functions regarding  their functionality and naming. Over the years, programmers have developed connections between certain words and functionality that programmers should tie together. Going against logical expectations by, for example, creating a `getSomething` function that does not return is confusing and wrong.

### Causation

When we create methods, their name may not entirely represent what they will be doing after we finish working on them. Except that one should then go back and correct its name accordingly to what has been done.

### Problems

#### **Decreased Readability**

Developers need to inspect the function or methods to determine what they do.

#### **Reduced Reliability**

If someone would like to use a method with a given name, he should also expect the name's effect.

### Example

<div class="example-block">

#### Smelly

```py
def getFoos() -> Foo:
    ...
    return Foo

def isGoo() -> str:
    ...
    return 'yes'

def setValue(self, value) -> Any:
    ...
    return new_value
```

#### Solution

```py
def getFoos() -> list[Foo]:
    ...
    foos: list[Foo] = ...
    return list[Foo]

def isGoo() -> bool:
    ...
    return True

def setValue(self, value) -> None:
    ...
```

</div>

### Refactoring:

- Rename Method (to remove contradictions)

---

##### Sources

- [Origin] - Marcel Jerzyk, _"Code Smells: A Comprehensive Online Catalog and Taxonomy"_ (2022)
- [Parentage1] - Venera Arnaoudova, Massimiliano Di Penta, Giuliano Antoniol _"Linguistic Antipatterns: What they are and how developers perceive them"_ (2015)
- [Parentage2] - Robert Martin, _"Clean Code: A Handbook of Agile Software Craftsmanship"_ (2008)
