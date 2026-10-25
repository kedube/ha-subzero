// @vitest-environment happy-dom
import { describe } from "vitest";
import { variants } from "../gallery/variants/refrigeration";
import { checkVariants } from "./drawing-check";

describe("refrigeration drawings", () => checkVariants("rf", variants));
