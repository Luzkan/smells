from __future__ import annotations
from dataclasses import dataclass

from data_scraper.src.smell_data.normalization import normalize_string_array


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
            obstruction=list(categories['obstruction']),
            occurrence=list(categories['occurrence']),
            tags=normalize_string_array(categories.get('tags')),
            smell_hierarchies=list(categories['smell_hierarchies']),
        )
