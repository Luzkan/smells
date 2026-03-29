from __future__ import annotations

import argparse
import json
from datetime import date, datetime
from pathlib import Path

import frontmatter


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


def build_expected_output(smell: frontmatter.Post) -> dict:
    meta = smell['meta']
    categories = smell['categories']
    relations = smell['relations'] if 'relations' in smell else {}
    problems = smell['problems'] if 'problems' in smell else {}
    history = smell['history'] if 'history' in smell else []

    return {
        'slug': smell['slug'],
        'meta': {
            'last_update_date': isoformat_date(meta['last_update_date']),
            'title': meta['title'],
            'description': meta.get('description'),
            'cover': meta.get('cover'),
            'known_as': normalize_string_array(meta.get('known_as')),
        },
        'categories': {
            'expanse': categories['expanse'],
            'obstruction': list(categories['obstruction']),
            'occurrence': list(categories['occurrence']),
            'tags': normalize_string_array(categories.get('tags')),
            'smell_hierarchies': list(categories['smell_hierarchies']),
        },
        'relations': {
            'related_smells': [
                {
                    'name': related_smell['name'],
                    'slug': related_smell['slug'],
                    'type': list(related_smell.get('type', [])),
                }
                for related_smell in relations.get('related_smells', [])
            ],
        },
        'problems': {
            'general': normalize_string_array(problems.get('general')),
            'violation': {
                'principles': normalize_string_array(
                    (problems.get('violation') or {}).get('principles'),
                ),
                'patterns': normalize_string_array(
                    (problems.get('violation') or {}).get('patterns'),
                ),
            },
        },
        'refactors': normalize_string_array(smell['refactors'] if 'refactors' in smell else None),
        'history': [
            {
                'author': entry['author'],
                'source': {
                    'year': int(entry['source']['year']),
                    'authors': list(entry['source']['authors']),
                    'name': entry['source']['name'],
                    'type': entry['source']['type'],
                    'href': None
                    if 'href' not in entry['source']
                    else {
                        'isbn_13': entry['source']['href'].get('isbn_13'),
                        'isbn_10': entry['source']['href'].get('isbn_10'),
                        'direct_url': entry['source']['href'].get('direct_url'),
                        'journal': entry['source']['href'].get('journal'),
                        'pages': entry['source']['href'].get('pages'),
                        'publisher': entry['source']['href'].get('publisher'),
                        'year': (
                            int(entry['source']['href']['year'])
                            if 'year' in entry['source']['href']
                            else None
                        ),
                        'volume': entry['source']['href'].get('volume'),
                        'number': entry['source']['href'].get('number'),
                    },
                    'named_as': coerce_optional_string_array(entry['source'].get('named_as')),
                    'regarded_as': coerce_optional_string_array(
                        entry['source'].get('regarded_as'),
                    ),
                },
                'type': entry.get('type'),
                'named_as': normalize_optional_string_array(entry.get('named_as')),
                'regarded_as': normalize_optional_string_array(entry.get('regarded_as')),
            }
            for entry in history
        ],
    }


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description='Verifies generated data scraper JSON matches smell frontmatter.',
    )
    parser.add_argument(
        '--content_path',
        '-cp',
        help='The path to the code smells content folder.',
        default='./content/smells',
    )
    parser.add_argument(
        '--save_path',
        '-sp',
        help='The path to the folder where the data was saved.',
        required=True,
    )
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    content_path = Path(args.content_path)
    save_path = Path(args.save_path)

    smell_files = sorted(content_path.glob('*.md'))
    json_files = sorted(save_path.glob('*.json'))

    print(f'Found {len(smell_files)} smell markdown files')
    print(f'Generated {len(json_files)} scraper files')

    if len(json_files) != len(smell_files):
        raise SystemExit(
            f'Expected {len(smell_files)} scraper files, found {len(json_files)}',
        )

    for smell_file in smell_files:
        smell = frontmatter.load(smell_file)
        json_path = save_path / f"{smell['slug']}.json"

        if not json_path.exists():
            raise SystemExit(f'Missing scraper output for {smell_file.stem}')

        with json_path.open(encoding='utf-8') as file:
            actual_output = json.load(file)

        expected_output = build_expected_output(smell)
        if actual_output != expected_output:
            raise SystemExit(f'Scraper output mismatch for {smell_file.stem}')

    print('Verified scraper output parity with frontmatter')


if __name__ == '__main__':
    main()
