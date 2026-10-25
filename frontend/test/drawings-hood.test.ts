// @vitest-environment happy-dom
import { describe } from "vitest";
import { variants } from "../gallery/variants/hood";
import { checkVariants } from "./drawing-check";

describe("hood drawings", () => checkVariants("hd", variants));
