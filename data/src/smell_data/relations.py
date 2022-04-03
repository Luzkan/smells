from __future__ import annotations
from dataclasses import dataclass
from data.src.smell_data.related_smells import RelatedSmells


@dataclass(frozen=True)
class Relations:
    related_smells: list[RelatedSmells]

    @staticmethod
    def init(relations: dict) -> 'Relations':
        return Relations(related_smells=relations['related_smells'])
