---
slug: "imperative-loops"
meta:
  last_update_date: 2022-04-19
  title: "Imperative Loops"
  cover: "/logos/logo-text-2560x1280.png"
  known_as:
    - Explicitly Indexed Loops
    - Indexed Loops
    - Loops
categories:
  expanse: "Within"
  obstruction:
    - Functional Abusers
  occurrence:
    - Unnecessary Complexity
  tags:
    - ---
  smell_hierarchies:
    - Code Smell
relations:
  related_smells:
    - name: Conditional Complexity
      slug: conditional-complexity
      type:
        - causes
    - name: Temporary Field
      slug: temporary-field
      type:
        - causes
    - name: Flag Arguments
      slug: flag-argument
      type:
        - causes
    - name: Obscured Intent
      slug: obscured-intent
      type:
        - causes
    - name: Status Variable
      slug: status-variable
      type:
        - causes
problems:
  general:
    - Readability
    - Increased Complexity
  violation:
    principles:
      - ---
    patterns:
      - ---
refactors:
  - Replace Loop with Pipeline
  - Replace Loop with built-in
history:
  - author: "Marcel Jerzyk"
    type: "origin"
    named_as:
      - Imperative Loops
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
  - author: "Martin Fowler"
    type: "parentage"
    named_as:
      - Loops
    regarded_as:
      - Code Smell
    source:
      year: 2018
      authors:
        - Martin Fowler
      name: "Refactoring: Improving the Design of Existing Code"
      named_as: "Loops"
      regarded_as: "Code Smell"
      type: "book"
      href:
        isbn_13: "978-0201485677"
        isbn_10: "0201485672"
---

## Imperative Loops

Martin Fowler has the feeling that loops are an outdated concept. He already mentioned them as an issue in his first edition of "Refactoring: Improving the design of existing code" book, although there were no better alternatives at that time. [[1](#sources)] Nowadays, languages provide an alternative - pipelines. Fowler, in his 2018 book (third edition), suggests that anachronistic loops should be replaced by pipeline operations such as `filter`, `map`, or `reduce` [[2](#sources)].

Indeed, loops can sometimes be hard to read and error-prone. This might be unconfirmed, but I doubt the existence of a programmer who has never had an `IndexError` at least once before. The recommended approach would be to avoid explicit iterator loops and use the `forEach` or `for-in`/`for-of-like` loop that takes care of the indexing, or `Stream` pipes. Still, one should consider whether he is not about to write [Clever Code](./clever-code.md) and check if there is already a built-in function that will take care of the desired operation.

I would abstain from specifying all the loops as code smells. Loops have always been and probably are still going to be a fundamental part of programming. Modern languages offer very tidy approaches to loops and even things like a List Comprehension in [Haskell](https://wiki.haskell.org/List_comprehension) or [Python](https://docs.python.org/3/tutorial/datastructures.html). It is the indexation part might be the main problem. Of course, so are long loops or loops with side effects, but these are just a part of [Long Method](./long-method.md) or [side effects](./side-effects.md) code smells.

However, it is worth taking what is good from functional languages (such as `streams` or the immutability of the data) and implement those as widely as possible and conveniently, to increase the reliability of the application.

### Causation

It is impossible to easily overwrite the information given in the old books or video tutorials, which was pretty standard due to the lack of any other alternatives. People have learned that type of looping and may not even suspect that there are alternatives until they find them. Similarly, developers who come from older languages, which do not yet offer such facilities, can use explicit iteration habitually.

### Problems

#### **Readability**

In contrast to pipelines, loops don't provide declarative readability of what is precisely being processed.

### Example

<div class="example-block">

#### Smelly

Explicitly Indexed Loop

```js
const examples = ["foo", "bar", "baz"]
for (let idx = 0; idx < examples.length; idx++) {
  console.log(examples[idx])
}
```

#### Solution

Handsome `forEach` Loop ("`For-In Loop`" / "`For-Of Loop`")

```js
const examples = ["foo", "bar", "baz"]
examples.forEach((example) => console.log(example))
```

</div>

<div class="example-block">

#### Smelly

[Clever Code](./clever-code.md), [Flag](./flag-argument.md) and Explicit Iterator Loop

```js
const examples = ["foo", "bar", "baz"]
let bar_in_examples = false
for (let idx = 0; idx < examples.length; idx++) {
  if (examples[idx] == "bar") {
    bar_in_examples = true
  }
}
console.log(bar_in_examples) // true
```

#### Solution

Built-In function instead

```js
const examples = ["foo", "bar", "baz"]
console.log(examples.includes("foo")) // true
```

</div>

### Refactoring:

- Replace Loop with Pipeline
- Replace Loop with built-in

---

##### Sources

- [[1](#sources)], [Parentage] - Marin Fowler, "Refactoring: Improving the Design of Existing Code" (1999)
- [[2](#sources)] - Marin Fowler, "Refactoring: Improving the Design of Existing Code (3rd Edition)" (2018)
- [Origin] - Marcel Jerzyk, _"Code Smells: A Comprehensive Online Catalog and Taxonomy"_ (2022)
