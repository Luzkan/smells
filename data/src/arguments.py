import argparse
from dataclasses import dataclass
from pathlib import Path


@dataclass(frozen=True)
class Arguments:
    content_path: Path
    save_path: Path

    @staticmethod
    def get() -> 'Arguments':
        parser = argparse.ArgumentParser(
            description='Saves the header data from code smells inside the Code Smell content folder as .json files.',
        )
        parser.add_argument(
            '--content_path', '-cp',
            help='The path to the code smells content folder.',
            default='./content/smells')
        parser.add_argument(
            '--save_path', '-sp',
            help='The path to the folder where the data should be saved.',
            default='./data/smells')
        args = parser.parse_args()
        return Arguments(
            content_path=Path(args.content_path),
            save_path=Path(args.save_path),
        )
