// @vitest-environment happy-dom
import { describe } from "vitest";
import { variants } from "../gallery/variants/dishwasher";
import { checkVariants } from "./drawing-check";

describe("dishwasher drawings", () => checkVariants("dw", variants));
