---
slug: "type-embedded-in-name"
meta:
  last_update_date: 2022-02-27
  title: "Type Embedded in Name"
  cover: "/logos/logo-text-2560x1280.png"
  known_as:
    - Attribute Name and Attributes Type are Opposite
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
    - Linguistic Smell
relations:
  related_smells:
    - name: Primitive Obsession
      slug: primitive-obsession
      type:
        - co-exist
    - name: Uncommunicative Name
      slug: uncommunicative-name
      type:
        - co-exist
    - name: Duplicated Code
      slug: duplicated-code
      type:
        - causes
problems:
  general:
    - Duplication
    - Comprehensibility
  violation:
    principles:
      - Law of Demeter
    patterns:
      - ---
refactors:
  - Extract Class
  - Rename Method
  - Rename Variable
history:
  - author: "William C. Wake"
    type: "origin"
    named_as:
      - Type Embedded in Name
    regarded_as:
      - Code Smell (Names)
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

## Type Embedded in Name

Whenever a variable has an explicit type prefix or suffix, it can strongly signal that it should really be just a class of its own. For example, `current_date = "2021-14-11"`, embeds the potential class `Date` in the name of a variable, and that could also be classified as the [Primitive Obsession](./primitive-obsession.md) code smell.

Wake signals that the embedded type could also be in the method names, giving an example of a `schedule.add_course(course)` function in contrast to `schedule.add(course)`. He notes that it could have been just a matter of preference, although he insists that this can be a problem wherever some generalization will occur [[1](#sources)]. When a parent class for `Course` is introduced, to cover not only _courses_, but also _series of courses_, then `add_course()` has a name that is no longer appropriate, thus suggesting the usage of more neutral names. [[1](#sources)] Parameters of a method are part of the method name, and this kind of naming is also a duplication.

With all the possibilities of annotating variables, it is unnecessary to mention it twice through variable name when type annotation or type hinting is present. Names with embedded types in them, for which there is no class yet that could represent them, are good candidates to be refactored into separate classes.

### Causation

This was a standard in pointer-based languages, but it is not useful in modern Object-Oriented Programming languages. [[1](#sources)]

### Problems

#### **Duplication**

Both the argument and name mentions the same type.

#### **Comprehensibility Issues**

If the name of a variable is just exactly the name of the class, it's a case of [Uncommunicative Name](./uncommunicative-name.md).

### Examples

<div class="example-block">

#### Smelly

```py
player_name: str = "Luzkan"
player_health: int = 100
player_stamina: int = 50
player_attack: int = 7
```

#### Solution

```py
@dataclass
class Player:
    stamina: int
    health: int
    attack: int
    name: str

luzkan = Player(
    name="Luzkan"
    health=100,
    stamina=50,
    attack=7,
)

```

</div>

<div class="example-block">

#### Smelly

```py
datetime = datetime.datetime.now()
foo()
datetime_2 = datetime.datetime.now()


```

#### Solution

```py
foo_bench_start_time = datetime.datetime.now()
foo()
foo_bench_end_time = datetime.datetime.now()
```

</div>

### Refactoring:

- Extract Class
- Rename Method
- Rename Variable

---

##### Sources

- [[1](#sources)], [Origin] - William C. Wake, _"Refactoring Workbook"_ (2004)
