---
slug: 'callback-hell'
meta:
  last_update_date: 2022-04-19
  title: 'Callback Hell'
  description: 'Nested callbacks indented so deep the closing brackets cascade like a staircase to nowhere. The actual logic hides somewhere around indent level five.'
  known_as:
    - Hierarchy of Callbacks
    - Pyramid of Doom
categories:
  expanse: 'Within'
  obstruction:
    - Change Preventers
  occurrence:
    - Conditional Logic
  tags:
    - ---
  smell_hierarchies:
    - Code Smell
relations:
  related_smells:
    - name: Conditional Complexity
      slug: conditional-complexity
      type:
        - family
problems:
  general:
    - Comprehensibility
  violation:
    principles:
      - Inversion of Control
    patterns:
      - ---
refactors:
  - Extract Methods
  - Use Asynchronous Functions
  - Use Promises
history:
  - author: 'Marcel Jerzyk'
    type: 'origin'
    named_as:
      - Callback Hell
    regarded_as:
      - Code Smell
    source:
      year: 2023
      authors:
        - Marcel Jerzyk
      name: 'Code Smells: A Comprehensive Online Catalog and Taxonomy'
      type: 'paper'
      href:
        direct_url: 'https://doi.org/10.1007/978-3-031-25695-0_24'
---

## Callback Hell

Smell with a scent similar to the [Conditional Complexity](./conditional-complexity.md), where tabs are intended deep, and the curly closing brackets can cascade like a Niagara waterfall.

The callback is a function that is passed into another function as an argument that is meant to be executed later. One of the most popular callbacks could be the `addEventListener` in JavaScript.

Alone in separation, they are not causing or indicating any problems. Instead, the long list of chained callbacks is something to watch out for. More professionally, this could be called a _Hierarchy of Callbacks_ but _(fortunately)_, it has already received a more exciting and recognizable name. There are many solutions to this problem: `Promises`, `async` functions, or splitting the significant function into separate methods.

### Problems:

#### Comprehensibility

Long and deep nested methods are challenging to read and maintain.

#### Inversion of Control Violation

One shouldn't give up control of how things are used.

### Example

<div class="example-block">

#### Smelly

```js
const makeSandwich = () => {
  ...
  getBread(function(bread) {
    ...
    sliceBread(bread, function(slicedBread) {
      ...
      getJam(function(jam) {
        ...
        brushBread(slicedBread, jam, function(smearedBread) {
          ...
        });
      });
    });
  });
};
```

#### Solution

```js
const getBread = doNext => {
  ...
  doNext(bread);
};

const sliceBread = doNext => {
  ...
  doNext(breadSlice);
};

...

const makeSandwich = () => {
  return getBread()
    .then(bread => sliceBread(bread))
    .then(jam => getJam(jam))
    .then(slicedBread, jam => brushBread(slicedBread, jam));
};
```

</div>

### Refactoring:

- _Extract Methods_
- _Use Asynchronous Functions_
- _Use Promises_

---

##### Sources

- [Origin] - Marcel Jerzyk, _"Code Smells: A Comprehensive Online Catalog and Taxonomy"_ (2022)
