---
slug: "callback-hell"
meta:
  last_update_date: 2022-02-16
  title: "Callback Hell"
  cover: "/logos/logo-text-2560x1280.png"
  known_as:
    - Hierarchy of Callbacks
    - Pyramid of Doom
categories:
  expanse: "Within"
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
  - author: "Marcel Jerzyk"
    type: "origin"
    named_as:
      - Callback Hell
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

## Callback Hell

Smell with scent similar to the [Conditional Complexity](./conditional-complexity.md) where tabs are intended deeply and curly closing brackets can cascade like a Niagara Waterfall.

Callback is a function that is passed into another function as an argument meant to be executed later on. One of the most popular callbacks could be the `addEventListener` in JavaScript.

Alone in separation they are not causing or indicating any problems. Rather the long list of callbacks that are chained together is something to watch out for. This could be called more professionally as a _Hierarchy of Callbacks_ but _(fortunately)_, it already received a more interesting and a recognizable name. There are plenty of solutions to this problem, namely: `Promises`, `async` functions or splitting the big function into separate methods.

### Problems:

#### Comprehensibility

Long and deep nested methods are difficult to read and maintain.

#### Inversion of Control Violation

One shouldn't give up the control of how things are used.

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
    .then(jam => getJam(beef))
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
