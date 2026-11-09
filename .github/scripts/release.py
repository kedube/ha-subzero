"""Version and changelog steps for the Release workflow.

    release.py next minor|major
        Print the version after the newest release: minor adds 0.01, so 1.07
        becomes 1.08 and 1.99 becomes 2.00; major moves to the next whole
        number, so 1.07 becomes 2.00.
    release.py newer VERSION
        Fail unless VERSION is newer than every tag, including v0.x.y ones.
    release.py changelog VERSION [--finish] [--notes FILE]
        Fail unless CHANGELOG.md's newest section lists VERSION's changes
        under "## Unreleased", "## VERSION (unreleased)" or "## VERSION".
        --finish heads that section "## VERSION"; --notes writes its text to
        FILE for the release notes.

Run it from the repository's root.
"""

import argparse
import os
import re
import subprocess
import sys
from collections.abc import Iterable
from dataclasses import dataclass
from pathlib import Path

CHANGELOG = Path("CHANGELOG.md")
VERSION = re.compile(r"(\d+)\.(\d{2})")
# Tags before 1.00 have the form v0.9.0; their betas, such as v0.9.0b1, never
# count as releases.
TAG = re.compile(r"v?(\d+(?:\.\d+)*)")
UNRELEASED = re.compile(r"unreleased|(\d+\.\d{2}) \(unreleased\)", re.IGNORECASE)


class ReleaseError(Exception):
    """Something that stops the release, worded for the person releasing."""


@dataclass(frozen=True)
class Section:
    """The newest section of the changelog."""

    heading: int
    """Index of the heading's line."""
    title: str
    notes: str
    finished: bool
    """Whether the heading already names the version."""


def release_number(tag: str) -> tuple[int, ...] | None:
    match = TAG.fullmatch(tag)
    return tuple(int(part) for part in match[1].split(".")) if match else None


def next_version(tags: Iterable[str], bump: str) -> str:
    versions = [(int(match[1]), int(match[2])) for tag in tags if (match := VERSION.fullmatch(tag))]
    if not versions:
        raise ReleaseError("There is no release such as 1.00 to count from.")
    major, minor = max(versions)
    if bump == "major" or minor == 99:
        return f"{major + 1}.00"
    return f"{major}.{minor + 1:02d}"


def check_newer(version: str, tags: Iterable[str]) -> None:
    """HACS offers the newest release, so a new one has to be the highest."""
    wanted = release_number(version)
    for tag in tags:
        released = release_number(tag)
        if released is not None and released >= wanted:
            raise ReleaseError(f"{version} is not newer than {tag}.")


def find_section(text: str, version: str) -> Section:
    lines = text.splitlines(keepends=True)
    headings = [index for index, line in enumerate(lines) if line.startswith("## ")]
    if not headings:
        raise ReleaseError(
            f"CHANGELOG.md has no sections. List the changes in {version} under "
            '"## Unreleased" at the top.'
        )
    heading = headings[0]
    end = headings[1] if len(headings) > 1 else len(lines)
    title = lines[heading][3:].strip()

    if title == version:
        finished = True
    elif match := UNRELEASED.fullmatch(title):
        if match[1] and match[1] != version:
            raise ReleaseError(
                f'CHANGELOG.md\'s newest section is "{title}", but this release is '
                f'{version}. Head the changes in {version} "## Unreleased".'
            )
        finished = False
    else:
        raise ReleaseError(
            f"CHANGELOG.md's newest section is \"{title}\", which isn't this release. "
            f'List the changes in {version} under "## Unreleased" at the top.'
        )

    notes = "".join(lines[heading + 1 : end]).strip()
    if not notes:
        raise ReleaseError(f'CHANGELOG.md lists no changes under "{title}".')
    return Section(heading, title, notes, finished)


def finish(text: str, section: Section, version: str) -> str:
    """Head the section with the version it was released as."""
    lines = text.splitlines(keepends=True)
    ending = lines[section.heading][len(lines[section.heading].rstrip("\r\n")) :]
    lines[section.heading] = f"## {version}{ending}"
    return "".join(lines)


def git_tags() -> list[str]:
    return subprocess.check_output(["git", "tag", "--list"], text=True).split()


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(
        description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter
    )
    commands = parser.add_subparsers(dest="command", required=True)
    commands.add_parser("next").add_argument("bump", choices=["minor", "major"])
    commands.add_parser("newer").add_argument("version")
    changelog = commands.add_parser("changelog")
    changelog.add_argument("version")
    changelog.add_argument("--finish", action="store_true")
    changelog.add_argument("--notes", type=Path)
    args = parser.parse_args(argv)

    try:
        if args.command == "next":
            print(next_version(git_tags(), args.bump))
        elif args.command == "newer":
            check_newer(args.version, git_tags())
        else:
            text = CHANGELOG.read_text(encoding="utf-8")
            section = find_section(text, args.version)
            if args.finish and not section.finished:
                CHANGELOG.write_text(finish(text, section, args.version), encoding="utf-8")
            if args.notes:
                args.notes.write_text(section.notes + "\n", encoding="utf-8")
    except ReleaseError as error:
        # Errors go to stderr, so a step that captures the output gets only
        # the version, and Actions shows the error as an annotation.
        prefix = "::error::" if os.environ.get("GITHUB_ACTIONS") == "true" else ""
        print(f"{prefix}{error}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
