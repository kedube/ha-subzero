"""What each appliance looks like, worked out from its model number and properties.

The sidebar panel draws each appliance from this spec. Its shape is `ApplianceSpec` in
frontend/src/types.ts, which is the contract between the two.

Detection reads the model number first, then the appliance type (its series and category),
then the properties the appliance reports, and settles for a generic drawing last. The
model patterns follow the Sub-Zero app's model names, rangetop parser and demo catalog,
and Sub-Zero and Wolf model nomenclature.
"""

import re

from .const import FAULT_METADATA_APPLIES_TO_BY_SERIES, HOOD_INTEGER_RANGES, KNOB_OVEN_TYPES
from .controls import (
    appliance_type,
    has_left_and_right_ovens,
    is_dishwasher,
    is_fridge,
    is_hood,
    is_ice_maker,
    is_oven,
    is_wine,
)

# The forms each family can take; the Appearance setting can switch between them.
FORMS = {
    "refrigeration": (
        "side_by_side",
        "french_door",
        "over_under",
        "column_refrigerator",
        "column_freezer",
        "column_wine",
        "tall_refrigerator",
        "tall_freezer",
        "tall_over_under",
        "wine_over_drawers",
        "undercounter_refrigerator",
        "undercounter_beverage",
        "undercounter_wine",
        "undercounter_drawers",
        "ice_maker",
    ),
    "range": ("range",),
    "wall_oven": ("single", "double"),
    "hood": ("wall", "island", "insert", "hood"),
    "dishwasher": ("dishwasher",),
    "generic": ("refrigerator", "wine", "ice_maker", "oven", "hood", "dishwasher", "appliance"),
}

# Temperature zones: one for each of these setpoints the appliance reports. The crisper's
# setpoint tunes a drawer inside the refrigerator, so it isn't a zone of its own.
ZONE_KEYS = ("ref_set_temp", "ref2_set_temp", "frz_set_temp", "wine_set_temp", "wine2_set_temp")
REFRIGERATION_DOOR_KEYS = (
    "ref_door_ajar",
    "ref2_door_ajar",
    "frz_door_ajar",
    "wine_door_ajar",
    "wine2_door_ajar",
)
WINE_FORMS = {"column_wine", "wine_over_drawers", "undercounter_wine"}
DRAWER_FORMS = {"undercounter_drawers", "wine_over_drawers"}

# Finish, handle, hinge and fuel letters that follow the configuration letters: S stainless,
# B black glass, BK, BU, RD and WH range colors, P and PH professional style or handle, T and
# TH transitional style or tubular handle, L, R, LH and RH hinge sides, LP propane.
_SUFFIX_TOKEN = r"BK|BU|RD|WH|PH|TH|LH|RH|LP|S|B|P|T|L|R"
_SUFFIX = rf"(?:{_SUFFIX_TOKEN})*"
# Refrigerator handles by their letters, in Sub-Zero's model number key.
_HANDLES = (("pro", {"P", "PH"}), ("tubular", {"T", "TH"}))
# Letters after a refrigerator's configuration: G glass, A or HAG high-altitude glass, D
# external dispenser, ID internal dispenser, O outdoor-rated. ADA (ADA height), DZ (dual
# zone), SZ and X (the Integrated X generation) don't change the drawing. SZ isn't in
# Sub-Zero's published names; the app shows DEU2450BGSZ with its ADA-height picture.
_MODIFIER = r"ADA|HAG|ID|DZ|SZ|D|G|A|O|X"
_GLASS = {"G", "A", "HAG"}

# Configuration letters by refrigeration product line: the form and what the letters add.
# In Designer and Integrated names I is an ice maker and ID an internal dispenser.
_COLUMN = {
    "R": ("column_refrigerator", {}),
    "RID": ("column_refrigerator", {"dispenser": "internal"}),
    "F": ("column_freezer", {}),
    "FI": ("column_freezer", {"ice": True}),
    "W": ("column_wine", {}),
}
_INTEGRATED_COLUMN = {
    **_COLUMN,
    # IC-24C and IC-24CI keep a refrigerator and a freezer behind one door.
    "C": ("column_refrigerator", {}),
    "CI": ("column_refrigerator", {"ice": True}),
}
_TALL = {
    "C": ("tall_over_under", {}),
    "CI": ("tall_over_under", {"ice": True}),
    "CIID": ("tall_over_under", {"ice": True, "dispenser": "internal"}),
    "R": ("tall_refrigerator", {}),
    "RID": ("tall_refrigerator", {"dispenser": "internal"}),
    "F": ("tall_freezer", {}),
    "FI": ("tall_freezer", {"ice": True}),
    "WR": ("wine_over_drawers", {"drawers": "refrigerator"}),
    "WCI": ("wine_over_drawers", {"drawers": "combination", "ice": True}),
}
_UNDERCOUNTER = {
    "R": ("undercounter_refrigerator", {}),
    # DEU2450CI keeps a refrigerator and a freezer behind one door.
    "CI": ("undercounter_refrigerator", {"ice": True}),
    # B has a solid door, BG a glass one.
    "B": ("undercounter_beverage", {}),
    "BG": ("undercounter_beverage", {"glass": True}),
    "W": ("undercounter_wine", {}),
    "DR": ("undercounter_drawers", {"drawers": "refrigerator"}),
    "DF": ("undercounter_drawers", {"drawers": "freezer"}),
    "DFI": ("undercounter_drawers", {"drawers": "freezer", "ice": True}),
    "DC": ("undercounter_drawers", {"drawers": "combination"}),
    "DCI": ("undercounter_drawers", {"drawers": "combination", "ice": True}),
    # IP adds a drain pump. NI is in the app's demo catalog but not Sub-Zero's published
    # names.
    "I": ("ice_maker", {}),
    "IP": ("ice_maker", {}),
    "NI": ("ice_maker", {}),
}
_INTEGRATED_DRAWERS = {
    "R": ("undercounter_drawers", {"drawers": "refrigerator"}),
    "RP": ("undercounter_drawers", {"drawers": "refrigerator"}),
    "F": ("undercounter_drawers", {"drawers": "freezer"}),
    "FI": ("undercounter_drawers", {"drawers": "freezer", "ice": True}),
    "C": ("undercounter_drawers", {"drawers": "combination"}),
    "CI": ("undercounter_drawers", {"drawers": "combination", "ice": True}),
}
_INTEGRATED_WINE = {
    "": ("column_wine", {}),
    "R": ("wine_over_drawers", {"drawers": "refrigerator"}),
    "CI": ("wine_over_drawers", {"drawers": "combination", "ice": True}),
}
# Classic and BI names don't mark the ice maker, which these forms always have.
_CLASSIC = {
    "U": ("over_under", {"ice": True}),
    "UFD": ("french_door", {"ice": True}),
    "S": ("side_by_side", {"ice": True}),
    "R": ("column_refrigerator", {}),
    "F": ("column_freezer", {"ice": True}),
    "W": ("column_wine", {}),
}
_BUILT_IN = {key: value for key, value in _CLASSIC.items() if key != "W"}
_BUILT_IN_WINE = {"": ("column_wine", {})}
# PRO names give only the width.
_PRO = {"36": ("over_under", {"ice": True}), "48": ("side_by_side", {"ice": True})}


def _line(
    prefix: str, line: str, configs: dict, modifiers: str = "", *, overlay: bool = False
) -> tuple:
    # Longest configurations first, so RID wins over R.
    choices = "|".join(sorted(configs, key=len, reverse=True))
    # Classic and BI names mark an overlay (panel-ready) front with O where others have S;
    # undercounter names use O for outdoor models instead.
    front = "(?P<overlay>O)?" if overlay else ""
    pattern = rf"{prefix}(?P<config>{choices})(?P<mods>{modifiers}){front}(?P<suffix>{_SUFFIX})"
    return re.compile(pattern), line, configs


_REFRIGERATION = (
    _line("CL(?P<width>30|36|42|48)50", "classic", _CLASSIC, "(?:ID|HAG|D|G|A)*", overlay=True),
    _line("BI(?P<width>30|36|42|48)", "built_in", _BUILT_IN, "(?:ID|HAG|D|G|A)*", overlay=True),
    _line("BW(?P<width>30)", "built_in", _BUILT_IN_WINE, "(?:HAG|A)?", overlay=True),
    _line("DEC(?P<width>18|24|30|36)50", "designer", _COLUMN),
    _line("DET(?P<width>30|36)50", "designer", _TALL),
    _line("DEU(?P<width>15|24|27|30|36)50", "designer", _UNDERCOUNTER, "(?:ADA|DZ|SZ|O)*"),
    _line("IC(?P<width>18|24|27|30|36)", "integrated", _INTEGRATED_COLUMN, "X?"),
    _line("IT(?P<width>30|36)", "integrated", _TALL, "X?"),
    _line("ID(?P<width>24|27|30|36)", "integrated", _INTEGRATED_DRAWERS, "O?X?"),
    _line("IW(?P<width>18|24|30)", "integrated", _INTEGRATED_WINE, "(?:HAG|A)?X?"),
    (
        re.compile(rf"PRO(?P<width>(?P<config>36|48))50(?P<mods>G?)(?P<suffix>{_SUFFIX})"),
        "pro",
        _PRO,
    ),
)

# Wolf ranges: fuel, width, burners (or induction zones), a two-digit generation in newer
# names (DF48850, IR36550), rangetop surfaces, and an E or M style code in older ones
# (DF304PM, IR304TM). The app reads the surfaces the same way: DG a double griddle, C a
# charbroiler, G a griddle, F a French top.
_RANGE = re.compile(
    r"(?P<fuel>DF|IR|GR)(?P<width>30|36|48|60)(?P<burners>\d)(?:\d\d)?"
    rf"(?P<surfaces>DG|DC|CG|CF|GF|C|G|F)?(?P<style>[PT][EM])?(?P<suffix>{_SUFFIX})"
)
_FUELS = {"DF": "dual_fuel", "IR": "induction", "GR": "gas"}
# Wolf makes dual fuel and gas ranges only in the professional style; induction ranges come
# in both, so theirs comes from the model's letters.
_FUEL_STYLES = {"dual_fuel": "professional", "gas": "professional"}
_SURFACES = {
    "C": ("charbroiler",),
    "G": ("griddle",),
    "F": ("french_top",),
    "CG": ("charbroiler", "griddle"),
    "CF": ("charbroiler", "french_top"),
    "GF": ("griddle", "french_top"),
    "DG": ("double_griddle",),
    # Wolf's double charbroiler, made from 2002 to 2005.
    "DC": ("charbroiler", "charbroiler"),
}
# Burners by width, for a range whose model doesn't say.
_DEFAULT_BURNERS = {"dual_fuel": {30: 4, 36: 6, 48: 8, 60: 6}, "induction": {30: 4, 36: 5, 48: 7}}

# Wolf wall ovens: single or double, then the series, as in Wolf's model timelines. L series
# names give a framed (F) or unframed (U) door (SO30U); the first E series added -2, with F,
# U or G for black glass (SO30-2G); later E and M series names give a style letter
# (Professional, Transitional, Contemporary), after a 50 in the newest (SO3050PE).
# Convection steam (CSO) and speed (SPO) ovens are drawn as a single wall oven.
_WALL_OVEN = re.compile(
    r"(?P<kind>CSO|SPO|SO|DO)(?P<width>24|30|36)"
    r"(?:(?P<l_series>[FU])|(?P<first_e>2(?P<front>[FUG])?)"
    r"|(?:50)?(?P<style>[PTC])(?P<series>[EM]))"
    rf"(?P<suffix>{_SUFFIX})"
)
_OVEN_STYLES = {"P": "professional", "T": "transitional", "C": "contemporary"}

# Cove dishwashers. WS is the water softener, not a stainless door: both models take a
# custom panel or Cove's stainless door kit, so the model doesn't say which front it has.
_DISHWASHER = re.compile(rf"DW(?P<width>24)\d\d(?:WS)?(?:ADA)?{_SUFFIX}")

# Wolf hoods: PW, VW (with VWC chimney, VWO outdoor and VWLP low-profile) and CTWH hang on
# a wall, PI, VI and CTIH over an island, and PL and VL liners and VU inserts go inside a
# custom hood. The width follows the letters.
_HOOD = re.compile(r"(?P<kind>CTWH|CTIH|PW|PI|PL|VW|VI|VL|VU)[A-Z]{0,2}(?P<width>\d\d)")
_HOOD_FORMS = {
    "PW": "wall",
    "VW": "wall",
    "CTWH": "wall",
    "PI": "island",
    "VI": "island",
    "CTIH": "island",
    "PL": "insert",
    "VL": "insert",
    "VU": "insert",
}
_HOOD_KEYS = {*HOOD_INTEGER_RANGES, "fan_on"}

# Older BI and Integrated appliances can report a service code instead of a model number.
# The app's table of them, by the model each code stands for.
_SERVICE_CODES = {
    "BI30U": "006 018 043 048",
    "BI30UG": "012 024 044 049 301",
    "BI36U": "001 013 040 045",
    "BI36UG": "010 022 041 046 304",
    "BI36UID": "310",
    "BI36UFD": "039 042 047",
    "BI36UFDID": "317",
    "BI42UFD": "307 326",
    "BI42UFDID": "313",
    "BI36S": "009 021 025 030 053 056",
    "BI42S": "007 019 028 033 054 057",
    "BI42SD": "008 020 029 034 059 061 305 311 318 322 327 331 336 338",
    "BI42SID": "035 037 063 065 306 312 319 323 328 332 340 342",
    "BI48S": "003 015 027 032 055 058",
    "BI48SD": "002 014 026 031 060 062 308 314 320 324 329 333 337 339",
    "BI48SID": "036 038 064 066 309 315 321 325 330 334 341 343",
    "BI36R": "004 016 052",
    "BI36RG": "011 023 067 303 335",
    "BI36RID": "316",
    "BI36F": "005 017 302",
    "IC18FI": "2001 2040",
    "IC24C": "2038",
    "IC24CI": "2039",
    "IC24FI": "2002 2041",
    "IC24R": "2003",
    "IC30FI": "2004",
    "IC30R": "2005",
    "IC30RID": "2006",
    "IC36FI": "2037 2042",
    "IC36R": "2036",
    "IC36RID": "2007",
    "ID24F": "2008 2108",
    "ID24FI": "2009 2406",
    "ID24R": "2010 2110",
    "ID27R": "2011 2111",
    "ID30C": "2012 2112",
    "ID30CI": "2013 2407",
    "ID30F": "2014 2114",
    "ID30FI": "2015 2408",
    "ID30R": "2016 2116",
    "ID30RP": "2017 2031",
    "ID36C": "2018 2118",
    "ID36CI": "2019 2409",
    "ID36R": "2020 2120",
    "ID36RP": "2021",
    "IT30CI": "2022 2032",
    "IT30CIID": "2023 2033",
    "IT30FI": "2024 2043",
    "IT30R": "2025",
    "IT30RID": "2026",
    "IT36CI": "2027 2034",
    "IT36CIID": "2028 2035",
    "IT36R": "2029",
    "IT36RID": "2030",
    "IW18": "2401",
    "IW24": "2402",
    "IW30": "2403",
    "IW30R": "2404",
    "IW30CI": "2405",
}
SERVICE_CODE_MODELS = {
    code: model for model, codes in _SERVICE_CODES.items() for code in codes.split()
}

# Refrigeration by appliance type, for a model the patterns don't know: the app's default
# name for each type, matched with its demo catalog. Series by name, then category.
_DRAWERS = "undercounter_drawers"
_INTEGRATED_TYPES = {
    1: "tall_over_under",
    2: "tall_refrigerator",
    3: "tall_freezer",
    4: "column_refrigerator",
    5: "column_freezer",
    6: "column_refrigerator",
    7: _DRAWERS,
    8: _DRAWERS,
    9: _DRAWERS,
}
_TYPE_FORMS = {
    "bi": {1: "over_under", 2: "side_by_side", 3: "column_refrigerator", 4: "column_freezer"},
    "ngi": _INTEGRATED_TYPES,
    "ngix": _INTEGRATED_TYPES,
    "wine": {1: "column_wine", 2: "wine_over_drawers", 4: "wine_over_drawers"},
    "pro": {1: "over_under", 2: "side_by_side"},
    "bi5": {
        1: "over_under",
        2: "french_door",
        3: "side_by_side",
        4: "column_refrigerator",
        5: "column_freezer",
    },
    "bi5Wine": {1: "column_wine"},
    "deu": {
        1: "undercounter_refrigerator",
        2: "undercounter_refrigerator",
        3: "undercounter_beverage",
        4: "undercounter_refrigerator",
        5: "undercounter_refrigerator",
        6: "undercounter_beverage",
    },
    "deuWine": {1: "undercounter_wine", 2: "undercounter_wine", 3: "undercounter_wine"},
    "ds3": {
        1: "tall_over_under",
        2: "tall_refrigerator",
        3: "tall_freezer",
        4: "column_refrigerator",
        5: "column_freezer",
        7: _DRAWERS,
        8: _DRAWERS,
        9: _DRAWERS,
        10: _DRAWERS,
    },
    "ds3Wine": {1: "column_wine", 3: "wine_over_drawers", 4: "wine_over_drawers"},
}
# BI French door units share the over-and-under category.
_TYPE_VERSION_FORMS = {("bi", 1, 2): "french_door", ("bi", 1, 12): "french_door"}
# What the drawers hold, for a type whose appliance reports no setpoints yet. The Integrated
# X types are left out: the app's names for them disagree with the Integrated ones.
_TYPE_DRAWERS = {
    ("ngi", 8): "freezer",
    ("ngi", 9): "combination",
    ("ds3", 8): "freezer",
    ("ds3", 9): "combination",
    ("wine", 4): "combination",
    ("ds3Wine", 4): "combination",
}
_SERIES_LINES = {
    "bi": "built_in",
    "ngi": "integrated",
    "ngix": "integrated",
    "wine": "integrated",
    "pro": "pro",
    "bi5": "classic",
    "bi5Wine": "classic",
    "deu": "designer",
    "deuWine": "designer",
    "ds3": "designer",
    "ds3Wine": "designer",
}
_OUTDOOR_TYPES = {("deu", 2), ("ds3", 10)}
# DEU1550B, the beverage center with a solid door.
_SOLID_DOOR_TYPES = {("deu", 3, 0)}
# Widths in inches where the app's default name for a type gives one: by series, category
# and version, else series and category, else series.
_TYPE_WIDTHS = {
    ("bi", 1, 4): 36,
    ("bi", 3): 36,
    ("bi", 4): 36,
    ("ngi", 1, 1): 30,
    ("ngi", 6): 24,
    ("ngix", 6): 24,
    ("ngix", 7, 2): 27,
    ("wine", 2): 30,
    ("wine", 4): 30,
    ("pro", 1): 36,
    ("pro", 2): 48,
    ("bi5", 4): 36,
    ("bi5", 5): 36,
    ("bi5Wine", 1): 30,
    ("deu", 1): 24,
    ("deu", 2): 24,
    ("deu", 3, 0): 15,
    ("deu", 4): 24,
    ("deu", 5): 24,
    ("deu", 6): 24,
    ("deuWine", 1): 15,
    ("deuWine", 2): 24,
    ("deuWine", 3): 24,
    ("ds3", 3): 30,
    ("ds3", 10): 24,
    ("ds3Wine", 3): 30,
    ("ds3Wine", 4): 30,
    ("dice",): 15,
    ("eSeries",): 30,
    ("mSeries",): 30,
    ("nge",): 30,
    ("range", 2): 48,
    ("range", 3): 60,
    ("range", 4, 0): 30,
    ("range", 4, 1): 30,
    ("range", 4, 2): 36,
    ("range", 5): 36,
    ("range", 6): 48,
    ("cove",): 24,
    ("cove2",): 24,
}
# Range categories 4 to 6 are induction ranges, the others dual fuel.
_INDUCTION_CATEGORIES = {4, 5, 6}
_WALL_OVEN_SERIES = {"eSeries": "e", "mSeries": "m", "nge": None}
# Wall oven series and style by type version, from the app's demo catalog: the M series at
# versions 1 to 3 (Transitional, Contemporary, Professional), the E series at 4 and 5
# (Transitional, Professional).
_OVEN_TYPE_VERSIONS = {
    1: ("m", "transitional"),
    2: ("m", "contemporary"),
    3: ("m", "professional"),
    4: ("e", "transitional"),
    5: ("e", "professional"),
}

# What an unrecognized model's letters suggest, for the generic drawing.
_GENERIC_HINTS = (
    (("IW", "BW"), "wine"),
    (("CL", "BI", "DEC", "DET", "DEU", "IC", "IT", "ID", "PRO"), "refrigerator"),
    (("CSO", "SPO", "SO", "DO", "DF", "IR", "GR"), "oven"),
    (("CTWH", "CTIH", "PW", "PI", "PL", "VW", "VI", "VU"), "hood"),
    (("DW",), "dishwasher"),
)


def normalize_model(model: str | None) -> str:
    """The model number as the patterns read it: uppercase, without "/", "-" or spaces.

    Also drops the ICB prefix of international models (ICBDEU2450BG) and a trailing version
    such as ".0", which the app's tables show on one model (DEU2450WDZ.0).
    """
    if not isinstance(model, str):
        return ""
    code = re.sub(r"[/\-\s]", "", model.upper())
    return re.sub(r"\.\d+$", "", code).removeprefix("ICB")


def appliance_spec(model: str | None, data: dict) -> dict:
    """How to draw an appliance, as an `ApplianceSpec`.

    `model` defaults to the model number the appliance reports.
    """
    if model is None:
        model = data.get("appliance_model")
    code = _code(model)
    return (
        _from_model(code, data)
        or _from_type(code, data)
        or _from_properties(code, data)
        or _generic(_generic_form(code))
    )


def model_hints(model: str | None) -> dict[str, str]:
    """What a refrigeration model number says about its front and handles.

    In Sub-Zero's model number key, /O is an overlay (panel-ready) front and /S a stainless
    one, /P or /PH a pro handle and /T or /TH a tubular one. Gives "finish" ("panel" or
    "stainless") and "handle" ("pro" or "tubular") where the model says.
    """
    code = _code(model)
    for pattern, _, _ in _REFRIGERATION:
        if match := pattern.fullmatch(code):
            letters = set(re.findall(_SUFFIX_TOKEN, match["suffix"]))
            hints = {}
            if match.groupdict().get("overlay"):
                hints["finish"] = "panel"
            elif "S" in letters:
                hints["finish"] = "stainless"
            handles = {handle for handle, tokens in _HANDLES if letters & tokens}
            if len(handles) == 1:
                hints["handle"] = handles.pop()
            return hints
    return {}


def refrigeration_with_form(spec: dict, form: str, data: dict) -> dict:
    """A refrigeration spec drawn as another of its forms.

    Wine storage's glass doors, an ice maker's ice and the drawers of drawer units come with
    their forms, so they're worked out again for the new one; what the model number, type or
    properties gave stays.
    """
    return _refrigeration(
        form,
        data,
        line=spec["line"],
        width=spec["width"],
        glass=spec["glass"] and spec["form"] not in WINE_FORMS,
        dispenser=spec["dispenser"],
        ice=spec["ice"] and spec["form"] != "ice_maker",
        drawers=spec["drawers"] or _property_drawers(form, data),
        outdoor=spec["outdoor"],
        generic=spec["generic"],
    )


def zones(data: dict) -> int:
    """The temperature zones the appliance reports (see ZONE_KEYS)."""
    return sum(key in data for key in ZONE_KEYS)


def _code(model: str | None) -> str:
    """The model number as the patterns read it, with a service code read as its model."""
    code = normalize_model(model)
    code = SERVICE_CODE_MODELS.get(code, code)
    if re.match(r"(30|36|42|48)(UFD|U|S|R|F)", code):
        # The app's own tables name BI models without their BI prefix.
        code = f"BI{code}"
    return code


def _from_model(code: str, data: dict) -> dict | None:
    for pattern, line, configs in _REFRIGERATION:
        if match := pattern.fullmatch(code):
            form, extras = configs[match["config"]]
            extras = dict(extras)
            for modifier in re.findall(_MODIFIER, match["mods"]):
                if modifier in _GLASS:
                    extras["glass"] = True
                elif modifier in ("D", "ID"):
                    extras["dispenser"] = "external" if modifier == "D" else "internal"
                elif modifier == "O":
                    extras["outdoor"] = True
            return _refrigeration(
                form, data, line=line, width=int(match["width"]), generic=False, **extras
            )
    if match := _RANGE.fullmatch(code):
        width = int(match["width"])
        fuel = _FUELS[match["fuel"]]
        return _range(
            fuel,
            width,
            int(match["burners"]),
            list(_SURFACES.get(match["surfaces"] or "", ())),
            _range_ovens(width),
            _range_style(match["style"], match["suffix"]) or _FUEL_STYLES.get(fuel),
            generic=False,
        )
    if match := _WALL_OVEN.fullmatch(code):
        if match["l_series"] is not None:
            series, style = "l", None
        elif match["first_e"] is not None:
            # Wolf's replacement chart: the black glass oven became the Contemporary one,
            # and the pro (PH) and tubular (TH) handled ones Professional and Transitional.
            series = "e"
            style = "contemporary" if match["front"] == "G" else _suffix_style(match["suffix"])
        else:
            series, style = match["series"].lower(), _OVEN_STYLES[match["style"]]
        return _wall_oven(
            match["kind"] == "DO", int(match["width"]), series, style, data, generic=False
        )
    if match := _DISHWASHER.fullmatch(code):
        return _dishwasher(int(match["width"]), None, generic=False)
    if match := _HOOD.match(code):
        return _hood(_HOOD_FORMS[match["kind"]], int(match["width"]), generic=False)
    return None


def _from_type(code: str, data: dict) -> dict | None:
    parts = appliance_type(data)
    if parts is None:
        return None
    _, number, category, version = parts
    series = FAULT_METADATA_APPLIES_TO_BY_SERIES.get(number)
    width = next(
        (
            _TYPE_WIDTHS[key]
            for key in ((series, category, version), (series, category), (series,))
            if key in _TYPE_WIDTHS
        ),
        None,
    )
    if is_ice_maker(data):
        return _refrigeration("ice_maker", data, line="designer", width=width, generic=True)
    if is_hood(data):
        return _hood("hood", _model_width(code), generic=True)
    if series in ("cove", "cove2"):
        return _dishwasher(width, None, generic=True)
    if series == "range":
        fuel = "induction" if category in _INDUCTION_CATEGORIES else "dual_fuel"
        return _generic_range(fuel, width, has_left_and_right_ovens(data))
    if series in _WALL_OVEN_SERIES:
        oven_series, style = _WALL_OVEN_SERIES[series], None
        if series != "eSeries" and version in _OVEN_TYPE_VERSIONS:
            type_series, style = _OVEN_TYPE_VERSIONS[version]
            oven_series = oven_series or type_series
        double = category == 2 if category in (1, 2) else _has_second_cavity(data)
        return _wall_oven(double, width, oven_series, style, data, generic=True)
    if series in _SERIES_LINES:
        form = _TYPE_VERSION_FORMS.get((series, category, version))
        form = form or _TYPE_FORMS[series].get(category) or _refrigeration_form(data)
        return _refrigeration(
            form,
            data,
            line=_SERIES_LINES[series],
            width=width,
            glass=(
                form == "undercounter_beverage"
                and (series, category, version) not in _SOLID_DOOR_TYPES
            ),
            dispenser=_property_dispenser(data),
            drawers=_property_drawers(form, data) or _TYPE_DRAWERS.get((series, category)),
            outdoor=(series, category) in _OUTDOOR_TYPES,
            generic=True,
        )
    return None


def _from_properties(code: str, data: dict) -> dict | None:
    if is_dishwasher(data):
        # Cove makes only 24″ dishwashers.
        return _dishwasher(24, None, generic=True)
    if _HOOD_KEYS.intersection(data):
        return _hood("hood", _model_width(code), generic=True)
    if is_oven(data):
        # Without the range series, two cavities are a double wall oven's.
        return _wall_oven(_has_second_cavity(data), None, None, None, data, generic=True)
    if "ice_door_ajar" in data:
        # Dedicated ice makers are all 15″ wide.
        return _refrigeration("ice_maker", data, width=15, generic=True)
    if is_fridge(data) or is_wine(data) or any(key in data for key in REFRIGERATION_DOOR_KEYS):
        form = _refrigeration_form(data)
        return _refrigeration(
            form,
            data,
            dispenser=_property_dispenser(data),
            drawers=_property_drawers(form, data),
            generic=True,
        )
    return None


def _refrigeration_form(data: dict) -> str:
    """A refrigeration form that fits the zones the appliance reports."""
    if is_wine(data):
        if "ref_set_temp" in data or "frz_set_temp" in data:
            return "wine_over_drawers"
        # Single-zone wine storage is undercounter; columns have two zones.
        return "column_wine" if "wine2_set_temp" in data else "undercounter_wine"
    if "frz_set_temp" in data:
        return "over_under" if "ref_set_temp" in data else "column_freezer"
    if "ref2_set_temp" in data:
        # Tall refrigerators report their drawers as a second refrigerator zone.
        return "tall_refrigerator"
    return "column_refrigerator"


def _property_dispenser(data: dict) -> str:
    return "internal" if "internal_dispenser_enabled" in data else "none"


def _property_drawers(form: str, data: dict) -> str | None:
    """What the drawers hold, from the setpoints the appliance reports."""
    if form not in DRAWER_FORMS or not any(key in data for key in ZONE_KEYS):
        return None
    if "frz_set_temp" not in data:
        return "refrigerator"
    if form == "wine_over_drawers" or "ref_set_temp" in data:
        return "combination"
    return "freezer"


def _has_second_cavity(data: dict) -> bool:
    return any(key.startswith("cav2_") for key in data)


def _model_width(code: str) -> int | None:
    match = re.search(r"\d\d", code)
    return int(match[0]) if match else None


def _range_style(style: str | None, suffix: str) -> str | None:
    """The style an E or M code or the suffix letters give: P professional, T transitional."""
    if style:
        return "professional" if style[0] == "P" else "transitional"
    return _suffix_style(suffix)


def _suffix_style(suffix: str) -> str | None:
    """The style the suffix letters give: P or PH professional, T or TH transitional."""
    letters = set(re.findall(_SUFFIX_TOKEN, suffix))
    styles = {
        name
        for name, tokens in (("professional", {"P", "PH"}), ("transitional", {"T", "TH"}))
        if letters & tokens
    }
    return styles.pop() if len(styles) == 1 else None


def _slot(prefix: str, position: str, width: int | None) -> dict:
    return {"prefix": prefix, "position": position, "width": width}


def _range_ovens(width: int | None, two: bool | None = None) -> list[dict]:
    """A range's ovens left to right: one on 30″ and 36″ ranges, two on 48″ and 60″.

    Per Wolf's specifications and a DF48850 in use, the 48″ range has an 18″ oven on the
    left and a 30″ one, `cav`, on the right; the 60″ has two 30″ ovens. `two` sets the count
    for a range whose model is unknown, from its cavities; widths that don't fit it are
    unknown.
    """
    if two is None:
        two = width in (48, 60)
    if two:
        left, right = {48: (18, 30), 60: (30, 30)}.get(width, (None, None))
        return [_slot("cav2", "left", left), _slot("cav", "right", right)]
    return [_slot("cav", "single", width if width in (30, 36) else None)]


def _generic_range(fuel: str, width: int | None, two: bool) -> dict:
    burners = _DEFAULT_BURNERS[fuel].get(width, 5 if fuel == "induction" else 6)
    ovens = _range_ovens(width, two)
    return _range(fuel, width, burners, [], ovens, _FUEL_STYLES.get(fuel), generic=True)


def _refrigeration(
    form: str,
    data: dict,
    *,
    line: str | None = None,
    width: int | None = None,
    glass: bool = False,
    dispenser: str = "none",
    ice: bool = False,
    drawers: str | None = None,
    outdoor: bool = False,
    generic: bool,
) -> dict:
    return {
        "family": "refrigeration",
        "form": form,
        "line": line,
        "width": width,
        # Wine storage has glass doors.
        "glass": glass or form in WINE_FORMS,
        "dispenser": dispenser,
        "ice": ice or form == "ice_maker" or "ice_maker_on" in data,
        "drawers": (drawers or "refrigerator") if form in DRAWER_FORMS else None,
        "zones": zones(data),
        "outdoor": outdoor,
        "generic": generic,
    }


def _range(
    fuel: str,
    width: int | None,
    burners: int,
    surfaces: list[str],
    ovens: list[dict],
    style: str | None,
    *,
    generic: bool,
) -> dict:
    return {
        "family": "range",
        "form": "range",
        "width": width,
        "fuel": fuel,
        "burners": burners,
        "surfaces": surfaces,
        "ovens": ovens,
        "style": style,
        "generic": generic,
    }


def _wall_oven(
    double: bool,
    width: int | None,
    series: str | None,
    style: str | None,
    data: dict,
    *,
    generic: bool,
) -> dict:
    parts = appliance_type(data)
    ovens = (
        [_slot("cav", "upper", width), _slot("cav2", "lower", width)]
        if double
        else [_slot("cav", "single", width)]
    )
    return {
        "family": "wall_oven",
        "form": "double" if double else "single",
        "width": width,
        "series": series,
        "style": style,
        "ovens": ovens,
        # KNOB_OVEN_TYPES leaves out the leading number appliance_type() keeps.
        "knob": parts is not None and parts[1:] in KNOB_OVEN_TYPES,
        "generic": generic,
    }


def _dishwasher(width: int | None, front: str | None, *, generic: bool) -> dict:
    return {
        "family": "dishwasher",
        "form": "dishwasher",
        "width": width,
        "front": front,
        "generic": generic,
    }


def _hood(form: str, width: int | None, *, generic: bool) -> dict:
    return {"family": "hood", "form": form, "width": width, "generic": generic}


def _generic(form: str) -> dict:
    return {"family": "generic", "form": form, "width": None, "generic": True}


def _generic_form(code: str) -> str:
    for prefixes, form in _GENERIC_HINTS:
        if code.startswith(prefixes):
            return form
    return "appliance"
