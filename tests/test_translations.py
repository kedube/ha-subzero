"""Translations stay in step with the English strings."""

import json
import re
from pathlib import Path

import pytest

COMPONENT = Path(__file__).parent.parent / "custom_components" / "subzero"
TRANSLATIONS = COMPONENT / "translations"
PLACEHOLDER = re.compile(r"\{[a-z_]+\}")


def flatten(data: dict, prefix: str = "") -> dict[str, str]:
    strings = {}
    for key, value in data.items():
        path = f"{prefix}.{key}" if prefix else key
        if isinstance(value, dict):
            strings.update(flatten(value, path))
        else:
            strings[path] = value
    return strings


def load(path: Path) -> dict[str, str]:
    return flatten(json.loads(path.read_text(encoding="utf-8")))


ENGLISH = load(TRANSLATIONS / "en.json")


def test_english_matches_strings():
    assert load(COMPONENT / "strings.json") == ENGLISH


@pytest.mark.parametrize(
    "path",
    [path for path in sorted(TRANSLATIONS.glob("*.json")) if path.name != "en.json"],
    ids=lambda path: path.stem,
)
def test_translation_has_every_string_and_placeholder(path):
    strings = load(path)
    assert strings.keys() == ENGLISH.keys()
    for key, text in strings.items():
        assert text.strip(), key
        assert sorted(PLACEHOLDER.findall(text)) == sorted(PLACEHOLDER.findall(ENGLISH[key])), key
