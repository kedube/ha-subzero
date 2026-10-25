# Appliance fixtures

One file per appliance the sidebar panel draws. pytest (`tests/test_appliance_spec.py`) and
the frontend (gallery and unit tests) both load them, so keep the format stable.

The values are synthetic: tests never use the owner's saved account data.

## Format

```json
{
  "model": "CL4850SID",
  "appliance_type": "17.11.3.3",
  "name": "48\" Side-by-Side",
  "state": {"appliance_model": "CL4850SID", "ref_set_temp": 37, "...": "..."}
}
```

- `model`: the model number as the appliance reports it; `state.appliance_model` repeats it.
- `appliance_type`: `prefix.series.category.version`; `state.appliance_type` repeats it.
- `name`: the Sub-Zero app's default name for the model.
- `state`: the appliance's properties as the API reports them, with keys sorted:
  - temperatures and setpoints in °F;
  - booleans for on/off and door keys;
  - enum integers as `const.py` defines them (cook modes, wash cycles, accent light levels);
  - timestamps as ISO 8601 strings with an offset;
  - `version` as `{"fw": "…"}`, and `uptime` as hours:minutes:seconds, cut to eight
    characters past 99 hours as appliances do.

Every appliance starts idle: doors closed, ovens off, dishwashers idle, ice makers making
ice. Tests and gallery variants change what they need.

## Key sets

The owner's five appliances (CL4850SID, DF48850SP, DW2450, DEU2450BG, DEU2450WDZ) have the
keys those appliances report. The others have the keys of the Sub-Zero app's demo data for
their type, limited to the keys `const.py` recognizes, without private ones, and without
the properties the app discards for that type (`EXCLUDED_PROPERTIES`, with the entities that
depend on them).

## Files

| File | Model | Type | Drawn as |
|---|---|---|---|
| `cl4850sid.json` | CL4850SID | 17.11.3.3 | Classic 48″ side-by-side, internal dispenser |
| `df48850sp.json` | DF48850SP | 17.8.2.0 | Wolf 48″ dual fuel range, 8 burners |
| `dw2450.json` | DW2450 | 17.6.1.0 | Cove dishwasher, panel-ready |
| `deu2450bg.json` | DEU2450BG | 17.13.3.1 | Designer 24″ beverage center, glass door |
| `deu2450wdz.json` | DEU2450WDZ | 17.14.2.0 | Designer 24″ wine storage, two zones |
| `cl3650ufd.json` | CL3650UFD | 17.11.2.0 | Classic 36″ French door |
| `cl3050u.json` | CL3050U | 17.11.1.0 | Classic 30″ over-and-under |
| `dec3050r.json` | DEC3050R | 17.17.4.0 | Designer 30″ refrigerator column |
| `dec2450fi.json` | DEC2450FI | 17.17.5.0 | Designer 24″ freezer column with ice maker |
| `dec2450w.json` | DEC2450W | 17.18.1.0 | Designer 24″ wine column |
| `det3650ci.json` | DET3650CI | 17.17.1.0 | Designer 36″ over-and-under (tall) |
| `deu3050dci.json` | DEU3050DCI | 17.17.9.0 | Designer 30″ combination drawers with ice maker |
| `deu2450r.json` | DEU2450R | 17.13.1.0 | Designer 24″ undercounter refrigerator |
| `pro4850g.json` | PRO4850G | 17.7.2.1 | PRO 48″ side-by-side, glass door |
| `pro3650.json` | PRO3650 | 17.7.1.0 | PRO 36″ over-and-under |
| `deu1550i.json` | DEU1550I | 17.21.1.0 | Designer 15″ ice maker |
| `so3050pm.json` | SO3050PM | 17.15.1.3 | Wolf M series single wall oven, Professional, knob |
| `do3050te.json` | DO3050TE | 17.15.2.4 | Wolf E series double wall oven, Transitional |
| `ir36550.json` | IR36550 | 17.8.5.0 | Wolf 36″ induction range, 5 zones |
| `df60650cg.json` | DF60650CG | 17.8.3.0 | Wolf 60″ dual fuel range, charbroiler and griddle |
| `df30450.json` | DF30450 | 17.8.1.0 | Wolf 30″ dual fuel range, 4 burners |
| `vwlp3050ps6.json` | VWLP3050PS6 | 33.23.255.255 | Wolf 30″ wall hood (the app's demo hood) |
| `dw2450ws.json` | DW2450WS | 17.6.1.1 | Cove dishwasher with a water softener |

`tests/test_appliance_spec.py` holds the spec each one is expected to give.
