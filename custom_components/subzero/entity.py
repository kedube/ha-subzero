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


def zone_name(data: dict, key: str, names: dict[str, str | None]) -> str | None:
    """The app's name for a cavity or zone entity, when the appliance's layout changes it.

    Ranges call two cavities right and left ovens, and two wine zones are upper and lower.
    """
    cavity = key.removeprefix("remote_start_")
    if cavity.startswith(("cav_", "cav2_")) and has_left_and_right_ovens(data):
        second = cavity.startswith("cav2_")
        name = names.get(key if second else key.replace("cav_", "cav2_", 1))
        side = "left" if second else "right"
        if name and "ower oven" in name:
            return name.replace("Lower oven", f"{side.title()} oven").replace(
                "lower oven", f"{side} oven"
            )
        return None
    if cavity.startswith(("wine_", "wine2_")) and cavity != "wine_temp_alert_on":
        door = cavity.endswith("_door_ajar")
        if ("wine2_door_ajar" if door else "wine2_set_temp") not in data:
            return None
        base = (names.get(key) or "").removesuffix(" 2")
        zone = "Lower" if cavity.startswith("wine2_") else "Upper"
        return f"{zone} {base[0].lower()}{base[1:]}" if base else None
    return None


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
        for description in descriptions:
            key = (coordinator.device_id, description.key)
            if (
                key not in discovered
                and description.key not in excluded_entity_keys(coordinator.data)
                and supported(coordinator, description)
            ):
                discovered.add(key)
                if name := zone_name(coordinator.data, description.key, names):
                    description = replace(description, name=name)
                entities.append(entity_class(coordinator, description))
        if entities:
            async_add_entities(entities)

    for coordinator in entry.runtime_data.coordinators.values():
        discover_device = partial(discover, coordinator)
        discover_device()
        entry.async_on_unload(coordinator.async_add_listener(discover_device))
