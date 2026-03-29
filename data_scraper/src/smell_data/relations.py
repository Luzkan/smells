from __future__ import annotations
from dataclasses import dataclass, field
from data_scraper.src.smell_data.related_smells import RelatedSmells


@dataclass(frozen=True)
class Relations:
    related_smells: list[RelatedSmells] = field(default_factory=list)

    @staticmethod
    def init(relations: dict | None) -> 'Relations':
        if relations is None:
            return Relations()

        return Relations(
            related_smells=[
                RelatedSmells.init(related_smell)
                for related_smell in relations.get('related_smells', [])
            ],
        )
