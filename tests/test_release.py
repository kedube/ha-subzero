"""The Release workflow's version and changelog steps."""

import importlib.util
from pathlib import Path

import pytest

SCRIPT = Path(__file__).parents[1] / ".github" / "scripts" / "release.py"
spec = importlib.util.spec_from_file_location("release", SCRIPT)
release = importlib.util.module_from_spec(spec)
spec.loader.exec_module(release)

TAGS = ["v0.6.2", "v0.9.0b1", "v0.9.0", "1.00", "1.06", "1.07", "not-a-release"]

CHANGELOG = """\
# Changelog

Versions have two decimal places.

## {heading}

### Changed

- Something better.

## 1.07

### Fixed

- Something broken.
"""


@pytest.mark.parametrize(
    ("tags", "bump", "expected"),
    [
        (TAGS, "minor", "1.08"),
        (TAGS, "major", "2.00"),
        (["1.09", "1.10"], "minor", "1.11"),
        (["1.98", "1.99"], "minor", "2.00"),
        (["1.99"], "major", "2.00"),
        (["2.00", "1.42"], "minor", "2.01"),
    ],
)
def test_next_version_counts_from_the_newest_release(tags, bump, expected):
    assert release.next_version(tags, bump) == expected


def test_next_version_needs_a_release_to_count_from():
    with pytest.raises(release.ReleaseError, match="no release"):
        release.next_version(["v0.9.0"], "minor")


@pytest.mark.parametrize("version", ["1.07", "1.06", "0.10"])
def test_a_release_must_be_newer_than_every_tag(version):
    with pytest.raises(release.ReleaseError, match=f"{version} is not newer"):
        release.check_newer(version, TAGS)


def test_a_newer_release_passes():
    release.check_newer("1.08", TAGS)


@pytest.mark.parametrize(
    ("heading", "finished"),
    [("Unreleased", False), ("1.08 (unreleased)", False), ("1.08 (Unreleased)", False)],
)
def test_finishing_the_section_names_the_version(heading, finished):
    text = CHANGELOG.format(heading=heading)
    section = release.find_section(text, "1.08")

    assert section.finished is finished
    assert section.notes == "### Changed\n\n- Something better."
    assert release.finish(text, section, "1.08") == CHANGELOG.format(heading="1.08")


def test_a_finished_section_still_gives_its_notes():
    section = release.find_section(CHANGELOG.format(heading="1.08"), "1.08")

    assert section.finished
    assert section.notes == "### Changed\n\n- Something better."


@pytest.mark.parametrize(
    ("text", "error"),
    [
        (CHANGELOG.format(heading="1.09 (unreleased)"), "but this release is 1.08"),
        (CHANGELOG.format(heading="1.07"), "isn't this release"),
        ("# Changelog\n", "no sections"),
        ("# Changelog\n\n## Unreleased\n\n## 1.07\n\n- Old.\n", 'no changes under "Unreleased"'),
        ("# Changelog\n\n## Unreleased\n", 'no changes under "Unreleased"'),
    ],
)
def test_a_release_needs_its_changes_listed(text, error):
    with pytest.raises(release.ReleaseError, match=error):
        release.find_section(text, "1.08")


def test_changelog_command_finishes_the_file_and_writes_the_notes(tmp_path, monkeypatch):
    monkeypatch.chdir(tmp_path)
    (tmp_path / "CHANGELOG.md").write_text(CHANGELOG.format(heading="Unreleased"))

    assert release.main(["changelog", "1.08", "--finish", "--notes", "notes.md"]) == 0
    assert (tmp_path / "CHANGELOG.md").read_text() == CHANGELOG.format(heading="1.08")
    assert (tmp_path / "notes.md").read_text() == "### Changed\n\n- Something better.\n"


def test_changelog_command_only_checks_without_options(tmp_path, monkeypatch, capsys):
    monkeypatch.chdir(tmp_path)
    monkeypatch.setenv("GITHUB_ACTIONS", "true")
    (tmp_path / "CHANGELOG.md").write_text(CHANGELOG.format(heading="1.07 (unreleased)"))

    assert release.main(["changelog", "1.07"]) == 0
    assert (tmp_path / "CHANGELOG.md").read_text() == CHANGELOG.format(heading="1.07 (unreleased)")
    assert release.main(["changelog", "1.08"]) == 1
    assert capsys.readouterr().err.startswith("::error::CHANGELOG.md's newest section")


def test_next_command_prints_only_the_version(monkeypatch, capsys):
    monkeypatch.setattr(release, "git_tags", lambda: TAGS)

    assert release.main(["next", "minor"]) == 0
    assert capsys.readouterr().out == "1.08\n"
