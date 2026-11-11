"""Sanity checks on the packaging files."""

import json
from pathlib import Path

ROOT = Path(__file__).parent.parent
COMPONENT = ROOT / "custom_components" / "weheat_insights"


def test_manifest_and_hacs_are_consistent() -> None:
    manifest = json.loads((COMPONENT / "manifest.json").read_text())
    hacs = json.loads((ROOT / "hacs.json").read_text())

    assert manifest["domain"] == "weheat_insights"
    assert manifest["name"] == hacs["name"]
    assert manifest["version"]
    assert "weheat" in manifest["after_dependencies"]
