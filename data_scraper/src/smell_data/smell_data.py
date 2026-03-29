from __future__ import annotations
import json
import frontmatter
from dataclasses import dataclass, asdict
from pathlib import Path
from data_scraper.src.smell_data import Categories, HistoryEntry, Meta, Problems, Relations
from data_scraper.src.smell_data.normalization import normalize_string_array


@dataclass(frozen=True)
class SmellData:
    slug: str
    meta: Meta
    categories: Categories
    relations: Relations
    problems: Problems
    refactors: list[str]
    history: list[HistoryEntry]

    @staticmethod
    def init(smell: frontmatter.Post) -> 'SmellData':
        return SmellData(
            slug=smell['slug'],
            meta=Meta.init(smell['meta']),
            categories=Categories.init(smell['categories']),
            relations=Relations.init(smell['relations'] if 'relations' in smell else None),
            problems=Problems.init(smell['problems'] if 'problems' in smell else None),
            refactors=normalize_string_array(smell['refactors'] if 'refactors' in smell else None),
            history=[
                HistoryEntry.init(entry)
                for entry in (smell['history'] if 'history' in smell else [])
            ],
        )

    def save_to_file_as_json(self, filepath: Path | str) -> None:
        with Path(filepath).open('w', encoding='utf-8') as file:
            json.dump(asdict(self), file, indent=2)
