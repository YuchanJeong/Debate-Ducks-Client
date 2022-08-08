import { ChangeEvent, Dispatch, SetStateAction } from "react";

//*- users
export interface User {
  id: string;
  nickname: string;
  email: string;
  profile_image?: string | null;
}

export interface UserInfo {
  name: string | undefined;
  email: string | undefined;
  password: string | undefined;
}

//*- debates
export interface Debate {
  id: number;
  title: string;
  contents: string;
  category: string;
  video_url: string | null;
  author_pros: boolean;
  created_date: string;
  updated_date: string | null;
  author: User | null;
  participant: User | null;
  factchecks: Factcheck[];
  hearts_cnt: number;
  vote: { prosCnt: number; consCnt: number };
}

export type DebateOfDebates = Omit<Debate, "factchecks" | "vote">;

export interface DebatePost
  extends Pick<Debate, "title" | "contents" | "category" | "author_pros"> {
  author_id: string;
}

type TempDebatePatch = Pick<Debate, "id"> &
  Partial<
    Pick<
      Debate,
      "title" | "contents" | "category" | "author_pros" | "video_url"
    >
  >;
export interface DebatePatch extends TempDebatePatch {
  participant_id?: string;
}

//*- factchecks
export interface Factcheck {
  id: number;
  pros: boolean;
  description: string;
  reference_url: string;
}

export type FactcheckPost = Pick<
  Factcheck,
  "pros" | "description" | "reference_url"
> &
  DebateAndUserID;

export type FactcheckPatch = Pick<
  Factcheck,
  "id" | "description" | "reference_url"
>;

//*- debate and user id
export interface DebateAndUserID {
  target_debate_id: number;
  target_user_id: string;
}

//*- votes
export interface Vote {
  isVote: boolean;
  pros: boolean;
}

export interface VotePostOrPatch extends DebateAndUserID {
  pros: boolean;
}

//*- comments
export interface CommentOfDebate {
  id: number;
  pros: boolean | null;
  contents: string;
  created_date: string;
  updated_date: string | null;
  target_user: User;
}

export interface CommentPost extends DebateAndUserID {
  pros: boolean | null;
  contents: string;
}

export interface CommentPatch {
  id: number;
  pros: boolean | null;
  contents: string;
}

//*- useInPutSelect
export interface UseInputResult {
  attribute: {
    value: string;
    placeholder: string;
    onChange: (ev: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  };
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
}

export interface UseRadioResult {
  attributeTrue: {
    type: string;
    name: string;
    value: string;
    checked: boolean;
    onChange: (ev: ChangeEvent<HTMLInputElement>) => void;
  };
  attributeFalse: {
    type: string;
    name: string;
    value: string;
    checked: boolean;
    onChange: (ev: ChangeEvent<HTMLInputElement>) => void;
  };
  value: boolean;
  setValue: Dispatch<SetStateAction<string>>;
}

export interface UseSelectResult {
  attribute: {
    value: string;
    onChange: (ev: ChangeEvent<HTMLSelectElement>) => void;
  };
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
}
