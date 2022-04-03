from __future__ import annotations
import frontmatter
from dataclasses import dataclass
from pathlib import Path


@dataclass
class SmellFilesLoader:
    content_path: Path

    def get_smell_posts(self) -> list[frontmatter.Post]:
        return [self._load_smell(file) for file in self._get_all_smell_files()]

    @classmethod
    def _load_smell(cls, filepath: Path) -> frontmatter.Post:
        with open(f'./{filepath}') as f:
            return frontmatter.load(f)

    def _get_all_smell_files(self) -> list[Path]:
        return [file for file in Path(self.content_path).glob('*.md')]
