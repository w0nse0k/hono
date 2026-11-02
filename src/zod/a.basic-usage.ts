// oxlint-disable no-unused-vars
/**
 * <h3>Zod - Basic usage</h3>
 * @see https://zod.dev/basics
 */

import z from "zod";

// Defining a schema: 다른 작업을 진행하기 전에 먼저 스키마를 정의해야 합니다.
const Player = z.object({
  username: z.string(),
  xp: z.number(),
});

// Parsing data: 주어진 Zod 스키마에 대해, .parse를 사용하여 입력 값의 유효성을 검사합니다. 유효한 경우, Zod는 입력 값의 강타입 심층 복사본을 반환합니다.
const parsed = Player.parse({ username: "billie", xp: 100 });
console.log(parsed);

// Handling errors: : 유효성 검사에 실패하면, .parse() 메서드는 유효성 검사 문제에 대한 상세한 정보가 포함된 ZodError 인스턴스를 발생시킵니다.
try {
  Player.parse({ username: 42, xp: "100" });
} catch (error) {
  if (error instanceof z.ZodError) {
    console.log(JSON.stringify(error.issues));
  }
}

// Inferring types: Zod는 스키마 정의에서 정적 타입을 추론합니다.
type Player = z.infer<typeof Player>;

const player: Player = { username: "billie", xp: 100 };
