from __future__ import annotations

from dataclasses import dataclass

from data_scraper.src.smell_data.normalization import (
    coerce_optional_string_array,
    normalize_optional_string_array,
)


@dataclass(frozen=True)
class Href:
    isbn_13: str | None = None
    isbn_10: str | None = None
    direct_url: str | None = None
    journal: str | None = None
    pages: str | None = None
    publisher: str | None = None
    year: int | None = None
    volume: int | str | None = None
    number: int | str | None = None

    @staticmethod
    def init(href: dict | None) -> 'Href | None':
        if href is None:
            return None
        return Href(
            isbn_13=href.get('isbn_13'),
            isbn_10=href.get('isbn_10'),
            direct_url=href.get('direct_url'),
            journal=href.get('journal'),
            pages=href.get('pages'),
            publisher=href.get('publisher'),
            year=int(href['year']) if 'year' in href else None,
            volume=href.get('volume'),
            number=href.get('number'),
        )


@dataclass(frozen=True)
class Source:
    year: int
    authors: list[str]
    name: str
    type: str
    href: Href | None = None
    named_as: list[str] | None = None
    regarded_as: list[str] | None = None

    @staticmethod
    def init(source: dict) -> 'Source':
        return Source(
            year=int(source['year']),
            authors=list(source['authors']),
            name=source['name'],
            type=source['type'],
            href=Href.init(source.get('href')),
            named_as=coerce_optional_string_array(source.get('named_as')),
            regarded_as=coerce_optional_string_array(source.get('regarded_as')),
        )


@dataclass(frozen=True)
class HistoryEntry:
    author: str
    source: Source
    type: str | None = None
    named_as: list[str] | None = None
    regarded_as: list[str] | None = None

    @staticmethod
    def init(entry: dict) -> 'HistoryEntry':
        return HistoryEntry(
            author=entry['author'],
            source=Source.init(entry['source']),
            type=entry.get('type'),
            named_as=normalize_optional_string_array(entry.get('named_as')),
            regarded_as=normalize_optional_string_array(entry.get('regarded_as')),
        )
