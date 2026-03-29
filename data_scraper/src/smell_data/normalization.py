from __future__ import annotations

from datetime import date, datetime


def normalize_string_array(values: list[str] | None) -> list[str]:
    if values is None:
        return []
    return [value for value in values if value != '---']


def normalize_optional_string_array(values: list[str] | None) -> list[str] | None:
    if values is None:
        return None
    return normalize_string_array(values)


def coerce_optional_string_array(value: str | list[str] | None) -> list[str] | None:
    if value is None:
        return None
    if isinstance(value, str):
        return normalize_string_array([value])
    return normalize_string_array(value)


def isoformat_date(value: date | datetime | str) -> str:
    if isinstance(value, datetime):
        return value.date().isoformat()
    if isinstance(value, date):
        return value.isoformat()
    return str(value)
