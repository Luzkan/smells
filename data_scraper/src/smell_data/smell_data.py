from __future__ import annotations
import json
import frontmatter
from dataclasses import dataclass, asdict
from data_scraper.src.smell_data import Categories, Meta, Relations


@dataclass(frozen=True)
class SmellData:
    slug: str
    meta: Meta
    categories: Categories
    relations: Relations
    problems: list[str] | None
    refactors: list[str] | None

    @staticmethod
    def init(smell: frontmatter.Post) -> 'SmellData':
        def safe_get(container: dict | frontmatter.Post, key: str, default=None):
            return container[key] if key in smell else default

        return SmellData(
            slug=smell['slug'],
            meta=Meta.init(smell['meta']),
            categories=Categories.init(smell['categories']),
            relations=Relations.init(smell['relations']),
            problems=safe_get(smell, 'problems'),
            refactors=safe_get(smell, 'refactors'),
        )

    def save_to_file_as_json(self, filepath: str) -> None:
        with open(filepath, 'w') as file:
            json.dump(asdict(self), file, indent=2)
