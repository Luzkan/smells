---
slug: "obscured-intent"
meta:
  last_update_date: 2022-04-19
  title: "Obscured Intent"
  cover: "/logos/logo-text-2560x1280.png"
  known_as:
    - ---
categories:
  expanse: "Between"
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
    - name: Clever Code
      slug: clever-code
      type:
        - family
    - name: Uncommunicative Name
      slug: uncommunicative-name
      type:
        - caused
    - name: Magic Number
      slug: magic-number
      type:
        - caused
    - name: Region
      slug: region
      type:
        - caused
    - name: Loops
      slug: loops
      type:
        - caused
    - name: Complicated Boolean Expression
      slug: complicated-boolean-expression
      type:
        - caused
    - name: Primitive Obsession
      slug: primitive-obsession
      type:
        - caused
    - name: Vertical Separation
      slug: vertical-separation
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
  - Remove the Code Smells
history:
  - author: "Robert C. Martin"
    type: "origin"
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

## Obscured Intent

The [Obscured Intent](./obscured-intent.md) Code Smell, initially proposed by Robert Martin in _"Clean Code"_ [[37](#sources)]), is cross-smelly with other smells in the **Obfuscators** category. When [Uncommunicative Names](./uncommunicative-name.md)/[Numbers](./magic-number.md) are placed within a [Vertically Separated Space](./vertical-separation.md) hiding an [Imperative Loop](./imperative-loops.md) with a ["What" Comment](./what-comment.md) explanation on top of that, then the [Obscured Intent](./obscured-intent.md) is going to be caught quite easily by intuition or by metrics of other smells.

The code should be as expressive as possible [[1](#sources)]). Robert Martin gives an example of an utterly unreadable [overtime function](#Obscured-Intent) noting that even if the code is small and compact, it may still be tragic. In this case, correcting the [Uncommunicative Names](./uncommunicative-name.md)/[Numbers](./magic-number.md) would probably do the trick to make that snippet of code much more fragrant.

There is a famous real-world example of an Obscured Intent. In the _Quake 3: Arena_ [fast inverse square root](#example-1), the problem is with the [Uncommunicative Naming](./uncommunicative-name.md), ["What" Comments](./what-comment.md), [Dead Code](./dead-code.md), and [Magic Numbers](./magic-number.md). I will also point out that games have a slightly different specificity for their industry. Usually, the code out there is very confusing, and priorities are not put on things such as reusability, so there is a lot to explore.

### Causation

Sometimes, a developer can forget that something that seems evident to him is not as clear to other developers. There may also be cases where the developer intentionally compacts the code to appear brighter by making it more mysterious.

### Problems

#### **Comprehensibility Issues**

Code does not convey meaning and thus is not understandable. It may be a considerable time waste if someone ever has to touch parts of the code that interact with an _obscure intent_ piece of code.

### Example

<div class="example-block">

#### Smelly

An example given by Robert Martin.

```py
def m_ot_calc() -> int:
    return i_ths_wkd * i_ths_rte \
        + round(0.5 * i_ths_rte *
        max(0, i_ths_wkd - 400))
```

</div>

<div class="example-block">

#### Smelly

Quake 3 Arena Fast Inverse Square Root

```c++
float Q_rsqrt( float number )
{
        long i;
        float x2, y;
        const float threehalfs = 1.5F;

        x2 = number * 0.5F;
        y  = number;
        i  = * ( long * ) &y;                       // evil floating point bit level hacking
        i  = 0x5f3759df - ( i >> 1 );               // what the f*ck?
        y  = * ( float * ) &i;
        y  = y * ( threehalfs - ( x2 * y * y ) );   // 1st iteration
//      y  = y * ( threehalfs - ( x2 * y * y ) );   // 2nd iteration, this can be removed

        return y;
}
```

</div>

### Refactoring

- Remove the code smells that cause _Obscure Intent_

---

##### Sources

- [[1](#sources)], [Origin] - Robert C. Martin, _"Clean Code: A Handbook of Agile Software Craftsmanship"_ (2008)
