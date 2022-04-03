---
slug: "complicated-regex-expression"
meta:
  last_update_date: 2022-02-20
  title: "Complicated Regex Expression"
  cover: "/logos/logo-text-2560x1280.png"
  known_as:
    - ---
categories:
  expanse: "Within"
  obstruction:
    - Obfuscators
  occurrence:
    - Names
  tags:
    - ---
  smell_hierarchies:
    - Code Smell
relations:
  related_smells:
    - name: Complicated Boolean Expression
      slug: complicated-boolean-expression
      type:
        - family
    - name: Clever Code
      slug: clever-code
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
  - Extract Method
  - Extract Variable
history:
  - author: "Marcel Jerzyk"
    type: "origin"
    named_as:
      - Complicated Regex Expression
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
---

## Complicated Regex Expression

There are two bad things that one can do that I will refer as _Complicated Regex Expression_. First and foremost - the unnecessary use of Regular Expressions for simple tasks. Regex falls into the same pitfall as [Complicated Boolean Expressions](./complicated-boolean-expression.md) only that the human population it affects is much larger - there is definitely more people who will quickly catch the meaning behind by the boolean logic, but far less can read through a Regex as if it was a book. If it's not necessary, or in "measurable words", if the set of code that can validate a string will take more time to be understand by others than its equivalent made with regular expressions then it should be avoided.

The second thing is that we would like to have an explainable things possibly at all levels of abstraction. This means, that it is preferable to have properly named class, with properly named methods and thus also the long strings interpolated with properly named variables. Regular expression should be no exception to the rule. This little change comes with increased understandability, although potentially sacrificing the possibility of copy-pasting the regex into an one of the online tools for regex decompositions. This can be mitigated by adding the "compiled" regex output in a comment or docstring (but then - it has to be kept updated along with the method, which is smelly).

We also have to take into account that there are big, lengthy Regular Expressions, which can be found and copy-pasted from the internet after quick search. When it comes down to this one most up voted answer that has nothing but the regex itself presented by a mystical, yet classy usernamed Stack Overflow account without much comment on it. This was, of course, a joke, but there are common, predefined and work-tested regex for various things like emails, that even though [obscure](./obscured-intent.md), should work just fine as they are. Getting a standardized and verified regular expression is okay, but if one has the urge to create his own for his particular needs, then the care should be taken to break it down nicely, so any other developer does not need to debug collection of squeezed characters.

There are works that are diving deep on this subject and test the Regular Expressions comprehension [[1]](#sources).

### Problems:

#### Comprehensibility

It's easier to read declarative words than to computate logic statements.

### Example

<div class="example-block">

#### Smelly

```py
regex_pattern = '(\W|^)(\w*)\s-\s[0-9]?[0-9]:[0-9][0-9]'
```

#### Solution

```py
def get_regex_pattern_current_city_time() -> str:
    """
    Example Match:
      - `Wroclaw - 17:42`
      - `Berlin - 17:42`
      - `San Jose - 10:42`

    Compiled: (\W|^)(\w*)\s-\s[0-9]?[0-9]:[0-9][0-9]
    """
    prevent_excessive_match = '(\W|^)'
    city = '(\w*)'
    indication = '\s-\s'
    hour = '[0-9]?[0-9]'
    minute = '[0-9][0-9]'
    time = f'{hour}:{minute}'
    return f"{prevent_excessive_match}{city}{indication}{time}"
```

</div>

### Refactoring:

- Extract Method
- Extract Variable

---

##### Sources

- [[1](#sources)] - Carl Chapman, Peipei ang, Kathryn Stolee, _"Exploring Regular Expression Comprehension"_ (2017)
- [Origin] - Marcel Jerzyk, _"Code Smells: A Comprehensive Online Catalog and Taxonomy"_ (2022)
