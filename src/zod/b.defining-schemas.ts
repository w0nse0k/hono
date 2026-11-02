// oxlint-disable no-unused-vars
/**
 * <h3>Defining schemas</h3>
 * 데이터를 유효성 검사하려면 먼저 스키마를 정의해야 합니다. 스키마는 단순한 기본형 값부터 복잡한 중첩 객체 및 배열에 이르기까지 다양한 형식을 나타냅니다.
 * @see https://zod.dev/api
 */

import z from "zod";

// Primitives
z.string();
z.number();
z.boolean();

const schema1 = z.number();
schema1.parse(123);

// Coercion: 입력 데이터를 적절한 유형으로 강제 변환하려면 z.coerce를 사용하십시오.
z.coerce.string(); // String(input)
z.coerce.number(); // Number(input)
z.coerce.boolean(); // Boolean(input)

// 이러한 스키마의 강제 변형은 입력 값을 적절한 유형으로 변환하려고 시도합니다.
const schema2 = z.coerce.string();
schema2.parse("tuna"); // => "tuna"
schema2.parse(42); // => "42"
schema2.parse(true); // => "true"
schema2.parse(null); // => "null"

// Emails
const schema3 = z.email();
schema3.parse("jacob@naver.com");

// URLs
const schema4 = z.url();
schema4.parse("https://example.com"); // ✅
schema4.parse("http://localhost"); // ✅
schema4.parse("mailto:noreply@zod.dev"); // ✅

// Objects
const Person = z.object({
  name: z.string(),
  age: z.number(),
});

Person.parse({ name: "Rachel", age: 30 });

const Dog = z.object({
  name: z.string(),
  age: z.number().optional(), // 선택적 속성
});

Dog.parse({ name: "Yeller" });
const yeller = Dog.parse({ name: "Yeller", extraKey: true });
console.log(yeller);

// .shape: 내부 스키마에 액세스하려면
Dog.shape.name.parse("Merry");
Dog.shape.age.parse(1);

// .extend(): 객체 스키마에 필드를 추가하려면
const DogWithBreed = Dog.extend({
  breed: z.string(),
});

// 다음과 같은 초기 스키마가 있다.
const Recipe = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string().optional(),
  ingredients: z.array(z.string()),
});

// .pick(): 특정 키를 선택하려면
const JustTheTitle = Recipe.pick({ title: true });

// .omit(): 특정 키를 생략하려면
const RecipeNoId = Recipe.omit({ id: true });

// .partial(): 모든 필드를 선택 사항으로 설정하려면
const PartialRecipe = Recipe.partial();

// 특정 속성을 선택 사항으로 설정하려면
const RecipeOptionalIngredients = Recipe.partial({
  ingredients: true,
});

// .required(): 모든 속성을 필수 항목으로 설정하려면
const RequiredRecipe = Recipe.required();

// 특정 속성을 필수 항목으로 설정하려면
const RecipeRequiredDescription = Recipe.required({ description: true });

// Arrays: 배열 스키마를 정의하려면
const stringArray = z.array(z.string()); // or z.string().array()

// Unions: 합집합 유형 (A | B)은 논리적 “OR”을 나타냅니다. Zod 합집합 스키마는 입력값을 각 옵션에 대해 순서대로 검증합니다. 검증에 성공한 첫 번째 값이 반환됩니다.
const stringOrNumber = z.union([z.string(), z.number()]); // string | number
stringOrNumber.parse("foo"); // passes
stringOrNumber.parse(14); // passes

// Transform: 파싱된 데이터를 다른 형태로 변환하기.
const stringToLength = z.coerce.string().transform((val) => val.length);

let length = stringToLength.parse("asdf"); // 4
length = stringToLength.parse(123); // 3
length = stringToLength.parse(true); // 4

// Defaults: 스키마의 기본값을 설정하려면
const defaultTuna = z.string().default("tuna");
defaultTuna.parse(undefined); // "tuna"

// Catch: 유효성 검사 오류가 발생한 경우 반환될 대체 값을 정의합니다
const numberWithCatch = z.number().catch(42);
numberWithCatch.parse(5); // 5
numberWithCatch.parse("tuna"); // 42
