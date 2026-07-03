import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";

import {
  clearReplyDraft,
  readReplyDraft,
  saveReplyDraft,
} from "@/lib/forum/reply-draft";

class MemoryStorage {
  private store = new Map<string, string>();

  getItem(key: string) {
    return this.store.get(key) ?? null;
  }

  setItem(key: string, value: string) {
    this.store.set(key, value);
  }

  removeItem(key: string) {
    this.store.delete(key);
  }
}

describe("reply-draft", () => {
  beforeEach(() => {
    vi.stubGlobal("localStorage", new MemoryStorage());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("saves and reads a draft", () => {
    saveReplyDraft(42, {
      content: "Γεια κόσμε",
      parentId: 7,
      replyToAuthor: "Nikos",
    });

    expect(readReplyDraft(42)).toMatchObject({
      content: "Γεια κόσμε",
      parentId: 7,
      replyToAuthor: "Nikos",
    });
  });

  it("clears a draft", () => {
    saveReplyDraft(42, { content: "test" });
    clearReplyDraft(42);
    expect(readReplyDraft(42)).toBeNull();
  });
});
