---
slug: "afraid-to-fail"
meta:
  last_update_date: 2022-04-19
  title: "Afraid To Fail"
  cover: "/logos/logo-text-2560x1280.png"
  known_as:
    - ---
categories:
  expanse: "Within"
  obstruction:
    - Couplers
  occurrence:
    - Responsibility
  tags:
    - ---
  smell_hierarchies:
    - Code Smell
    - Implementation Smell
relations:
  related_smells:
    - name: Null Check
      slug: null-check
      type:
        - causes
    - name: Required Setup or Teardown Code
      slug: required-setup-or-teardown-code
      type:
        - causes
problems:
  general:
    - Code Pollution
    - Coupling
  violation:
    principles:
      - Fail Fast
    patterns:
      - Null Object
refactors:
  - Move Method
history:
  - author: "Marcel Jerzyk"
    type: "origin"
    named_as:
      - Afraid To Fail
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

## Afraid To Fail

The _Afraid To Fail_ is a Code Smell name inspired by the common fear (at least among students [[1](#sources)]) of failure, which is professionally called _Atychiphobia_ [[48](#sources)] - being scared of failure.

I am referencing it here because the fear of admitting failure (that something went wrong) is a common, relatable, psychological trait, and facing that fear would benefit everyone. It is not a good idea to hope that maybe someone will get away with it. Undoubtedly, maybe even more often than not, that would be the case, but the more things stack up on that lack of honesty, the harder it will eventually hit if it ever gets discovered.

In programming, this behavior will clutter the code because, after a method or function call, additional code is required to check whether some status code is valid, a boolean flag is marked, or the returned value is not `None`. And all of that is outside of the method scope.

If it is expected that a method might fail, then it should fail, either by throwing an `Exception` or, if not - it should return a special case `None`/`Null` type object of the desired class (following the **Null Object Pattern**), not null itself. For example, if an expected object cannot be received or created, and instead of some status indicator is sent back (which has to be checked after the method is completed), the smells it generates would be [_Afraid to Fail_](./afraid-to-fail.md) as well as [_Teardown Code_](./required-setup-or-teardown-code.md) Code Smell. Instead, following the **Fail Fast Principle**, the code should throw an error.

### Problems:

#### Code Pollution

Require additional `if` checks for return status or `null` checks.

#### Coupling

Creates artificial coupling with the method caller.

#### Fail Fast Violation

In system design, the Fail Fast concept is about reporting immediately when any condition is likely to indicate failure.

### Example

<div class="example-block">

#### Smelly:

Returning Status Code, which has to be checked eventually whether it succeeded

```py
def create_foo() -> dict:
    response = requests.get('https://api.github.com/events')
    if response.status_code != requests.codes.ok:
        return {'status_code': response.status_code, 'foo': None}
    return {
        'status_code': response.status_code,
        'foo': Foo(**response.json())
    }

foo_response: dict = create_foo()
if foo['status_code'] != requests.codes.ok:
    foo: Foo = foo_response['foo']
...
```

#### Solution:

Immediately throw an exception if the expected result from the function will not be achieved

```py
def create_foo() -> Foo:
    response = requests.get('https://api.github.com/events')
    if response.status_code != requests.codes.ok:
        raise Exception('Something went wrong')
    return Foo(**response.json())

foo: Foo = create_foo()
...
```

</div>

### Refactoring:

- Move Method

---

##### Sources

- [[1](#sources)] - De Castella, K., Byrne, D., Covington, M., "Unmotivated or motivated to fail? a cross-cultural study of achievement motivation, fear of failure, and student disengagement" (2013)
- [[2](#sources)] - Rowa, K., "Atychiphobia (fear of failure), Phobias: The Psychology of Irrational Fear: The Psychology of Irrational Fear". (2015)
