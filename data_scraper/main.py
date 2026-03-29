"""
Python scraper for `content/smells/`.

Requirements:
    - Python 3.10+
    - `python-frontmatter~=1.0.0`

Bootstrap from the repository root:
    python3 -m venv .venv
    source .venv/bin/activate
    python -m pip install -r data_scraper/requirements.txt

Usage:
    python -m data_scraper.main
    python -m data_scraper.main -h
"""
from data_scraper.src.arguments import Arguments
from data_scraper.src.smell_data.smell_data import SmellData
from data_scraper.src.smell_files_loader import SmellFilesLoader


def main(args: Arguments) -> None:
    args.save_path.mkdir(parents=True, exist_ok=True)

    for smell_post in SmellFilesLoader(args.content_path).get_smell_posts():
        smell_data: SmellData = SmellData.init(smell_post)
        smell_data.save_to_file_as_json(args.save_path / f'{smell_data.slug}.json')


if __name__ == "__main__":
    main(Arguments.get())
