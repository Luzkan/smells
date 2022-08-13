<div align="center" style="margin-bottom: 30px;">
    <img src="./static/logos/logo-gradient-126.png"/>
    <h2 align="center">Bad Code Smells</h2>
    <div>
        <p style="font-style: italic;">A Comprehensive Online Catalog</p>
        <strong><a href="https://luzkan.github.io/smells/">Visit the Website</a></strong> · <strong><a href="https://github.com/Luzkan/smells/tree/main/docs/paper.pdf">Checkout the Paper</a></strong> · <strong><a href="https://github.com/Luzkan/smells/tree/main/docs/thesis.pdf">Checkout the Thesis</a></strong>
    </div>
</div>

# Table of Contents

1. [What's this?](#whats-this)
2. [How can I use this?](#how-can-i-use-this)
   - Knowledge Browsing
   - Data Extraction
3. [Who is the beneficent?](#who-is-the-beneficent)
   - [New Programmers](#new-programmers)
   - [Developers](#developers)
   - [Researchers](#researchers)
4. [How can I contribute?](#how-can-i-contribute)

---

## **What's this?**

This repository contains the source of the [Code Smell Catalog](https://luzkan.github.io/smells/) website that contains the current list of smells along with their:

- attributes
- categories
- types
- relationships between them
- problems which they cause
- refactoring methods
- history
- examples

---

## **How can I use this?**

### Website

Feel free to visit the [website](https://luzkan.github.io/smells/) and browse around!

### Data

If you would like to scrape the data, clone the repository and run [`python data/data_scraper.py`](./data/data_scraper.py).

---

## **Who is beneficent?**

**Everyone**

### **New Programmers**

New developers can browse the code smell list in a nice, readable form of articles and read about them to get a good intuition of what might be a bad practice or what they should watch out for.

They can find the descriptions of smells, their potential causation example, and table-formatted, higher-abstraction attributes about the particular code smell (like whether it is a smell that happens _within_ a class or _between_ classes). On top of that - the majority of code smells have examples that are often very significant when one is learning about a new thing.

### **Developers**

It's much easier to handle a code review discussion when someone can place a link directly to the source of his concerns. This could benefit and accelerate the understanding of code smell among developers.

A large proportion of developers may even intuitively know about most of these things without knowing about the issue itself as a named phenomenon. This, again, can improve the overall skills of developers.

### **Researchers**

The data and information about smells are scattered around and it's hard to collect every single smell to holistically execute research on them. Currently, as of 2022, the researched data about different smells is drastically disproportionate. Some Code Smells are almost always taken into account, some rarely, and some are not covered by the research at all - either because they were lost in the information noise or because they never occurred with the appropriate keyword.

This catalog is designed to unify the available data, and standardize the nomenclature (synonyms) and the different perspectives (taxonomies) from which this issue can be examined.

## **How can I contribute?**

If you would like to contribute, you are more than welcome by opening a new discussion in the [issues](https://github.com/Luzkan/smells/issues) or directly adding changes by opening new [merge requests](https://github.com/Luzkan/smells/pulls). I suspect there might be some discussions going _(I am deeply convinced that in such a huge pile of stuff, I had to make mistakes, even just statistically speaking)_. 🐈

This is supposed to be as easy as possible for everyone to contribute from the theoretic side - no need to know any programming languages, as the contents of the website can be managed by _markdown-like_ files in the [`content`](./content/) directory. The content is in a standard `markdown` format and the key data in the markdown file header in `YAML` format.
