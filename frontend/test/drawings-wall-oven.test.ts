// @vitest-environment happy-dom
import { describe } from "vitest";
import { variants } from "../gallery/variants/wall-oven";
import { checkVariants } from "./drawing-check";

describe("wall-oven drawings", () => checkVariants("wo", variants));
