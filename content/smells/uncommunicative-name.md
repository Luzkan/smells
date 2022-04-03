---
slug: "uncommunicative-name"
meta:
  last_update_date: 2022-02-26
  title: "Uncommunicative Name"
  cover: "/logos/logo-text-2560x1280.png"
  known_as:
    - Mysterious Name
    - Function Names Should Say What They Do
    - Choose Descriptive Names
    - Ambiguous Name
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
relations:
  related_smells:
    - name: Magic Number
      slug: magic-number
      type:
        - family
    - name: Boolean Blindness
      slug: boolean-blindness
      type:
        - family
    - name: Type Embedded In Name
      slug: type-embedded-in-name
      type:
        - co-exist
    - name: Obscured Intent
      slug: obscured-intent
      type:
        - causes
    - name: '"What" Comment'
      slug: what-comment
      type:
        - causes
problems:
  general:
    - Comprehensibility
  violation:
    principles:
      - Law of Demeter
    patterns:
      - ---
refactors:
  - Change Method Declaration
  - Rename Variable
  - Rename Field
history:
  - author: "William C. Wake"
    type: "origin"
    named_as:
      - Uncommunicative Name (Names)
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

## Uncommunicative Name

The name should convey meaning and of course meaning which preferably is not misleading ([Fallacious Method Name](./fallacious-method-name.md)). Descriptive names can save countless amount of time if they are good enough, just like a good abstract in a scientific article. Code should be as expressive as possible [[1](#sources)]. In the "Clean Code" by Robert Martin, this smell is "shredded" to five very descriptive smells and recommendations which underline the importance of having "good labels" [[2](#sources)]:

- [Obscured Intent](./obscured-intent.md),
- Function Names Should Say What They Do,
- Choose Descriptive Names,
- Unambiguous Names,
- Names Should Describe Side-Effects

Martin Fowler added this smell under the name of _"Mysterious Name"_ in his 3rd edition of Refactoring book, saying that good name, with a lot of thought put into its definition, can save hours of incomprehensibility issues later. He says, that names should clearly communicate what they do and how to use them.

### Causation

People tend to not get back to the name of the variables or methods they have already declared. Usually it is the best they can come up with at the declaration moment, but maybe, later on, there could have been a much better name for the thing thought off. The names could also be just too short and the developer could be afraid of making it longer and thus cutting off the meaning potential.

### Problems

#### **Comprehensibility**

Good names are one of the most important factors that contribute to the Clean Code feeling. If developer can not relay on the naming of variables, methods and classes, it drastically reduced his ability to understand everything as a whole.

### Examples

<div class="example-block">

#### Smelly

```py
data = m1.get_f()
data_2 = m2.get_f()

value = data_2['dmg'] * data['def']
val = math.rand(value-3, value+3)
```

#### Solution

```py
def wobble_the_value(value: int, wobble_by: int):
    """ Adds tiny bit of randomness to the output """
    return math.rand(value-wobble_by, value+wobble_by)

attack_information: FightingInformation = attacking_minion.get_fighting_information()
defense_information: FightingInformation = defending_minion.get_fighting_information()

calculated_damage: int = attack_information.damage * defense_information.defense
final_damage_dealt: int = wobble_the_value(calculated_damage, wobble_by=3)
```

</div>

### Refactoring:

- Change Method Declaration
- Rename Variable
- Rename Field

##### Sources

- [[1](#sources)] - Robert Martin, _"Clean Code: A Handbook of Agile Software Craftsmanship"_ (2008)
- [[2](#sources)] - Eessaar, E., Käosaar, E., +"On finding model smells based on code smells"_ (2018)
- [Origin] - William C. Wake, _"Refactoring Workbook"_ (2004)
