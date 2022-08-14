"""
Requirements:
    - python-frontmatter~=1.0.0

::
    python -m pip install python-frontmatter

---
Usage:

Make sure you are in the root of the project.
There are flags available, which you can inspect by adding `-h` flag.

::
    python ./data_scraper/main.py
    
"""
from data_scraper.src.arguments import Arguments
from data_scraper.src.smell_data.smell_data import SmellData
from data_scraper.src.smell_files_loader import SmellFilesLoader


def main(args: Arguments):
    for smell_post in SmellFilesLoader(args.content_path).get_smell_posts():
        smell_data: SmellData = SmellData.init(smell_post)
        smell_data.save_to_file_as_json(f'{args.save_path}/{smell_data.slug}.json')


if __name__ == "__main__":
    main(Arguments.get())
