from __future__ import annotations
from dataclasses import dataclass


@dataclass(frozen=True)
class Meta:
    last_update_date: str
    title: str
    known_as: list[str]

    @staticmethod
    def init(meta: dict) -> 'Meta':
        return Meta(
            last_update_date=str(meta['last_update_date']),
            title=meta['title'],
            known_as=meta['known_as'],
        )
