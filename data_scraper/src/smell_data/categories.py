from __future__ import annotations
from dataclasses import dataclass


@dataclass(frozen=True)
class Categories:
    expanse: str
    obstruction: list[str]
    occurrence: list[str]
    tags: list[str]
    smell_hierarchies: list[str]

    @staticmethod
    def init(categories: dict) -> 'Categories':
        return Categories(
            expanse=categories['expanse'],
            obstruction=categories['obstruction'],
            occurrence=categories['occurrence'],
            tags=categories['tags'],
            smell_hierarchies=categories['smell_hierarchies'],
        )
