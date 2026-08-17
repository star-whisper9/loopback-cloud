import { describe, expect, it } from "vitest";
import {
  parseTerminalConfig,
  parseTerminalTranscript,
} from "./terminal";

describe("parseTerminalConfig", () => {
  it("uses the replay defaults", () => {
    expect(parseTerminalConfig(undefined, "Terminal")).toEqual({
      title: "Terminal",
      autoplay: "visible",
      speed: "normal",
      loop: false,
    });
  });

  it("parses quoted metadata and normalizes autoplay none", () => {
    expect(
      parseTerminalConfig(
        'title="Docker Compose" autoplay=none speed=slow loop=true',
        "Terminal",
      ),
    ).toEqual({
      title: "Docker Compose",
      autoplay: "manual",
      speed: "slow",
      loop: true,
    });
  });
});

describe("parseTerminalTranscript", () => {
  it("separates prompts from command output", () => {
    expect(
      parseTerminalTranscript(
        "$ docker ps\nCONTAINER ID   STATUS\na1b2c3         Up 2 minutes\nroot@lab:~# reboot",
      ),
    ).toEqual([
      { kind: "command", prompt: "$", text: "docker ps" },
      { kind: "output", text: "CONTAINER ID   STATUS" },
      { kind: "output", text: "a1b2c3         Up 2 minutes" },
      { kind: "command", prompt: "root@lab:~#", text: "reboot" },
    ]);
  });

  it("preserves blank lines", () => {
    expect(parseTerminalTranscript("$ echo ok\nok\n\n$ exit")).toEqual([
      { kind: "command", prompt: "$", text: "echo ok" },
      { kind: "output", text: "ok" },
      { kind: "output", text: "" },
      { kind: "command", prompt: "$", text: "exit" },
    ]);
  });
});
