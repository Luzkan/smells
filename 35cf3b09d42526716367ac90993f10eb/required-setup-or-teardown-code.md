---
slug: "required-setup-or-teardown-code"
meta:
  last_update_date: 2022-04-19
  title: "Required Setup or Teardown Code"
  cover: "/logos/logo-text-2560x1280.png"
  known_as:
    - ---
categories:
  expanse: "Between"
  obstruction:
    - Bloaters
  occurrence:
    - Responsibility
  tags:
    - ---
  smell_hierarchies:
    - Code Smell
relations:
  related_smells:
    - name: Afraid To Fail
      slug: afraid-to-fail
      type:
        - caused
    - name: Dubious Abstraction
      slug: dubious-abstraction
      type:
        - caused
    - name: Hidden Dependencies
      slug: hidden-dependencies
      type:
        - caused
    - name: Duplicated Code
      slug: duplicated-code
      type:
        - causes
problems:
  general:
    - Cohesion
  violation:
    principles:
      - ---
    patterns:
      - ---
refactors:
  - Replace Constructor with Factory Method
  - Introduce Parameter Object
history:
  - author: "Steve Smith"
    type: "origin"
    named_as:
      - Required Setup or Teardown Code
    regarded_as:
      - Code Smell
    source:
      year: 2013
      authors:
        - Steve Smith
      name: "Refactoring Fundamentals"
      type: "course"
      href:
        direct_url: "https://www.pluralsight.com/courses/refactoring-fundamentals"
---

## Required Setup or Teardown Code

If, after the use of a class or method, several lines of code are required to:

- set it properly up,
- the environment requires specific actions beforehand or after its use,
- clean up actions are required,

then there is a _Required Setup or Teardown Code_ code smell. Furthermore, this may indicate [improper abstraction level](./dubious-abstraction.md).

### Causation

Some functionality was taken beyond the class during development, and the need for their use within the class itself was overlooked.

### Problems

#### **Lack of Cohesion**

Class can't be reused by itself - it requires extra lines of code outside of its scope to use it.

### Examples

<div class="example-block">

#### Smelly

```py
class Radio:
    def __init__(self, ip, port):
        socket = socket.connection(f"{ip}:{port}")

    ...

radio: Radio = Radio(ip, port)
...
# Doing something with the object
...
# Finalizing its use
radio.socket.shutdown(socket.shut_RDWR)
radio.socket.close()
...
```

#### Solution

```py
class Radio:
    def __init__(self, ip, port):
        socket = socket.connection(f"{ip}:{port}")

    def __del__(self):
        def graceful_shutdown():
            self.socket.shutdown(socket.shut_RDWR)
            self.socket.close()

        graceful_shutdown()
        super().__del__()

    ...

radio: Radio = Radio(ip, port)
...
# Doing something with the object
...
# Finalizing its use no longer requires manual socket closing
...
```

</div>

### Refactoring:

- Replace Constructor with Factory Method
- Introduce Parameter Object

---

##### Sources

- [Origin] - Steve Smith, _"Refactoring Fundamentals"_ (2013)
