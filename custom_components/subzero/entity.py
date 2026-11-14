"""Entity discovery, device identity, and availability."""

from collections.abc import Callable
from dataclasses import replace
from functools import partial

from homeassistant.core import callback
from homeassistant.helpers.device_registry import DeviceInfo
from homeassistant.helpers.entity import EntityDescription
from homeassistant.helpers.entity_platform import AddEntitiesCallback
from homeassistant.helpers.update_coordinator import CoordinatorEntity

from . import SubZeroConfigEntry
from .controls import control_lock, excluded_entity_keys, has_left_and_right_ovens
from .coordinator import SubZeroCoordinator


def zone_variant(data: dict, key: str) -> str | None:
    """Which layout names a cavity or zone entity on this appliance, if one does.

    Ranges call two cavities right and left ovens, two wine zones are upper and lower, and
    a second kitchen timer makes the other the first.
    """
    cavity = key.removeprefix("remote_start_")
    if cavity.startswith(("cav_", "cav2_")):
        if not has_left_and_right_ovens(data):
            return None
        return "left" if cavity.startswith("cav2_") else "right"
    if cavity.startswith(("wine_", "wine2_")) and cavity != "wine_temp_alert_on":
        door = cavity.endswith("_door_ajar")
        if ("wine2_door_ajar" if door else "wine2_set_temp") not in data:
            return None
        return "lower" if cavity.startswith("wine2_") else "upper"
    if key == "dismiss_kitchen_timer" or key.startswith("kitchen_timer_"):
        if "kitchen_timer2_active" not in data or "kitchen_timer2_active" in excluded_entity_keys(
            data
        ):
            return None
        return "first"
    return None


def zone_variants(key: str, names: dict[str, str | None]) -> dict[str, str]:
    """The app's names for a cavity or zone entity, by the layout that gives each.

    Each is also a name to translate, under the entity's key with the layout after it,
    such as `cav_temp_right`.
    """
    cavity = key.removeprefix("remote_start_")
    if cavity.startswith(("cav_", "cav2_")):
        second = cavity.startswith("cav2_")
        name = names.get(key if second else key.replace("cav_", "cav2_", 1))
        side = "left" if second else "right"
        if name and "ower oven" in name:
            return {
                side: name.replace("Lower oven", f"{side.title()} oven").replace(
                    "lower oven", f"{side} oven"
                )
            }
        return {}
    if cavity.startswith(("wine_", "wine2_")) and cavity != "wine_temp_alert_on":
        base = (names.get(key) or "").removesuffix(" 2")
        zone = "lower" if cavity.startswith("wine2_") else "upper"
        return {zone: f"{zone.title()} {base[0].lower()}{base[1:]}"} if base else {}
    if key == "dismiss_kitchen_timer" or key.startswith("kitchen_timer_"):
        name = names.get(key)
        return {"first": name.replace("itchen timer", "itchen timer 1", 1)} if name else {}
    return {}


def zone_name(data: dict, key: str, names: dict[str, str | None]) -> str | None:
    """The app's name for a cavity or zone entity, when the appliance's layout changes it."""
    variant = zone_variant(data, key)
    return zone_variants(key, names).get(variant) if variant else None


class SubZeroEntity(CoordinatorEntity[SubZeroCoordinator]):
    _attr_has_entity_name = True

    def __init__(self, coordinator: SubZeroCoordinator, description: EntityDescription):
        super().__init__(coordinator)
        self.entity_description = description
        self._attr_unique_id = f"{coordinator.device_id}_{description.key}"

    @property
    def device_info(self) -> DeviceInfo:
        return self.coordinator.device_info

    @property
    def available(self) -> bool:
        return (
            super().available
            and self.entity_description.key in self.coordinator.data
            and self.entity_description.key not in excluded_entity_keys(self.coordinator.data)
        )

    def control_unlocked(self, key: str | None = None, value: bool | int | None = None) -> bool:
        """Whether the app would allow this control now, such as outside Sabbath mode."""
        return (
            control_lock(self.coordinator.data, key or self.entity_description.key, value) is None
        )


@callback
def async_setup_entities(
    entry: SubZeroConfigEntry,
    async_add_entities: AddEntitiesCallback,
    descriptions: tuple[EntityDescription, ...],
    entity_class: type[SubZeroEntity],
    supported: Callable[[SubZeroCoordinator, EntityDescription], bool],
) -> None:
    """Discover entities at setup and when their appliance reports new capabilities."""
    discovered: set[tuple[str, str]] = set()
    names = {description.key: description.name for description in descriptions}

    @callback
    def discover(coordinator: SubZeroCoordinator) -> None:
        entities = []
        excluded = excluded_entity_keys(coordinator.data)
        for description in descriptions:
            key = (coordinator.device_id, description.key)
            if (
                key not in discovered
                and description.key not in excluded
                and supported(coordinator, description)
            ):
                discovered.add(key)
                # Names are translated by the entity's key. The description's own name
                # stands in for a language without a translation.
                translation_key = description.translation_key or description.key
                variant = zone_variant(coordinator.data, description.key)
                if variant and (name := zone_variants(description.key, names).get(variant)):
                    description = replace(
                        description, name=name, translation_key=f"{translation_key}_{variant}"
                    )
                else:
                    description = replace(description, translation_key=translation_key)
                entities.append(entity_class(coordinator, description))
        if entities:
            async_add_entities(entities)

    for coordinator in entry.runtime_data.coordinators.values():
        discover_device = partial(discover, coordinator)
        discover_device()
        entry.async_on_unload(coordinator.async_add_listener(discover_device))
