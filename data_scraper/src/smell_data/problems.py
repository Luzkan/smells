from __future__ import annotations

from dataclasses import dataclass

from data_scraper.src.smell_data.normalization import normalize_string_array


@dataclass(frozen=True)
class Violation:
    principles: list[str]
    patterns: list[str]

    @staticmethod
    def init(violation: dict | None) -> 'Violation':
        violation = violation or {}
        return Violation(
            principles=normalize_string_array(violation.get('principles')),
            patterns=normalize_string_array(violation.get('patterns')),
        )


@dataclass(frozen=True)
class Problems:
    general: list[str]
    violation: Violation

    @staticmethod
    def init(problems: dict | None) -> 'Problems':
        problems = problems or {}
        return Problems(
            general=normalize_string_array(problems.get('general')),
            violation=Violation.init(problems.get('violation')),
        )
