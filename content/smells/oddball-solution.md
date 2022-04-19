---
slug: "oddball-solution"
meta:
  last_update_date: 2022-04-19
  title: "Oddball Solution"
  cover: "/logos/logo-text-2560x1280.png"
  known_as:
    - Inconsistent Solution
categories:
  expanse: "Between"
  obstruction:
    - Bloaters
  occurrence:
    - Duplication
  tags:
    - ---
  smell_hierarchies:
    - Code Smell
relations:
  related_smells:
    - name: Duplicated Code
      slug: duplicated-code
      type:
        - co-exist
    - name: Alternative Classes with Different Interfaces
      slug: alternative-classes-with-different-interfaces
      type:
        - family
    - name: Dubious Abstraction
      slug: dubious-abstraction
      type:
        - caused
    - name: Shotgun Surgery
      slug: shotgun-surgery
      type:
        - causes
problems:
  general:
    - Increased Complexity
    - Duplication
  violation:
    principles:
      - ---
    patterns:
      - ---
refactors:
  - Unify Interfaces with Adapter
history:
  - author: "Joshua Kerievsky"
    type: "origin"
    named_as:
      - Oddball Solution
    regarded_as:
      - Code Smell
    source:
      year: 2005
      authors:
        - Joshua Kerievsky
      named_as: "Oddball Solution"
      name: "Smells to Refactorings Cheatsheet"
      type: "cheatsheet"
      href:
        direct_url: "https://www.industriallogic.com/img/blog/2005/09/smellstorefactorings.pdf"
---

## Oddball Solution

If a similar problem is solved differently in different parts of the project, it is an Oddball Solution. This code smell could also have been classified under [Duplicated Code](./duplicated-code.md), although it is not exactly a one-to-one copy-paste - it is more subtle [[1](#sources)].

### Causation

This smell often occurs when there is some recognized method of calling a set of classes whose interfaces are not uniform.

### Problems

#### **Increased Complexity**

There should be one way to deal with the problem throughout the project. There is no reason to keep two ways of dealing with one problem - just use the better one.

#### **Duplication**

### Examples

<div class="example-block">

#### Smelly

```py
class Instrument:
    ...

class USB2(Instrument):
    def __init__(self, ip, port):
        connection = socket.new_connection(f"{ip}:{port}")
        ...

    def ask(self, command):
        ...
        self.connection.query(command)


class USB3(Instrument):
    def __init__(self, address):
        connection = socket.new_connection(address)
        ...

    def read(self, command):
        ...
        self.connection.query(command)
```

#### Solution

```py
class SocketAdapter:
    def __init__(self, ip, port):
        connection = socket.new_connection(f"{ip}:{port}")
        ...

    def query(self, command):
        ...

class Instrument:
    connection: SocketAdapter
    ...

class USB2(Instrument):
    def __init__(self, ip, port):
        self.connection = SocketAdapter(ip, port)
        ...


class USB3(Instrument):
    def __init__(self, ip, port):
        self.connection = SocketAdapter(ip, port)
        ...

```

</div>

### Refactoring:

- Unify Interfaces with Adapter

---

##### Sources

- [[1](#sources)], [Origin] - Joshua Kerievsky, _"Refactoring to Patterns"_ (2005)
