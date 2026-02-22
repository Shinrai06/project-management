import type { User } from "./types/user";

export type counterEvents =
  | {
      type:
        | "[shiva dev] increment counter clicked"
        | "[shiva dev] decrement counter clicked"
        | "[shiva dev] fetch counter async clicked"
        | "[shiva dev] reset data clicked"
        | "[shiva dev] fetch users clicked";
      payload?: void;
    }
  | {
      type: "[shiva dev] set counter value";
      payload: {
        value: number;
      };
    }
  | {
      type: "[shiva dev] set users list";
      payload: {
        value: User[];
      };
    };
