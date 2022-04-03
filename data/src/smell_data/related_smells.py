from __future__ import annotations
from dataclasses import dataclass


@dataclass(frozen=True)
class RelatedSmells:
    name: str
    slug: str
    type: list[str] | None
