from __future__ import annotations
from dataclasses import dataclass, field

from data_scraper.src.smell_data.normalization import isoformat_date, normalize_string_array


@dataclass(frozen=True)
class Meta:
    last_update_date: str
    title: str
    description: str | None = None
    cover: str | None = None
    known_as: list[str] = field(default_factory=list)

    @staticmethod
    def init(meta: dict) -> 'Meta':
        return Meta(
            last_update_date=isoformat_date(meta['last_update_date']),
            title=meta['title'],
            description=meta.get('description'),
            cover=meta.get('cover'),
            known_as=normalize_string_array(meta.get('known_as')),
        )
