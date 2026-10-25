"""How the sidebar panel draws each appliance: the spec from its model number and properties."""

import json
from datetime import datetime
from pathlib import Path

import pytest

from custom_components.subzero.appliance_spec import (
    FORMS,
    SERVICE_CODE_MODELS,
    appliance_spec,
    model_hints,
    normalize_model,
    refrigeration_with_form,
)
from custom_components.subzero.const import PRIVATE_KEYS, STATE_KEYS, TIMESTAMP_KEYS

FIXTURES = Path(__file__).parent / "fixtures" / "appliances"


def refrigeration(form, line, width, flags="", *, zones=0, generic=False):
    """A RefrigerationSpec.

    `flags` names what's set: glass, ice, outdoor, the dispenser (external or internal) and
    what the drawers hold (refrigerator, freezer or combination).
    """
    flags = flags.split()
    return {
        "family": "refrigeration",
        "form": form,
        "line": line,
        "width": width,
        "glass": "glass" in flags,
        "dispenser": next((flag for flag in flags if flag in ("external", "internal")), "none"),
        "ice": "ice" in flags,
        "drawers": next(
            (flag for flag in flags if flag in ("refrigerator", "freezer", "combination")), None
        ),
        "zones": zones,
        "outdoor": "outdoor" in flags,
        "generic": generic,
    }


def oven(prefix, position, width):
    return {"prefix": prefix, "position": position, "width": width}


# A range's ovens by width: one on 30″ and 36″ ranges; on 48″ an 18″ oven on the left and a
# 30″ one on the right, as on the owner's DF48850 and Wolf's specifications; on 60″ two 30″
# ovens.
RANGE_OVENS = {
    30: [oven("cav", "single", 30)],
    36: [oven("cav", "single", 36)],
    48: [oven("cav2", "left", 18), oven("cav", "right", 30)],
    60: [oven("cav2", "left", 30), oven("cav", "right", 30)],
}


def range_spec(fuel, width, burners, surfaces=(), style=None, *, ovens=None, generic=False):
    return {
        "family": "range",
        "form": "range",
        "width": width,
        "fuel": fuel,
        "burners": burners,
        "surfaces": list(surfaces),
        "ovens": RANGE_OVENS[width] if ovens is None else ovens,
        "style": style,
        "generic": generic,
    }


def wall_oven(form, width, series, style, *, knob=False, generic=False):
    ovens = (
        [oven("cav", "upper", width), oven("cav2", "lower", width)]
        if form == "double"
        else [oven("cav", "single", width)]
    )
    return {
        "family": "wall_oven",
        "form": form,
        "width": width,
        "series": series,
        "style": style,
        "ovens": ovens,
        "knob": knob,
        "generic": generic,
    }


def dishwasher(front, width=24, *, generic=False):
    return {
        "family": "dishwasher",
        "form": "dishwasher",
        "width": width,
        "front": front,
        "generic": generic,
    }


def hood(form, width, *, generic=False):
    return {"family": "hood", "form": form, "width": width, "generic": generic}


def generic(form):
    return {"family": "generic", "form": form, "width": None, "generic": True}


# Every refrigeration model number in the Sub-Zero app's default-name table and demo
# catalog: form, line, width, and the flags the model sets.
REFRIGERATION = {
    # The default-name table, which names BI models without their BI prefix.
    "30U": ("over_under", "built_in", 30, "ice"),
    "30UG": ("over_under", "built_in", 30, "glass ice"),
    "36U": ("over_under", "built_in", 36, "ice"),
    "36UG": ("over_under", "built_in", 36, "glass ice"),
    "36UFD": ("french_door", "built_in", 36, "ice"),
    "36UFDID": ("french_door", "built_in", 36, "internal ice"),
    "42UFD": ("french_door", "built_in", 42, "ice"),
    "42UFDID": ("french_door", "built_in", 42, "internal ice"),
    "36S": ("side_by_side", "built_in", 36, "ice"),
    "42S": ("side_by_side", "built_in", 42, "ice"),
    "42SD": ("side_by_side", "built_in", 42, "external ice"),
    "42SID": ("side_by_side", "built_in", 42, "internal ice"),
    "48S": ("side_by_side", "built_in", 48, "ice"),
    "48SD": ("side_by_side", "built_in", 48, "external ice"),
    "48SID": ("side_by_side", "built_in", 48, "internal ice"),
    "IC18FI": ("column_freezer", "integrated", 18, "ice"),
    "IC24FI": ("column_freezer", "integrated", 24, "ice"),
    "IC36FI": ("column_freezer", "integrated", 36, "ice"),
    "IC30FI": ("column_freezer", "integrated", 30, "ice"),
    "IC24R": ("column_refrigerator", "integrated", 24),
    "IC30R": ("column_refrigerator", "integrated", 30),
    "IC30RID": ("column_refrigerator", "integrated", 30, "internal"),
    "IC36RID": ("column_refrigerator", "integrated", 36, "internal"),
    "IC36R": ("column_refrigerator", "integrated", 36),
    "ID24F": ("undercounter_drawers", "integrated", 24, "freezer"),
    "ID24FI": ("undercounter_drawers", "integrated", 24, "ice freezer"),
    "ID30F": ("undercounter_drawers", "integrated", 30, "freezer"),
    "ID30FI": ("undercounter_drawers", "integrated", 30, "ice freezer"),
    "ID24R": ("undercounter_drawers", "integrated", 24, "refrigerator"),
    "ID27R": ("undercounter_drawers", "integrated", 27, "refrigerator"),
    "ID30RP": ("undercounter_drawers", "integrated", 30, "refrigerator"),
    "ID30R": ("undercounter_drawers", "integrated", 30, "refrigerator"),
    "ID36R": ("undercounter_drawers", "integrated", 36, "refrigerator"),
    "ID36RP": ("undercounter_drawers", "integrated", 36, "refrigerator"),
    "ID30C": ("undercounter_drawers", "integrated", 30, "combination"),
    "ID30CI": ("undercounter_drawers", "integrated", 30, "ice combination"),
    "ID36CI": ("undercounter_drawers", "integrated", 36, "ice combination"),
    "ID36C": ("undercounter_drawers", "integrated", 36, "combination"),
    "IT30R": ("tall_refrigerator", "integrated", 30),
    "IT30RID": ("tall_refrigerator", "integrated", 30, "internal"),
    "IT36R": ("tall_refrigerator", "integrated", 36),
    "IT36RID": ("tall_refrigerator", "integrated", 36, "internal"),
    "IT30CI": ("tall_over_under", "integrated", 30, "ice"),
    "IT30FI": ("tall_freezer", "integrated", 30, "ice"),
    "IT30CIID": ("tall_over_under", "integrated", 30, "internal ice"),
    "IT36CI": ("tall_over_under", "integrated", 36, "ice"),
    "IT36CIID": ("tall_over_under", "integrated", 36, "internal ice"),
    "IW18": ("column_wine", "integrated", 18, "glass"),
    "IW24": ("column_wine", "integrated", 24, "glass"),
    "IW30": ("column_wine", "integrated", 30, "glass"),
    "CL3050U": ("over_under", "classic", 30, "ice"),
    "CL3650U": ("over_under", "classic", 36, "ice"),
    "CL3650UG": ("over_under", "classic", 36, "glass ice"),
    "CL3050UG": ("over_under", "classic", 30, "glass ice"),
    "CL3050UID": ("over_under", "classic", 30, "internal ice"),
    "CL3650UID": ("over_under", "classic", 36, "internal ice"),
    "CL3650UFD": ("french_door", "classic", 36, "ice"),
    "CL4250UFD": ("french_door", "classic", 42, "ice"),
    "CL4850UFD": ("french_door", "classic", 48, "ice"),
    "CL3650UFDID": ("french_door", "classic", 36, "internal ice"),
    "CL4250UFDID": ("french_door", "classic", 42, "internal ice"),
    "CL4850UFDID": ("french_door", "classic", 48, "internal ice"),
    "CL4250S": ("side_by_side", "classic", 42, "ice"),
    "CL4850S": ("side_by_side", "classic", 48, "ice"),
    "CL4250SD": ("side_by_side", "classic", 42, "external ice"),
    "CL4850SD": ("side_by_side", "classic", 48, "external ice"),
    "CL4250SID": ("side_by_side", "classic", 42, "internal ice"),
    "CL4850SID": ("side_by_side", "classic", 48, "internal ice"),
    "DEU1550BG": ("undercounter_beverage", "designer", 15, "glass"),
    "DEU1550I": ("ice_maker", "designer", 15, "ice"),
    "DEU1550IP": ("ice_maker", "designer", 15, "ice"),
    "DEU1550IPO": ("ice_maker", "designer", 15, "ice outdoor"),
    "DEU1550BGSZ": ("undercounter_beverage", "designer", 15, "glass"),
    "DEU2450BG": ("undercounter_beverage", "designer", 24, "glass"),
    "DEU2450BGSZ": ("undercounter_beverage", "designer", 24, "glass"),
    "DET3050CI": ("tall_over_under", "designer", 30, "ice"),
    "DET3650CI": ("tall_over_under", "designer", 36, "ice"),
    "DET3050CIID": ("tall_over_under", "designer", 30, "internal ice"),
    "DET3650CIID": ("tall_over_under", "designer", 36, "internal ice"),
    "DET3050R": ("tall_refrigerator", "designer", 30),
    "DET3650R": ("tall_refrigerator", "designer", 36),
    "DET3050RID": ("tall_refrigerator", "designer", 30, "internal"),
    "DET3650RID": ("tall_refrigerator", "designer", 36, "internal"),
    "DEC2450R": ("column_refrigerator", "designer", 24),
    "DEC3050R": ("column_refrigerator", "designer", 30),
    "DEC3650R": ("column_refrigerator", "designer", 36),
    "DEC3050RID": ("column_refrigerator", "designer", 30, "internal"),
    "DEC3650RID": ("column_refrigerator", "designer", 36, "internal"),
    "DEC1850FI": ("column_freezer", "designer", 18, "ice"),
    "DEC2450FI": ("column_freezer", "designer", 24, "ice"),
    "DEC3050FI": ("column_freezer", "designer", 30, "ice"),
    "DEC3650FI": ("column_freezer", "designer", 36, "ice"),
    "DEU2450DR": ("undercounter_drawers", "designer", 24, "refrigerator"),
    "DEU2750DR": ("undercounter_drawers", "designer", 27, "refrigerator"),
    "DEU3050DR": ("undercounter_drawers", "designer", 30, "refrigerator"),
    "DEU3650DR": ("undercounter_drawers", "designer", 36, "refrigerator"),
    "DEU2450DFI": ("undercounter_drawers", "designer", 24, "ice freezer"),
    "DEU3050DFI": ("undercounter_drawers", "designer", 30, "ice freezer"),
    "DEU2450DF": ("undercounter_drawers", "designer", 24, "freezer"),
    "DEU3050DF": ("undercounter_drawers", "designer", 30, "freezer"),
    "DEU3050DCI": ("undercounter_drawers", "designer", 30, "ice combination"),
    "DEU3650DCI": ("undercounter_drawers", "designer", 36, "ice combination"),
    "DEU3050DC": ("undercounter_drawers", "designer", 30, "combination"),
    "DEU3650DC": ("undercounter_drawers", "designer", 36, "combination"),
    "DEC1850W": ("column_wine", "designer", 18, "glass"),
    "DEC2450W": ("column_wine", "designer", 24, "glass"),
    "DEC3050W": ("column_wine", "designer", 30, "glass"),
    "DET3050WR": ("wine_over_drawers", "designer", 30, "glass refrigerator"),
    "DET3050WCI": ("wine_over_drawers", "designer", 30, "glass ice combination"),
    "IC18FIX": ("column_freezer", "integrated", 18, "ice"),
    "IC24FIX": ("column_freezer", "integrated", 24, "ice"),
    "IC36FIX": ("column_freezer", "integrated", 36, "ice"),
    "IC30FIX": ("column_freezer", "integrated", 30, "ice"),
    "IC24RX": ("column_refrigerator", "integrated", 24),
    "IC30RX": ("column_refrigerator", "integrated", 30),
    "IC30RIDX": ("column_refrigerator", "integrated", 30, "internal"),
    "IC36RIDX": ("column_refrigerator", "integrated", 36, "internal"),
    "ID24FX": ("undercounter_drawers", "integrated", 24, "freezer"),
    "ID24FIX": ("undercounter_drawers", "integrated", 24, "ice freezer"),
    "ID30FX": ("undercounter_drawers", "integrated", 30, "freezer"),
    "ID24RX": ("undercounter_drawers", "integrated", 24, "refrigerator"),
    "ID27RX": ("undercounter_drawers", "integrated", 27, "refrigerator"),
    "ID30RX": ("undercounter_drawers", "integrated", 30, "refrigerator"),
    "ID30CIX": ("undercounter_drawers", "integrated", 30, "ice combination"),
    "ID30FIX": ("undercounter_drawers", "integrated", 30, "ice freezer"),
    "IT30RX": ("tall_refrigerator", "integrated", 30),
    "IT30RIDX": ("tall_refrigerator", "integrated", 30, "internal"),
    "IT36RX": ("tall_refrigerator", "integrated", 36),
    "IT36RIDX": ("tall_refrigerator", "integrated", 36, "internal"),
    "IT30CIX": ("tall_over_under", "integrated", 30, "ice"),
    "IT30CIIDX": ("tall_over_under", "integrated", 30, "internal ice"),
    "IT36CIX": ("tall_over_under", "integrated", 36, "ice"),
    "IT36CIIDX": ("tall_over_under", "integrated", 36, "internal ice"),
    # The app names these "Drawer Refrigerator", but ID30C "Drawer Combination", and both
    # its type (category 9) and Sub-Zero's names say combination.
    "ID-30C": ("undercounter_drawers", "integrated", 30, "combination"),
    "ID-30CX": ("undercounter_drawers", "integrated", 30, "combination"),
    "ID-36C": ("undercounter_drawers", "integrated", 36, "combination"),
    "ID-36CX": ("undercounter_drawers", "integrated", 36, "combination"),
    # The demo catalog, and its featured devices.
    "BI-30U": ("over_under", "built_in", 30, "ice"),
    "BI-30UG": ("over_under", "built_in", 30, "glass ice"),
    "BI-36U": ("over_under", "built_in", 36, "ice"),
    "BI-36UG": ("over_under", "built_in", 36, "glass ice"),
    "BI-36UID": ("over_under", "built_in", 36, "internal ice"),
    "BI-36UFD": ("french_door", "built_in", 36, "ice"),
    "BI-36UFDID": ("french_door", "built_in", 36, "internal ice"),
    "BI-42UFD": ("french_door", "built_in", 42, "ice"),
    "BI-42UFDID": ("french_door", "built_in", 42, "internal ice"),
    "BI-36S": ("side_by_side", "built_in", 36, "ice"),
    "BI-42S": ("side_by_side", "built_in", 42, "ice"),
    "BI-42SD": ("side_by_side", "built_in", 42, "external ice"),
    "BI-42SID": ("side_by_side", "built_in", 42, "internal ice"),
    "BI-48S": ("side_by_side", "built_in", 48, "ice"),
    "BI-48SD": ("side_by_side", "built_in", 48, "external ice"),
    "BI-48SID": ("side_by_side", "built_in", 48, "internal ice"),
    "BI-36R": ("column_refrigerator", "built_in", 36),
    "BI-36F": ("column_freezer", "built_in", 36, "ice"),
    "BI-36RG": ("column_refrigerator", "built_in", 36, "glass"),
    "BI-36RID": ("column_refrigerator", "built_in", 36, "internal"),
    "IC-18FI": ("column_freezer", "integrated", 18, "ice"),
    "IC-24FI": ("column_freezer", "integrated", 24, "ice"),
    "IC-36FI": ("column_freezer", "integrated", 36, "ice"),
    "IC-30FI": ("column_freezer", "integrated", 30, "ice"),
    "IC-24R": ("column_refrigerator", "integrated", 24),
    "IC-30R": ("column_refrigerator", "integrated", 30),
    "IC-36R": ("column_refrigerator", "integrated", 36),
    # A refrigerator and a freezer behind one door.
    "IC-24CI": ("column_refrigerator", "integrated", 24, "ice"),
    "IC-24C": ("column_refrigerator", "integrated", 24),
    "ID-24F": ("undercounter_drawers", "integrated", 24, "freezer"),
    "ID-24FI": ("undercounter_drawers", "integrated", 24, "ice freezer"),
    "ID-30F": ("undercounter_drawers", "integrated", 30, "freezer"),
    "ID-30FI": ("undercounter_drawers", "integrated", 30, "ice freezer"),
    "ID-24R": ("undercounter_drawers", "integrated", 24, "refrigerator"),
    "ID-27R": ("undercounter_drawers", "integrated", 27, "refrigerator"),
    "ID-30RP": ("undercounter_drawers", "integrated", 30, "refrigerator"),
    "ID-30R": ("undercounter_drawers", "integrated", 30, "refrigerator"),
    "ID-36R": ("undercounter_drawers", "integrated", 36, "refrigerator"),
    "ID-36RP": ("undercounter_drawers", "integrated", 36, "refrigerator"),
    "ID-30CI": ("undercounter_drawers", "integrated", 30, "ice combination"),
    "ID-36CI": ("undercounter_drawers", "integrated", 36, "ice combination"),
    "IT-30R": ("tall_refrigerator", "integrated", 30),
    "IT-30RID": ("tall_refrigerator", "integrated", 30, "internal"),
    "IT-36R": ("tall_refrigerator", "integrated", 36),
    "IT-36RID": ("tall_refrigerator", "integrated", 36, "internal"),
    "IT-30CI": ("tall_over_under", "integrated", 30, "ice"),
    "IT-30CIID": ("tall_over_under", "integrated", 30, "internal ice"),
    "IT-36CI": ("tall_over_under", "integrated", 36, "ice"),
    "IT-36CIID": ("tall_over_under", "integrated", 36, "internal ice"),
    "IW-18": ("column_wine", "integrated", 18, "glass"),
    "IW-24": ("column_wine", "integrated", 24, "glass"),
    "IW-30": ("column_wine", "integrated", 30, "glass"),
    "IW-30R": ("wine_over_drawers", "integrated", 30, "glass refrigerator"),
    "IW-30CI": ("wine_over_drawers", "integrated", 30, "glass ice combination"),
    "PRO3650": ("over_under", "pro", 36, "ice"),
    "PRO3650G": ("over_under", "pro", 36, "glass ice"),
    "CL3650R": ("column_refrigerator", "classic", 36),
    "CL3650RG": ("column_refrigerator", "classic", 36, "glass"),
    "CL3650RID": ("column_refrigerator", "classic", 36, "internal"),
    "CL3650F": ("column_freezer", "classic", 36, "ice"),
    "CL3050W": ("column_wine", "classic", 30, "glass"),
    "DEU2450R": ("undercounter_refrigerator", "designer", 24),
    "DEU2450RO": ("undercounter_refrigerator", "designer", 24, "outdoor"),
    # A solid door; BG is the glass one.
    "DEU1550B": ("undercounter_beverage", "designer", 15),
    # A refrigerator and a freezer behind one door.
    "DEU2450CI": ("undercounter_refrigerator", "designer", 24, "ice"),
    "DEU2450RADA": ("undercounter_refrigerator", "designer", 24),
    "DEU2450BGADA": ("undercounter_beverage", "designer", 24, "glass"),
    "DEU1550W": ("undercounter_wine", "designer", 15, "glass"),
    "DEU2450WADA": ("undercounter_wine", "designer", 24, "glass"),
    "DEU2450W": ("undercounter_wine", "designer", 24, "glass"),
    "DET3050FI": ("tall_freezer", "designer", 30, "ice"),
    "DEU2450DRO": ("undercounter_drawers", "designer", 24, "refrigerator outdoor"),
    "IC-18FIX": ("column_freezer", "integrated", 18, "ice"),
    "DEU1550NI": ("ice_maker", "designer", 15, "ice"),
    "CL3650UG/S/P": ("over_under", "classic", 36, "glass ice"),
    # Sub-Zero nomenclature: the PRO 48, hinge and handle letters, the owner's wine storage,
    # outdoor drawers, the BI wine storage, international and versioned model numbers.
    "PRO4850": ("side_by_side", "pro", 48, "ice"),
    "PRO4850G": ("side_by_side", "pro", 48, "glass ice"),
    "CL3650UG/S/T": ("over_under", "classic", 36, "glass ice"),
    "DEC3050RID/R": ("column_refrigerator", "designer", 30, "internal"),
    "DEU2450R/L": ("undercounter_refrigerator", "designer", 24),
    "DEU2450WDZ": ("undercounter_wine", "designer", 24, "glass"),
    "DEU2450WDZ.0": ("undercounter_wine", "designer", 24, "glass"),
    "ID-24RO": ("undercounter_drawers", "integrated", 24, "refrigerator outdoor"),
    "IW-30RH": ("column_wine", "integrated", 30, "glass"),
    "BW-30/S": ("column_wine", "built_in", 30, "glass"),
    "ICBDEU2450BG": ("undercounter_beverage", "designer", 24, "glass"),
    " cl 4850-sid ": ("side_by_side", "classic", 48, "internal ice"),
    # Sub-Zero's model number key: /O an overlay (panel-ready) front, A or HAG a high-altitude
    # glass door, with the stainless, handle and hinge letters after them.
    "CL3650UFD/O": ("french_door", "classic", 36, "ice"),
    "CL3650UFDID/O": ("french_door", "classic", 36, "internal ice"),
    "CL4850SID/O": ("side_by_side", "classic", 48, "internal ice"),
    "CL4850SD/O": ("side_by_side", "classic", 48, "external ice"),
    "CL3650U/O/L": ("over_under", "classic", 36, "ice"),
    "BI-36UFD/O": ("french_door", "built_in", 36, "ice"),
    "BI-36U/O": ("over_under", "built_in", 36, "ice"),
    "BI-48SD/O": ("side_by_side", "built_in", 48, "external ice"),
    "BW-30/O": ("column_wine", "built_in", 30, "glass"),
    "CL3650RA/S/P/L": ("column_refrigerator", "classic", 36, "glass"),
    "CL3650UA/S/T/R": ("over_under", "classic", 36, "glass ice"),
    "BI-36RHAG": ("column_refrigerator", "built_in", 36, "glass"),
    "IW-30CIA-RH": ("wine_over_drawers", "integrated", 30, "glass ice combination"),
}

# Every Wolf range in the app's default-name table and demo catalog, then color, induction
# and older names from its pictures and Wolf's model timeline: fuel, width, burners,
# surfaces left to right, style.
RANGES = {
    "DF304PMSPH": ("dual_fuel", 30, 4, (), "professional"),
    "DF304PMSPHLP": ("dual_fuel", 30, 4, (), "professional"),
    "DF30450SP": ("dual_fuel", 30, 4, (), "professional"),
    "DF30450SPLP": ("dual_fuel", 30, 4, (), "professional"),
    "DF366PMSPH": ("dual_fuel", 36, 6, (), "professional"),
    "DF366PMSPHLP": ("dual_fuel", 36, 6, (), "professional"),
    "DF36650SP": ("dual_fuel", 36, 6, (), "professional"),
    "DF36650SPLP": ("dual_fuel", 36, 6, (), "professional"),
    "DF364GPMSPH": ("dual_fuel", 36, 4, ("griddle",), "professional"),
    "DF364GPMSPHLP": ("dual_fuel", 36, 4, ("griddle",), "professional"),
    "DF36450GSP": ("dual_fuel", 36, 4, ("griddle",), "professional"),
    "DF36450GSPLP": ("dual_fuel", 36, 4, ("griddle",), "professional"),
    "DF364CPMSPH": ("dual_fuel", 36, 4, ("charbroiler",), "professional"),
    "DF364CPMSPHLP": ("dual_fuel", 36, 4, ("charbroiler",), "professional"),
    "DF36450CSP": ("dual_fuel", 36, 4, ("charbroiler",), "professional"),
    "DF36450CSPLP": ("dual_fuel", 36, 4, ("charbroiler",), "professional"),
    "DF486GPMSPH": ("dual_fuel", 48, 6, ("griddle",), "professional"),
    "DF486GPMSPHLP": ("dual_fuel", 48, 6, ("griddle",), "professional"),
    "DF48650GSP": ("dual_fuel", 48, 6, ("griddle",), "professional"),
    "DF48650GSPLP": ("dual_fuel", 48, 6, ("griddle",), "professional"),
    "DF486CPMSPH": ("dual_fuel", 48, 6, ("charbroiler",), "professional"),
    "DF486CPMSPHLP": ("dual_fuel", 48, 6, ("charbroiler",), "professional"),
    "DF48650CSP": ("dual_fuel", 48, 6, ("charbroiler",), "professional"),
    "DF48650CSPLP": ("dual_fuel", 48, 6, ("charbroiler",), "professional"),
    "DF484CGPMSPH": ("dual_fuel", 48, 4, ("charbroiler", "griddle"), "professional"),
    "DF484CGPMSPHLP": ("dual_fuel", 48, 4, ("charbroiler", "griddle"), "professional"),
    "DF48450CGSP": ("dual_fuel", 48, 4, ("charbroiler", "griddle"), "professional"),
    "DF48450CGSPLP": ("dual_fuel", 48, 4, ("charbroiler", "griddle"), "professional"),
    "DF484DGPMSPH": ("dual_fuel", 48, 4, ("double_griddle",), "professional"),
    "DF484DGPMSPHLP": ("dual_fuel", 48, 4, ("double_griddle",), "professional"),
    "DF48450DGSP": ("dual_fuel", 48, 4, ("double_griddle",), "professional"),
    "DF48450DGSPLP": ("dual_fuel", 48, 4, ("double_griddle",), "professional"),
    "DF484FPMSPH": ("dual_fuel", 48, 4, ("french_top",), "professional"),
    "DF484FPMSPHLP": ("dual_fuel", 48, 4, ("french_top",), "professional"),
    "DF48450FSP": ("dual_fuel", 48, 4, ("french_top",), "professional"),
    "DF48450FSPLP": ("dual_fuel", 48, 4, ("french_top",), "professional"),
    "DF488PMSPH": ("dual_fuel", 48, 8, (), "professional"),
    "DF488PMSPHLP": ("dual_fuel", 48, 8, (), "professional"),
    "DF48850SP": ("dual_fuel", 48, 8, (), "professional"),
    "DF48850SPLP": ("dual_fuel", 48, 8, (), "professional"),
    "DF606CGPMSPH": ("dual_fuel", 60, 6, ("charbroiler", "griddle"), "professional"),
    "DF606CGPMSPHLP": ("dual_fuel", 60, 6, ("charbroiler", "griddle"), "professional"),
    "DF60650CGSP": ("dual_fuel", 60, 6, ("charbroiler", "griddle"), "professional"),
    "DF60650CGSPLP": ("dual_fuel", 60, 6, ("charbroiler", "griddle"), "professional"),
    "DF606DGPMSPH": ("dual_fuel", 60, 6, ("double_griddle",), "professional"),
    "DF606DGPMSPHLP": ("dual_fuel", 60, 6, ("double_griddle",), "professional"),
    "DF60650DGSP": ("dual_fuel", 60, 6, ("double_griddle",), "professional"),
    "DF60650DGSPLP": ("dual_fuel", 60, 6, ("double_griddle",), "professional"),
    "DF606FPMSPH": ("dual_fuel", 60, 6, ("french_top",), "professional"),
    "DF606FPMSPHLP": ("dual_fuel", 60, 6, ("french_top",), "professional"),
    "DF60650FSP": ("dual_fuel", 60, 6, ("french_top",), "professional"),
    "DF60650FSPLP": ("dual_fuel", 60, 6, ("french_top",), "professional"),
    "IR304TMSTH": ("induction", 30, 4, (), "transitional"),
    "IR365TMSTH": ("induction", 36, 5, (), "transitional"),
    "DF48850/S/P": ("dual_fuel", 48, 8, (), "professional"),
    "IR36550/S/T": ("induction", 36, 5, (), "transitional"),
    "DF30450BKP": ("dual_fuel", 30, 4, (), "professional"),
    "DF36450CBUPLP": ("dual_fuel", 36, 4, ("charbroiler",), "professional"),
    "DF48450CGWHP": ("dual_fuel", 48, 4, ("charbroiler", "griddle"), "professional"),
    "DF60650FRDPLP": ("dual_fuel", 60, 6, ("french_top",), "professional"),
    "IR30450SP": ("induction", 30, 4, (), "professional"),
    "IR30450ST": ("induction", 30, 4, (), "transitional"),
    "IR36550SP": ("induction", 36, 5, (), "professional"),
    "IR304PE/S/PH": ("induction", 30, 4, (), "professional"),
    "IR304TE/S/TH": ("induction", 30, 4, (), "transitional"),
    "ICBDF30450/S/P": ("dual_fuel", 30, 4, (), "professional"),
    "DF484DC": ("dual_fuel", 48, 4, ("charbroiler", "charbroiler"), "professional"),
    "DF604CF": ("dual_fuel", 60, 4, ("charbroiler", "french_top"), "professional"),
    "DF604GF": ("dual_fuel", 60, 4, ("griddle", "french_top"), "professional"),
    "GR304": ("gas", 30, 4, (), "professional"),
    "GR486G": ("gas", 48, 6, ("griddle",), "professional"),
}

# Every wall oven in the app's demo catalog, then older names, a 24″ oven, and the
# convection steam and speed ovens drawn as single ovens: form, width, series, style.
WALL_OVENS = {
    "DO30-2": ("double", 30, "e", None),
    "SO30-2": ("single", 30, "e", None),
    "DO30TM": ("double", 30, "m", "transitional"),
    "SO30TM": ("single", 30, "m", "transitional"),
    "DO30CM": ("double", 30, "m", "contemporary"),
    "SO30CM": ("single", 30, "m", "contemporary"),
    "DO30PM": ("double", 30, "m", "professional"),
    "SO30PM": ("single", 30, "m", "professional"),
    "SO3050TE": ("single", 30, "e", "transitional"),
    "SO3050PE": ("single", 30, "e", "professional"),
    "DO3050TE": ("double", 30, "e", "transitional"),
    "DO3050PE": ("double", 30, "e", "professional"),
    "SO3050PE/S/P": ("single", 30, "e", "professional"),
    "DO3050PM/S/P": ("double", 30, "m", "professional"),
    "SO30PMSP": ("single", 30, "m", "professional"),
    "SO3050PM/S/PH": ("single", 30, "m", "professional"),
    "SO30CE/B/TH": ("single", 30, "e", "contemporary"),
    "SO2450TE/S/TH": ("single", 24, "e", "transitional"),
    "CSO30PM/S/PH": ("single", 30, "m", "professional"),
    "SPO24TE/S/TH": ("single", 24, "e", "transitional"),
    # Wolf's E series timeline: the first E series ovens, SO30-2 and DO30-2, whose black
    # glass (G), pro handle (PH) and tubular handle (TH) models Wolf's replacement chart
    # matches with the Contemporary, Professional and Transitional ones.
    "DO30-2F/S": ("double", 30, "e", None),
    "SO30-2U/S": ("single", 30, "e", None),
    "SO30-2G/B": ("single", 30, "e", "contemporary"),
    "DO30-2G/B": ("double", 30, "e", "contemporary"),
    "SO30-2F/S-PH": ("single", 30, "e", "professional"),
    "SO30-2U/S-TH": ("single", 30, "e", "transitional"),
    "DO30-2F/S-TH": ("double", 30, "e", "transitional"),
    # Wolf's L series timeline: framed (F) and unframed (U) doors, and a 36″ single oven.
    "SO30U/S": ("single", 30, "l", None),
    "SO30F/S": ("single", 30, "l", None),
    "DO30U/B": ("double", 30, "l", None),
    "SO36U/S": ("single", 36, "l", None),
}

# WS is the water softener: every Cove takes a panel or the stainless kit, so no front.
DISHWASHERS = {"DW2450": None, "DW2450WS": None, "DW2451": None}

# The app's demo hood, and Wolf's wall, island and insert names.
HOODS = {
    "VWLP3050PS6": ("wall", 30),
    "PW362418": ("wall", 36),
    "VW30S": ("wall", 30),
    "PI663418": ("island", 66),
    "VI42S": ("island", 42),
    "PL342212": ("insert", 34),
    "VL361950P": ("insert", 36),
    "VU30S": ("insert", 30),
}

# The app's demo catalog: each model number with the appliance type it's paired with. Some
# pairings are the app's shortcuts, such as PRO3650 for the 48″ type; the model still
# decides.
DEMO_CATALOG = """
1.1.1.0 BI-30U
1.1.1.1 BI-30UG
1.1.1.0 BI-36U
1.1.1.1 BI-36UG
1.1.1.4 BI-36UID
1.1.1.2 BI-36UFD
1.1.1.12 BI-36UFDID
1.1.1.2 BI-42UFD
1.1.1.12 BI-42UFDID
1.1.2.0 BI-36S
1.1.2.0 BI-42S
1.1.2.3 BI-42SD
1.1.2.4 BI-42SID
1.1.2.0 BI-48S
1.1.2.3 BI-48SD
1.1.2.4 BI-48SID
1.1.3.0 BI-36R
1.1.4.0 BI-36F
1.1.3.1 BI-36RG
1.1.3.4 BI-36RID
1.3.2.1 DO30-2
1.3.1.1 SO30-2
1.3.2.2 DO30-2
1.3.1.2 SO30-2
1.4.2.1 DO30TM
1.4.1.1 SO30TM
1.4.2.2 DO30CM
1.4.1.2 SO30CM
1.4.2.3 DO30PM
1.4.1.3 SO30PM
1.6.1.0 DW2450
1.6.1.1 DW2450WS
17.2.5.0 IC-18FI
17.2.5.0 IC-24FI
17.2.5.0 IC-36FI
17.2.5.0 IC-30FI
17.2.4.1 IC-24R
17.2.4.1 IC-30R
17.2.4.1 IC-36R
17.2.6.0 IC-24CI
17.2.6.1 IC-24C
17.2.8.1 ID-24F
17.2.8.0 ID-24FI
17.2.8.1 ID-30F
17.2.8.0 ID-30FI
17.2.7.1 ID-24R
17.2.7.1 ID-27R
17.2.7.2 ID-30RP
17.2.7.1 ID-30R
17.2.7.1 ID-36R
17.2.7.2 ID-36RP
17.2.9.1 ID-30C
17.2.9.0 ID-30CI
17.2.9.0 ID-36CI
17.2.9.1 ID-36C
17.2.2.1 IT-30R
17.2.2.3 IT-30RID
17.2.2.1 IT-36R
17.2.2.3 IT-36RID
17.2.1.0 IT-30CI
17.2.1.3 IT-30CIID
17.2.1.0 IT-36CI
17.2.1.3 IT-36CIID
17.5.1.0 IW-18
17.5.1.0 IW-24
17.5.1.0 IW-30
17.5.2.0 IW-30R
17.5.4.0 IW-30CI
17.7.2.0 PRO3650
17.7.2.1 PRO3650
17.7.1.0 PRO3650
17.7.1.1 PRO3650G
17.8.1.0 DF304PMSPH
17.8.1.0 DF366PMSPH
17.8.1.0 DF364GPMSPH
17.8.1.0 DF364CPMSPH
17.8.2.0 DF486GPMSPH
17.8.2.0 DF486CPMSPH
17.8.2.0 DF484CGPMSPH
17.8.2.0 DF484DGPMSPH
17.8.2.0 DF484FPMSPH
17.8.2.0 DF488PMSPH
17.8.3.0 DF606CGPMSPH
17.8.4.0 IR304TMSTH
17.8.5.0 IR365TMSTH
17.11.1.0 CL3050U
17.11.1.0 CL3650U
17.11.1.1 CL3650UG
17.11.1.1 CL3050UG
17.11.1.3 CL3050UID
17.11.1.3 CL3650UID
17.11.2.0 CL3650UFD
17.11.2.0 CL4250UFD
17.11.2.0 CL4850UFD
17.11.2.3 CL3650UFDID
17.11.2.3 CL4250UFDID
17.11.2.3 CL4850UFDID
17.11.3.0 CL4250S
17.11.3.0 CL4850S
17.11.3.2 CL4250SD
17.11.3.2 CL4850SD
17.11.3.3 CL4250SID
17.11.3.3 CL4850SID
17.11.4.0 CL3650R
17.11.4.1 CL3650RG
17.11.4.3 CL3650RID
17.11.5.0 CL3650F
17.12.1.0 CL3050W
17.13.1.0 DEU2450R
17.13.2.0 DEU2450RO
17.13.3.0 DEU1550B
17.13.3.1 DEU1550BG
17.13.3.1 DEU2450BG
17.13.4.0 DEU2450CI
17.13.5.0 DEU2450RADA
17.13.6.1 DEU2450BGADA
17.14.1.0 DEU1550W
17.14.3.0 DEU2450WADA
17.14.2.0 DEU2450W
17.15.1.1 SO30TM
17.15.1.2 SO30CM
17.15.1.3 SO30PM
17.15.1.4 SO3050TE
17.15.1.5 SO3050PE
17.15.2.1 DO30TM
17.15.2.2 DO30CM
17.15.2.3 DO30PM
17.15.2.4 DO3050TE
17.15.2.5 DO3050PE
17.17.1.0 DET3050CI
17.17.1.3 DET3050CIID
17.17.2.0 DET3050R
17.17.2.3 DET3050RID
17.17.3.0 DET3050FI
17.17.4.0 DEC3650R
17.17.4.3 DEC3650RID
17.17.5.0 DEC1850FI
17.17.7.0 DEU2450DR
17.17.8.0 DEU2450DFI
17.17.8.1 DEU2450DF
17.17.9.0 DEU3050DCI
17.17.9.1 DEU3050DC
17.17.10.0 DEU2450DRO
17.18.1.0 DEC1850W
17.18.3.0 DEC3050W
17.18.4.0 DET3050WCI
17.22.5.0 IC-18FIX
17.22.4.1 IC-18FIX
17.22.1.3 IC-18FIX
17.21.1.0 DEU1550I
17.21.1.4 DEU1550NI
17.11.1.1 CL3650UG/S/P
17.15.1.5 SO3050PE/S/P
17.15.2.3 DO3050PM/S/P
17.6.1.1 DW2450WS
17.2.9.1 ID-36C
17.18.3.0 DET3050WR
17.7.1.1 PRO3650G
17.8.2.0 DF48850/S/P
17.8.5.0 IR36550/S/T
33.23.255.255 VWLP3050PS6
"""
CATALOG = [tuple(line.split()) for line in DEMO_CATALOG.strip().splitlines()]
# The M series Professional types, the wall ovens the app treats as knob ovens.
KNOB_OVEN_TYPES = {"1.4.1.3", "1.4.2.3", "17.15.1.3", "17.15.2.3"}

# The owner's appliances, each with the key set it reports and synthetic values.
OWNER_SPECS = {
    "cl4850sid": refrigeration("side_by_side", "classic", 48, "internal ice", zones=2),
    "df48850sp": range_spec("dual_fuel", 48, 8, (), "professional"),
    "dw2450": dishwasher(None),
    "deu2450bg": refrigeration("undercounter_beverage", "designer", 24, "glass", zones=1),
    "deu2450wdz": refrigeration("undercounter_wine", "designer", 24, "glass", zones=2),
}
FIXTURE_SPECS = {
    **OWNER_SPECS,
    "cl3650ufd": refrigeration("french_door", "classic", 36, "ice", zones=2),
    "cl3050u": refrigeration("over_under", "classic", 30, "ice", zones=2),
    "dec3050r": refrigeration("column_refrigerator", "designer", 30, zones=1),
    "dec2450fi": refrigeration("column_freezer", "designer", 24, "ice", zones=1),
    "dec2450w": refrigeration("column_wine", "designer", 24, "glass", zones=2),
    "det3650ci": refrigeration("tall_over_under", "designer", 36, "ice", zones=2),
    "deu3050dci": refrigeration("undercounter_drawers", "designer", 30, "ice combination", zones=2),
    "deu2450r": refrigeration("undercounter_refrigerator", "designer", 24, zones=1),
    # The PRO's drawers report a second refrigerator zone.
    "pro4850g": refrigeration("side_by_side", "pro", 48, "glass ice", zones=3),
    "pro3650": refrigeration("over_under", "pro", 36, "ice", zones=3),
    "deu1550i": refrigeration("ice_maker", "designer", 15, "ice"),
    "so3050pm": wall_oven("single", 30, "m", "professional", knob=True),
    "do3050te": wall_oven("double", 30, "e", "transitional"),
    "ir36550": range_spec("induction", 36, 5),
    "df60650cg": range_spec("dual_fuel", 60, 6, ("charbroiler", "griddle"), "professional"),
    "df30450": range_spec("dual_fuel", 30, 4, (), "professional"),
    "vwlp3050ps6": hood("wall", 30),
    "dw2450ws": dishwasher(None),
}

GENERIC_REFRIGERATOR = {"line": None, "width": None, "generic": True}
# Unknown models: by appliance type, then by the properties reported. Each case gives the
# fields its spec must have.
FALLBACKS = [
    pytest.param(
        "FUTURE-FRIDGE",
        {
            "appliance_type": "17.11.3.3",
            "ref_set_temp": 37,
            "crisp_set_temp": 36,
            "frz_set_temp": 0,
            "ice_maker_on": True,
        },
        refrigeration("side_by_side", "classic", None, "ice", zones=2, generic=True),
        id="classic side-by-side type",
    ),
    pytest.param(
        None,
        {"appliance_type": "1.1.1.12", "ref_set_temp": 38, "frz_set_temp": 0},
        {"form": "french_door", "line": "built_in", "width": None, "generic": True},
        id="BI French door type",
    ),
    pytest.param(
        None,
        {"appliance_type": "1.1.1.4"},
        {"form": "over_under", "line": "built_in", "width": 36},
        id="BI 36 over-and-under type",
    ),
    pytest.param(
        None,
        {"appliance_type": "17.13.3.0", "ref_set_temp": 38},
        refrigeration("undercounter_beverage", "designer", 15, zones=1, generic=True),
        id="solid-door beverage type",
    ),
    pytest.param(
        None,
        {"appliance_type": "17.13.6.1", "ref_set_temp": 38},
        refrigeration("undercounter_beverage", "designer", 24, "glass", zones=1, generic=True),
        id="ADA beverage type",
    ),
    pytest.param(
        None,
        {"appliance_type": "17.13.2.0", "ref_set_temp": 38},
        refrigeration(
            "undercounter_refrigerator", "designer", 24, "outdoor", zones=1, generic=True
        ),
        id="outdoor undercounter type",
    ),
    pytest.param(
        None,
        {"appliance_type": "17.17.10.0", "ref_set_temp": 38},
        refrigeration(
            "undercounter_drawers",
            "designer",
            24,
            "refrigerator outdoor",
            zones=1,
            generic=True,
        ),
        id="outdoor drawers type",
    ),
    pytest.param(
        None,
        {"appliance_type": "17.17.8.0", "frz_set_temp": 0, "ice_maker_on": True},
        {"form": "undercounter_drawers", "drawers": "freezer", "ice": True, "zones": 1},
        id="freezer drawers type",
    ),
    pytest.param(
        None,
        {"appliance_type": "17.17.9.0"},
        {"form": "undercounter_drawers", "drawers": "combination", "zones": 0},
        id="combination drawers type before any setpoints",
    ),
    pytest.param(
        None,
        {"appliance_type": "17.22.9.0", "ref_set_temp": 37, "frz_set_temp": 0},
        {"form": "undercounter_drawers", "line": "integrated", "drawers": "combination"},
        id="Integrated X drawers by their setpoints",
    ),
    pytest.param(
        None,
        {
            "appliance_type": "17.18.4.0",
            "wine_set_temp": 55,
            "wine2_set_temp": 45,
            "ref_set_temp": 37,
            "frz_set_temp": 0,
            "ice_maker_on": True,
        },
        refrigeration(
            "wine_over_drawers", "designer", 30, "glass ice combination", zones=4, generic=True
        ),
        id="wine over combination drawers type",
    ),
    pytest.param(
        None,
        {"appliance_type": "17.5.2.0", "wine_set_temp": 55, "wine2_set_temp": 45},
        {"form": "wine_over_drawers", "line": "integrated", "drawers": "refrigerator"},
        id="Integrated wine over refrigerator drawers type",
    ),
    pytest.param(
        None,
        {"appliance_type": "17.14.1.0", "wine_set_temp": 55},
        refrigeration("undercounter_wine", "designer", 15, "glass", zones=1, generic=True),
        id="15 undercounter wine type",
    ),
    pytest.param(
        None,
        {"appliance_type": "17.7.2.1"},
        {"form": "side_by_side", "line": "pro", "width": 48},
        id="PRO 48 type",
    ),
    pytest.param(
        None,
        {"appliance_type": "17.2.6.0", "ref_set_temp": 37, "frz_set_temp": 0},
        {"form": "column_refrigerator", "line": "integrated", "width": 24, "zones": 2},
        id="Integrated 24 refrigerator/freezer type",
    ),
    pytest.param(
        None,
        {"appliance_type": "17.11.9.0", "ref_set_temp": 37, "frz_set_temp": 0},
        {"form": "over_under", "line": "classic", "width": None, "generic": True},
        id="unknown Classic category by its setpoints",
    ),
    pytest.param(
        # A made-up model on the dedicated ice maker type.
        "DEC1850CI",
        {"appliance_type": "1.21.2.5", "ice_maker_on": True, "ice_door_ajar": False},
        refrigeration("ice_maker", "designer", 15, "ice", generic=True),
        id="ice maker type",
    ),
    pytest.param(
        "RAVEN_FS9",
        {"appliance_type": "33.23.255.255", "fan_speed": 0},
        hood("hood", None, generic=True),
        id="hood codename",
    ),
    pytest.param(
        "VX3612",
        {"appliance_type": "33.23.255.255"},
        hood("hood", 36, generic=True),
        id="unknown hood model with a width",
    ),
    pytest.param(
        "FUTURE-DW",
        {"appliance_type": "17.20.1.0", "wash_status": 1},
        dishwasher(None, generic=True),
        id="Cove dishwasher type",
    ),
    pytest.param(
        "FUTURE-RANGE",
        {"appliance_type": "17.8.2.0", "cav_set_temp": 350, "cav2_set_temp": 350},
        range_spec("dual_fuel", 48, 8, style="professional", generic=True),
        id="48 dual fuel range type",
    ),
    pytest.param(
        "FUTURE-RANGE",
        {"appliance_type": "17.8.1.0", "cav_set_temp": 350},
        range_spec(
            "dual_fuel",
            None,
            6,
            style="professional",
            ovens=[oven("cav", "single", None)],
            generic=True,
        ),
        id="30 or 36 dual fuel range type",
    ),
    pytest.param(
        None,
        {"appliance_type": "17.8.6.1", "cav_set_temp": 350, "cav2_set_temp": 350},
        range_spec("induction", 48, 7, generic=True),
        id="48 induction range type",
    ),
    pytest.param(
        None,
        {"appliance_type": "17.8.5.1", "cav_set_temp": 350},
        range_spec("induction", 36, 5, generic=True),
        id="36 induction range type",
    ),
    pytest.param(
        None,
        {"appliance_type": "17.8.3.0", "cav_set_temp": 350},
        range_spec(
            "dual_fuel",
            60,
            6,
            style="professional",
            ovens=[oven("cav", "single", None)],
            generic=True,
        ),
        id="ovens follow the cavities reported",
    ),
    pytest.param(
        None,
        {"appliance_type": "17.8.9.0", "cav_set_temp": 350, "cav2_unit_on": False},
        range_spec(
            "dual_fuel",
            None,
            6,
            style="professional",
            ovens=[oven("cav2", "left", None), oven("cav", "right", None)],
            generic=True,
        ),
        id="unknown range category with two cavities",
    ),
    pytest.param(
        None,
        {"appliance_type": "17.15.2.4", "cav_set_temp": 350, "cav2_set_temp": 350},
        wall_oven("double", 30, "e", "transitional", generic=True),
        id="E series double oven type",
    ),
    pytest.param(
        None,
        {"appliance_type": "1.4.1.3", "cav_set_temp": 350},
        wall_oven("single", 30, "m", "professional", knob=True, generic=True),
        id="M series Professional single oven type",
    ),
    pytest.param(
        None,
        {"appliance_type": "1.3.2.1"},
        wall_oven("double", 30, "e", None, generic=True),
        id="E series type without a style",
    ),
    pytest.param(
        None,
        {"appliance_type": "17.15.1.9", "cav_set_temp": 350},
        wall_oven("single", 30, None, None, generic=True),
        id="unknown nge version",
    ),
    pytest.param(
        None,
        {"appliance_type": "1.16.1.1", "cav_set_temp": 350},
        wall_oven("single", None, None, None, generic=True),
        id="hybrid M type by its cavities",
    ),
    pytest.param(
        None,
        {"ref_set_temp": 38},
        refrigeration("column_refrigerator", None, None, zones=1, generic=True),
        id="refrigerator setpoint",
    ),
    pytest.param(
        None,
        {"ref_set_temp": 38, "crisp_set_temp": 36, "frz_set_temp": 0},
        refrigeration("over_under", None, None, zones=2, generic=True),
        id="refrigerator and freezer setpoints",
    ),
    pytest.param(
        None,
        {"frz_set_temp": 0, "ice_maker_on": False},
        refrigeration("column_freezer", None, None, "ice", zones=1, generic=True),
        id="freezer setpoint",
    ),
    pytest.param(
        None,
        {"ref_set_temp": 38, "ref2_set_temp": 34},
        {"form": "tall_refrigerator", "zones": 2, **GENERIC_REFRIGERATOR},
        id="two refrigerator zones",
    ),
    pytest.param(
        None,
        {"wine_set_temp": 55},
        refrigeration("undercounter_wine", None, None, "glass", zones=1, generic=True),
        id="one wine zone",
    ),
    pytest.param(
        None,
        {"wine_set_temp": 55, "wine2_set_temp": 45},
        {"form": "column_wine", "glass": True, "zones": 2, **GENERIC_REFRIGERATOR},
        id="two wine zones",
    ),
    pytest.param(
        None,
        {"wine_set_temp": 55, "wine2_set_temp": 45, "ref_set_temp": 37},
        {"form": "wine_over_drawers", "drawers": "refrigerator", **GENERIC_REFRIGERATOR},
        id="wine and refrigerator zones",
    ),
    pytest.param(
        None,
        {"wine_set_temp": 55, "ref_set_temp": 37, "frz_set_temp": 0},
        {"form": "wine_over_drawers", "drawers": "combination", "zones": 3},
        id="wine, refrigerator and freezer zones",
    ),
    pytest.param(
        None,
        {"ref_set_temp": 37, "frz_set_temp": 0, "internal_dispenser_enabled": True},
        {"form": "over_under", "dispenser": "internal"},
        id="internal dispenser setting",
    ),
    pytest.param(
        None,
        {"ref_door_ajar": False},
        refrigeration("column_refrigerator", None, None, generic=True),
        id="refrigerator door only",
    ),
    pytest.param(
        None,
        {"ice_door_ajar": False, "ice_maker_on": True},
        refrigeration("ice_maker", None, 15, "ice", generic=True),
        id="ice maker door",
    ),
    pytest.param(
        None, {"wash_status": 1}, dishwasher(None, generic=True), id="dishwasher properties"
    ),
    pytest.param(None, {"fan_speed": 2}, hood("hood", None, generic=True), id="hood properties"),
    pytest.param(
        None,
        {"cav_set_temp": 350},
        wall_oven("single", None, None, None, generic=True),
        id="one cavity",
    ),
    pytest.param(
        None,
        {"cav_set_temp": 350, "cav2_set_temp": 350},
        wall_oven("double", None, None, None, generic=True),
        id="two cavities",
    ),
    pytest.param(
        None,
        {"kitchen_timer_active": False},
        wall_oven("single", None, None, None, generic=True),
        id="kitchen timer",
    ),
    pytest.param(None, {}, generic("appliance"), id="nothing reported"),
    pytest.param("CL9999", {}, generic("refrigerator"), id="unknown Classic model"),
    pytest.param("IW-99", {}, generic("wine"), id="unknown Integrated wine model"),
    pytest.param("SO99XQ", {}, generic("oven"), id="unknown wall oven model"),
    pytest.param("DF9", {}, generic("oven"), id="unknown range model"),
    pytest.param("PWX", {}, generic("hood"), id="unknown hood model"),
    pytest.param("DW99", {}, generic("dishwasher"), id="unknown dishwasher model"),
    pytest.param("XYZ-1", {"appliance_type": "17.0.0.0"}, generic("appliance"), id="unknown"),
    pytest.param(
        "XYZ-1", {"appliance_type": "not a type"}, generic("appliance"), id="unusable type"
    ),
]

FAMILY_KEYS = {
    "refrigeration": {
        "family",
        "form",
        "line",
        "width",
        "glass",
        "dispenser",
        "ice",
        "drawers",
        "zones",
        "outdoor",
        "generic",
    },
    "range": {
        "family",
        "form",
        "width",
        "fuel",
        "burners",
        "surfaces",
        "ovens",
        "style",
        "generic",
    },
    "wall_oven": {"family", "form", "width", "series", "style", "ovens", "knob", "generic"},
    "hood": {"family", "form", "width", "generic"},
    "dishwasher": {"family", "form", "width", "front", "generic"},
    "generic": {"family", "form", "width", "generic"},
}
# The value sets in frontend/src/types.ts.
TS_FORMS = {
    "refrigeration": {
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
    },
    "range": {"range"},
    "wall_oven": {"single", "double"},
    "hood": {"wall", "island", "insert", "hood"},
    "dishwasher": {"dishwasher"},
    "generic": {"refrigerator", "wine", "ice_maker", "oven", "hood", "dishwasher", "appliance"},
}
TS_VALUES = {
    ("refrigeration", "line"): {"classic", "designer", "pro", "built_in", "integrated", None},
    ("refrigeration", "dispenser"): {"none", "external", "internal"},
    ("refrigeration", "drawers"): {"refrigerator", "freezer", "combination", None},
    ("range", "fuel"): {"dual_fuel", "induction", "gas"},
    ("range", "style"): {"professional", "transitional", None},
    ("wall_oven", "series"): {"l", "e", "m", None},
    ("wall_oven", "style"): {"professional", "transitional", "contemporary", None},
    ("dishwasher", "front"): {"panel", "stainless", None},
}
SURFACES = {"griddle", "double_griddle", "charbroiler", "french_top"}
OVEN_POSITIONS = {"left", "right", "upper", "lower", "single"}


def assert_contract(spec):
    """The spec has exactly the shape of its family's spec in types.ts."""
    family = spec["family"]
    assert spec.keys() == FAMILY_KEYS[family]
    assert spec["form"] in TS_FORMS[family]
    assert spec["width"] is None or type(spec["width"]) is int
    assert type(spec["generic"]) is bool
    if family == "generic":
        assert spec["generic"] is True
    for (spec_family, key), values in TS_VALUES.items():
        if family == spec_family:
            assert spec[key] in values
    if family == "refrigeration":
        assert all(type(spec[key]) is bool for key in ("glass", "ice", "outdoor"))
        assert type(spec["zones"]) is int
        assert (spec["drawers"] is not None) == (
            spec["form"] in ("undercounter_drawers", "wine_over_drawers")
        )
    if family == "range":
        assert type(spec["burners"]) is int and spec["burners"] > 0
        assert type(spec["surfaces"]) is list and set(spec["surfaces"]) <= SURFACES
    if family in ("range", "wall_oven"):
        assert type(spec["ovens"]) is list and spec["ovens"]
        for slot in spec["ovens"]:
            assert slot.keys() == {"prefix", "position", "width"}
            assert slot["prefix"] in ("cav", "cav2")
            assert slot["position"] in OVEN_POSITIONS
            assert slot["width"] is None or type(slot["width"]) is int
        assert len({slot["prefix"] for slot in spec["ovens"]}) == len(spec["ovens"])
    if family == "wall_oven":
        assert type(spec["knob"]) is bool
    # The websocket API sends it as JSON.
    assert json.loads(json.dumps(spec)) == spec


def fixture(name):
    return json.loads((FIXTURES / f"{name}.json").read_text())


def test_forms_match_the_frontend_contract():
    assert {family: set(forms) for family, forms in FORMS.items()} == TS_FORMS
    assert all(len(forms) == len(set(forms)) for forms in FORMS.values())


@pytest.mark.parametrize(("model", "expected"), REFRIGERATION.items())
def test_refrigeration_models(model, expected):
    spec = appliance_spec(model, {})
    assert spec == refrigeration(*expected)
    assert_contract(spec)


@pytest.mark.parametrize(("model", "expected"), RANGES.items())
def test_range_models(model, expected):
    spec = appliance_spec(model, {})
    assert spec == range_spec(*expected)
    assert_contract(spec)


@pytest.mark.parametrize(("model", "expected"), WALL_OVENS.items())
def test_wall_oven_models(model, expected):
    spec = appliance_spec(model, {})
    assert spec == wall_oven(*expected)
    assert_contract(spec)


@pytest.mark.parametrize(("model", "front"), DISHWASHERS.items())
def test_dishwasher_models(model, front):
    assert appliance_spec(model, {}) == dishwasher(front)


@pytest.mark.parametrize(("model", "expected"), HOODS.items())
def test_hood_models(model, expected):
    assert appliance_spec(model, {}) == hood(*expected)


@pytest.mark.parametrize(("type_id", "model"), CATALOG)
def test_the_model_decides_before_the_type(type_id, model):
    spec = appliance_spec(model, {"appliance_type": type_id})
    expected = appliance_spec(model, {})
    if expected["family"] == "wall_oven":
        expected["knob"] = type_id in KNOB_OVEN_TYPES
    assert spec == expected
    assert not spec["generic"]


def test_the_model_decides_before_the_properties():
    data = fixture("cl4850sid")["state"]
    assert appliance_spec("DW2450", data) == dishwasher(None)


@pytest.mark.parametrize("name", sorted(FIXTURE_SPECS))
def test_fixtures(name):
    data = fixture(name)
    spec = appliance_spec(data["model"], data["state"])
    assert spec == FIXTURE_SPECS[name]
    assert_contract(spec)


def test_every_fixture_is_tested():
    assert {path.stem for path in FIXTURES.glob("*.json")} == FIXTURE_SPECS.keys()


@pytest.mark.parametrize("name", sorted(FIXTURE_SPECS))
def test_fixture_format(name):
    data = fixture(name)
    assert data.keys() == {"model", "appliance_type", "name", "state"}
    state = data["state"]
    assert state["appliance_model"] == data["model"]
    assert state["appliance_type"] == data["appliance_type"]
    assert isinstance(data["name"], str) and data["name"]
    # Only properties the integration recognizes, and nothing private.
    assert state.keys() <= STATE_KEYS - PRIVATE_KEYS
    for key in state.keys() & (TIMESTAMP_KEYS | {"time"}):
        assert datetime.fromisoformat(state[key]).utcoffset() is not None
    assert isinstance(state["version"], dict) and isinstance(state["version"]["fw"], str)


def test_the_owners_appliances_report_their_own_key_sets():
    # The keys the owner's appliances report, with synthetic values in the fixtures.
    assert fixture("deu2450wdz")["state"].keys() == {
        "accent_light_level",
        "ap_rssi",
        "appliance_model",
        "appliance_type",
        "door_ajar_timeout",
        "sabbath_on",
        "service_required",
        "time",
        "unit_on",
        "uptime",
        "version",
        "wine2_set_temp",
        "wine_door_ajar",
        "wine_set_temp",
        "wine_temp_alert_on",
    }
    assert len(fixture("df48850sp")["state"]) == 49
    assert len(fixture("cl4850sid")["state"]) == 31


@pytest.mark.parametrize(("model", "data", "expected"), FALLBACKS)
def test_fallbacks(model, data, expected):
    before = json.dumps(data, sort_keys=True)
    spec = appliance_spec(model, data)
    assert spec.items() >= expected.items()
    assert_contract(spec)
    # The spec doesn't change the properties it reads.
    assert json.dumps(data, sort_keys=True) == before


@pytest.mark.parametrize(
    ("model", "normalized"),
    [
        ("cl3650ug/s/p", "CL3650UGSP"),
        (" DEU-2450 BG\t", "DEU2450BG"),
        ("ICBDEU2450BG", "DEU2450BG"),
        ("DEU2450WDZ.0", "DEU2450WDZ"),
        ("DF304PM/S/PH/LP", "DF304PMSPHLP"),
        ("SO30-2", "SO302"),
        ("", ""),
        (None, ""),
    ],
)
def test_normalize_model(model, normalized):
    assert normalize_model(model) == normalized


@pytest.mark.parametrize(
    ("code", "model"),
    [("006", "BI-30U"), ("317", "BI-36UFDID"), ("2038", "IC-24C"), ("2405", "IW-30CI")],
)
def test_service_codes_read_as_their_models(code, model):
    assert SERVICE_CODE_MODELS[code] == normalize_model(model)
    assert appliance_spec(code, {}) == appliance_spec(model, {})


def test_the_model_defaults_to_the_reported_one():
    data = {"appliance_model": "CL3650UFD", "ref_set_temp": 37, "frz_set_temp": 0}
    assert appliance_spec(None, data) == refrigeration("french_door", "classic", 36, "ice", zones=2)


def test_zones_leave_out_the_crisper():
    data = {"ref_set_temp": 37, "crisp_set_temp": 36, "frz_set_temp": 0}
    assert appliance_spec("CL3050U", data)["zones"] == 2
    assert appliance_spec("DET3050R", {"ref_set_temp": 37, "ref2_set_temp": 34})["zones"] == 2


def test_ice_from_the_properties():
    assert appliance_spec("CL3650R", {"ref_set_temp": 37})["ice"] is False
    assert appliance_spec("CL3650R", {"ref_set_temp": 37, "ice_maker_on": False})["ice"] is True


@pytest.mark.parametrize(
    ("model", "outdoor"),
    [
        ("DEU2450RO/R", True),
        ("DEU2450DRO", True),
        ("DEU1550IPO", True),
        ("ID-24RO", True),
        ("DEU2450RADA", False),
        ("DEU2450BGSZ", False),
        ("DEU2450R", False),
    ],
)
def test_outdoor_models(model, outdoor):
    assert appliance_spec(model, {})["outdoor"] is outdoor


def test_range_ovens_by_width():
    assert appliance_spec("DF30450", {})["ovens"] == [oven("cav", "single", 30)]
    assert appliance_spec("DF36650", {})["ovens"] == [oven("cav", "single", 36)]
    assert appliance_spec("DF48850", {})["ovens"] == [
        oven("cav2", "left", 18),
        oven("cav", "right", 30),
    ]
    assert appliance_spec("DF60650CG", {})["ovens"] == [
        oven("cav2", "left", 30),
        oven("cav", "right", 30),
    ]


def test_range_style():
    # Dual fuel and gas ranges are always professional; induction needs its letters.
    assert appliance_spec("DF48850", {})["style"] == "professional"
    assert appliance_spec("GR304", {})["style"] == "professional"
    assert appliance_spec("DF48850SP", {})["style"] == "professional"
    assert appliance_spec("IR36550", {})["style"] is None
    assert appliance_spec("IR36550ST", {})["style"] == "transitional"
    assert appliance_spec("IR365TM", {})["style"] == "transitional"


def test_wall_oven_knob_follows_the_type():
    assert appliance_spec("SO3050PM", {})["knob"] is False
    assert appliance_spec("SO3050PM", {"appliance_type": "17.15.1.3"})["knob"] is True
    assert appliance_spec("DO3050PM", {"appliance_type": "17.15.2.3"})["knob"] is True
    assert appliance_spec("SO3050TM", {"appliance_type": "17.15.1.1"})["knob"] is False


@pytest.mark.parametrize(
    ("model", "hints"),
    [
        ("CL3650UG/S/P", {"finish": "stainless", "handle": "pro"}),
        ("CL4850SID/S/TH", {"finish": "stainless", "handle": "tubular"}),
        ("BI-36UG/S/PH-RH", {"finish": "stainless", "handle": "pro"}),
        ("CL3650UFD/O", {"finish": "panel"}),
        ("CL3650U/O/L", {"finish": "panel"}),
        ("BW-30/O", {"finish": "panel"}),
        ("DEC3050RID/R", {}),
        # O after an undercounter configuration is an outdoor model, not a panel-ready front.
        ("DEU2450RO/R", {}),
        ("CL4850SID", {}),
        # Two handles can't both be right.
        ("CL3650UG/S/P/T", {"finish": "stainless"}),
        # Only refrigeration models: a range's P is its style.
        ("DF48850/S/P", {}),
        ("UNKNOWN", {}),
        (None, {}),
    ],
)
def test_model_hints(model, hints):
    assert model_hints(model) == hints


@pytest.mark.parametrize(
    ("model", "data", "form", "changed"),
    [
        # Wine storage's glass doors come with the form; a beverage center's are the model's.
        ("DEU2450WDZ", {"wine_set_temp": 45}, "undercounter_refrigerator", {"glass": False}),
        ("DEU2450BG", {}, "undercounter_refrigerator", {}),
        ("DEU2450R", {}, "undercounter_wine", {"glass": True}),
        ("CL3650RG", {}, "column_wine", {}),
        # An ice maker's ice comes with its form, unless the properties show an ice maker.
        ("DEU1550I", {}, "undercounter_refrigerator", {"ice": False}),
        ("DEU1550I", {"ice_maker_on": True}, "undercounter_refrigerator", {}),
        ("DEU2450R", {}, "ice_maker", {"ice": True}),
        # Drawer forms hold what the setpoints say, else refrigerator drawers.
        (
            "CL4850SID",
            {"ref_set_temp": 38, "frz_set_temp": 0},
            "undercounter_drawers",
            {"drawers": "combination"},
        ),
        ("DEU2450R", {}, "undercounter_drawers", {"drawers": "refrigerator"}),
        ("DEU3050DCI", {}, "undercounter_refrigerator", {"drawers": None}),
        ("DEU3050DF", {}, "wine_over_drawers", {"glass": True}),
    ],
)
def test_a_form_override_works_out_what_comes_with_the_form(model, data, form, changed):
    detected = appliance_spec(model, data)
    spec = refrigeration_with_form(detected, form, data)
    assert spec == {**detected, "form": form, **changed}
    assert_contract(spec)
