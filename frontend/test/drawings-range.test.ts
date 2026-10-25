// @vitest-environment happy-dom
import { describe } from "vitest";
import { variants } from "../gallery/variants/range";
import { checkVariants } from "./drawing-check";

describe("range drawings", () => checkVariants("rg", variants));
