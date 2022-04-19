---
slug: "long-parameter-list"
meta:
  last_update_date: 2022-04-19
  title: "Long Parameter List"
  cover: "/logos/logo-text-2560x1280.png"
  known_as:
    - ---
categories:
  expanse: "Within"
  obstruction:
    - Bloaters
  occurrence:
    - Measured Smells
  tags:
    - ---
  smell_hierarchies:
    - Antipattern
    - Code Smell
    - Design Smell
    - Implementation Smell
relations:
  related_smells:
    - name: Long Method
      slug: long-method
      type:
        - co-exist
    - name: Message Chain
      slug: message-chain
      type:
        - co-exist
    - name: Large Class
      slug: large-class
      type:
        - causes
    - name: Flag Arguments
      slug: flag-argument
      type:
        - caused
    - name: Temporary Field
      slug: temporary-field
      type:
        - caused
    - name: Global Data
      slug: global-data
      type:
        - antagonistic
problems:
  general:
    - Reusability
    - Increased Complexity
  violation:
    principles:
      - Single Responsibility
    patterns:
      - ---
refactors:
  - Replace Parameter with Query
  - Preserve the Whole Object
  - Introduce Parameter Object
  - Remove Flag Argument
  - Combine Methods into Class
history:
  - author: "Martin Fowler"
    type: "origin"
    named_as:
      - Long Parameter List
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

## Long Parameter List

This is another code smell at the same abstraction level as [Long Method](./long-method.md) which usually occurs when three, four, or more parameters are given as input for a single method. Basically, the longer the parameter list, the harder it is to understand.

### Causation

In an attempt to generalize a routine with multiple variations, a developer could have passed too many parameters at one point. Another causation could be due to ignorance of the object relationship between other objects, and thus, instead, calling in all the entities via parameters [[1](#sources)].

### Problems:

#### **Hard to Use**

Usage of a method with many parameters requires more knowledge to use it.

#### **Increased Complexity**

The input value is highly inconsistent, which creates too much variety in what might happen throughout the execution.

#### **Single Responsibility Principle Violation**

When there are too many parameters, most likely, the method tries to do too many things or has too many reasons to change.

### Example

<div class="example-block">

#### Smelly

```py
def foo(author: str, commit_id: str, files: List[str], sha_id: str, time: str):
    ...

author, commit_id, files, sha_id, time = get_last_commit()
foo(author, commit_id, files, sha_id, time)
```

#### Solution

```py
@dataclass(frozen=True)
class Commit:
    author: str
    commit_id: str
    files: List[str]
    sha_id: str
    time: str

    def foo(self):
        ...

commit = Commit(**get_last_commit())
commit.foo()
```

</div>

### Refactoring:

- Replace Parameter with Query
- Preserve the Whole Object
- Introduce Parameter Object
- Remove Flag Argument
- Combine Methods into Class

---

##### Sources

- [[1](#sources)] - William C. Wake, _"Refactoring Workbook"_ (2004)
- [Origin] - Martin Fowler, _"Refactoring: Improving the Design of Existing Code"_ (1999)
