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


@pytest.mark.parametrize("path", sorted(TRANSLATIONS.glob("*.json")), ids=lambda path: path.stem)
def test_entity_names_stay_distinct_on_each_platform(path):
    """Two entities of one device can't share a name, in any language."""
    english = json.loads((TRANSLATIONS / "en.json").read_text(encoding="utf-8"))["entity"]
    entity = json.loads(path.read_text(encoding="utf-8"))["entity"]
    for platform, keys in entity.items():
        names = [value["name"] for value in keys.values()]
        assert all(name == name.strip() for name in names), platform
        # English shares a name only between entities no appliance has together, such as a
        # refrigerator's Mode and a dishwasher's, and a translation may tell even those apart.
        assert len(set(names)) >= len({value["name"] for value in english[platform].values()}), (
            platform
        )
