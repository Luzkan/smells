from __future__ import annotations
from dataclasses import dataclass, field


@dataclass(frozen=True)
class RelatedSmells:
    name: str
    slug: str
    type: list[str] = field(default_factory=list)

    @staticmethod
    def init(related_smell: dict) -> 'RelatedSmells':
        return RelatedSmells(
            name=related_smell['name'],
            slug=related_smell['slug'],
            type=list(related_smell.get('type', [])),
        )
