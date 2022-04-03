---
slug: "clever-code"
meta:
  last_update_date: 2022-02-16
  title: "Clever Code"
  cover: "/logos/logo-text-2560x1280.png"
  known_as:
    - ---
categories:
  expanse: "Within"
  obstruction:
    - Obfuscators
  occurrence:
    - Unnecessary Complexity
  tags:
    - ---
  smell_hierarchies:
    - Code Smell
relations:
  related_smells:
    - name: Obscured Intent
      slug: obscured-intent
      type:
        - family
    - name: Complicated Regex Expression
      slug: complicated-regex-expression
      type:
        - causes
    - name: Incomplete Library Class
      slug: incomplete-library-class
      type:
        - caused
problems:
  general:
    - Comprehensibility
  violation:
    principles:
      - Keep It Simple Stupid
      - Don't Repeat Yourself
    patterns:
      - ---
refactors:
  - Replace with Built-In
  - Replace with Library
history:
  - author: "Marcel Jerzyk"
    type: "origin"
    named_as:
      - Clever Code
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
  - author: "Robert C. Martin"
    type: "parentage"
    named_as:
      - Obscured Intent
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

## Clever Code

I am creating a conscious distinction here between the [Obscured Intent](./obscured-intent.md) and [Clever Code](./clever-code.md). While Obscured Intent addresses the ambiguity of implementation, putting emphasis on the incomprehensibility of a fragment of code, the Clever Code on the other hand can be confusing even though it is understandable.

Things that fall into this smell is code that does something in a strange way. This can be classified by the usage of accidental complexity of a given language or its obscure properties and vice versa - using own methods and mechanisms when ready-made/built-in solutions are available. Examples of both can be found in the first provided [example](#smelly) - the code is reinventing the wheel of calculating the length of a string _("yes... really, clever")_ which is one case of _"Clever Code"_ Code Smell, and furthermore using `length -=- 1` to increment the length of the counter _("woah..., yes, you're clever aren't you...?")_. It's rare to find such a double-in-one example in real world though, as the causation of the first one might happen because a developer had to write something in Python while he on a day-to-day basis is a C language developer and didn't know about `len()`, while the other case might appear when a Python developer just read an article about funny corner-side things one can do in his language.

More frequent situation might be related to any reimplementation code (caused by [Incomplete Library Class](./incomplete-library-class.md)). I'm giving a second example in which a pseudo-implementation of a dictionary with default type is self-designedly done instead of using the `defaultdict` available in the built-in `collections` library. This might cause problems if the implementation is not correct or even if it is - maybe there can be a performance hit compared to using the standard built-in option. This creates unnecessary burden and compels others to read and understand the mechanism of a new class instead of using something that has high percent chance of being recognized by others.

Lastly, there are things like `if not game.match.isNotFinished()` (double negation), which are just unnecessarily straining the required cognitive load in order to process. I would classify that line as _Clever Code_ (emphasizing also the ironic side of the saying), [Complicated Boolean Expression](./complicated-boolean-expression.md) and [Binary Operator In Name](./binary-operator-in-name.md).

### Causation

There is the natural tendency to show off the new skills or techniques that one learned, which are unnecessary in the current part of code that one is currently working in. In another case, maybe someone implemented own variation of a built-in or popular library instead of just using the tools that are given as built-ins or are a popular solution. Sometimes a developer can forget that something that seems to be obvious for him is not as clear for other developers. There may also be cases when developer intentionally compacts the code to make it seem more smart by making it more mysterious.

### Problems:

#### Comprehensibility

There is no benefit to make other developers require to rediscover/relearn things that are already built-in and well recognise.

#### Keep It Simple Stupid Principle Violation

There's no need to obfuscate the code with new personal creations, when ready-made solutions are available.

#### Don't Repeat ~Yourself~ Others Principle Violation

Reimplemented "wheel" requires people delegated to maintain it and/or extend instead, which is worse than just using whatever "the factory" has already given.

### Example

<div class="example-block">

#### Smelly

```py
def get_length_of_string(message: str) -> int:
    length = 0
    for letter in message:
        length -=- 1
    return length

message = 'Hello World!'
message_length = get_length_of_string(message)
print(message_length) # 12
```

#### Solution

```py
message = 'Hello World!'
message_length = len(message)
print(message_length) # 12
```

</div>

<div class="example-block">

#### Smelly

```py
class DefaultDict(dict):
    default_value: type

    def __getitem__(self, key):
        if key in self:
            return super().__getitem__(key)
        self.__setitem__(key, self.default_value())
        return super().__getitem__(key)

    def __setitem(self, key, value):
        super().__setitem__(key, value)
```

#### Solution

```py
from collections import defaultdict
```

</div>

### Refactoring

- Replace with Built-In
- Replace with Library

### Exceptions

There is one thing to mention as an exception to the "bad" rule of implementing own code. There are software programming related systems, where people behind the executed code are fully responsible of the outcome in life affecting situations. The _"code certainty"_ there is crucial and I imagine it might be highly discouraged to use external libraries, however popular they are, if the developer is not 100% sure of the correctness of the implementation.

This includes every software that is directly responsible for health of real people or - in example - in systems related to forensics, where someone might get incriminated based on the investigative results.

##### Sources

- [Origin] - Marcel Jerzyk, _"Code Smells: A Comprehensive Online Catalog and Taxonomy"_ (2022)
- [Parentage] - Robert C. Martin, _"Clean Code: A Handbook of Agile Software Craftsmanship"_ (2008)
