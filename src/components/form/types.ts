export const ATTENDANCE_OPTIONS = [
  { key: "tsuya", label: "通夜に参列" },
  { key: "kokubetsushiki", label: "告別式に参列" },
  { key: "both", label: "通夜・告別式ともに参加" },
  { key: "incense_home", label: "8日までに三軒茶屋（東京都）の自宅への来訪" },
  { key: "message_only", label: "未定ではあるものの、とりあえずメッセージを送りたい" },
] as const;

export type AttendanceKey = (typeof ATTENDANCE_OPTIONS)[number]["key"];

// Keys that require address fields
export const CEREMONY_KEYS: AttendanceKey[] = ["tsuya", "kokubetsushiki", "both"];

export type FormData = {
  name: string;
  attendance: AttendanceKey[];
  postalCode: string;
  address: string;
  building: string;
  relation: string;
  nickname: string;
  message: string;
  photos: File[];
};

export type FormErrors = Partial<Record<keyof FormData, string>>;
