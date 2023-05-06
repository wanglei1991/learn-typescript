---
title: 条件类型
author: 冴羽
date: '2021-12-12'
---
> 本文译者[冴羽 (opens new window)](https://github.com/mqyqingfeng)，期待你的[勘误 (opens new window)](https://ts.yayujs.com/introduction/correctErrors.html)，[原文 (opens new window)](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html)

条件类型（Conditional Types）
----------------------------------------------------

很多时候，我们需要基于输入的值来决定输出的值，同样我们也需要基于输入的值的类型来决定输出的值的类型。**条件类型（Conditional types**）就是用来帮助我们描述输入类型和输出类型之间的关系。
```typescript
interface Animal {
  live(): void;
}

interface Dog extends Animal {
  woof(): void;
}
 
type Example1 = Dog extends Animal ? number : string;     
// type Example1 = number
 
type Example2 = RegExp extends Animal ? number : string;     
// type Example2 = string
``` 

条件类型的写法有点类似于 JavaScript 中的条件表达式（`condition ? trueExpression : falseExpression` ）：
```typescript
SomeType extends OtherType ? TrueType : FalseType;
```

单从这个例子，可能看不出条件类型有什么用，但当搭配泛型使用的时候就很有用了，让我们拿下面的 `createLabel` 函数为例：
```typescript
interface IdLabel {
  id: number /* some fields */;
}
interface NameLabel {
  name: string /* other fields */;
}
 
function createLabel(id: number): IdLabel;
function createLabel(name: string): NameLabel;
function createLabel(nameOrId: string | number): IdLabel | NameLabel;
function createLabel(nameOrId: string | number): IdLabel | NameLabel {
  throw "unimplemented";
}
```    

这里使用了函数重载，描述了 `createLabel` 是如何基于输入值的类型不同而做出不同的决策，返回不同的类型。注意这样一些事情：

1.  如果一个库不得不在一遍又一遍的遍历 API 后做出相同的选择，它会变得非常笨重。
2.  我们不得不创建三个重载，一个是为了处理明确知道的类型，我们为每一种类型都写了一个重载（这里一个是 `string`，一个是 `number`），一个则是为了通用情况 （接收一个 `string | number`）。而如果增加一种新的类型，重载的数量将呈指数增加。

其实我们完全可以用把逻辑写在条件类型中：
```typescript
type NameOrId<T extends number | string> = T extends number
  ? IdLabel
  : NameLabel;
```    

使用这个条件类型，我们可以简化掉函数重载：
```typescript
function createLabel<T extends number | string>(idOrName: T): NameOrId<T> {
  throw "unimplemented";
}
 
let a = createLabel("typescript");
// let a: NameLabel
 
let b = createLabel(2.8);
// let b: IdLabel
 
let c = createLabel(Math.random() ? "hello" : 42);
// let c: NameLabel | IdLabel
```    

条件类型约束 （Conditional Type Constraints）
-------------------------------------------------------------------------------

通常，使用条件类型会为我们提供一些新的信息。正如使用 **类型保护（type guards）** 可以 **收窄类型（narrowing）** 为我们提供一个更加具体的类型，条件类型的 `true` 分支也会进一步约束泛型，举个例子：
```typescript
type MessageOf<T> = T["message"];
// Type '"message"' cannot be used to index type 'T'.
```    

TypeScript 报错是因为 `T` 不知道有一个名为 `message` 的属性。我们可以约束 `T`，这样 TypeScript 就不会再报错：
```typescript
type MessageOf<T extends { message: unknown }> = T["message"];
 
interface Email {
  message: string;
}
 
type EmailMessageContents = MessageOf<Email>;
// type EmailMessageContents = string
```    

但是，如果我们想要 `MessgeOf` 可以传入任何类型，但是当传入的值没有 `message` 属性的时候，则返回默认类型比如 `never` 呢？

我们可以把约束移出来，然后使用一个条件类型：
```typescript
type MessageOf<T> = T extends { message: unknown } ? T["message"] : never;
 
interface Email {
  message: string;
}
 
interface Dog {
  bark(): void;
}
 
type EmailMessageContents = MessageOf<Email>;           
// type EmailMessageContents = string
 
type DogMessageContents = MessageOf<Dog>;          
// type DogMessageContents = never
```    

在 `true` 分支里，TypeScript 会知道 `T` 有一个 `message`属性。

再举一个例子，我们写一个 `Flatten` 类型，用于获取数组元素的类型，当传入的不是数组，则直接返回传入的类型：
```typescript
type Flatten<T> = T extends any[] ? T[number] : T;
 
// Extracts out the element type.
type Str = Flatten<string[]>;  
// type Str = string
 
// Leaves the type alone.
type Num = Flatten<number>;  
// type Num = number
```    

注意这里使用了[索引访问类型 (opens new window)](https://www.typescriptlang.org/docs/handbook/2/indexed-access-types.html) 里的 `number` 索引，用于获取数组元素的类型。

在条件类型里推断（Inferring Within Conditional Types）
----------------------------------------------------------------------------------------------

条件类型提供了 `infer` 关键词，可以从正在比较的类型中推断类型，然后在 `true` 分支里引用该推断结果。借助 `infer`，我们修改下 `Flatten` 的实现，不再借助索引访问类型“手动”的获取出来：
```typescript
type Flatten<Type> = Type extends Array<infer Item> ? Item : Type;
```    

这里我们使用了 `infer` 关键字声明了一个新的类型变量 `Item` ，而不是像之前在 `true` 分支里明确的写出如何获取 `T` 的元素类型，这可以解放我们，让我们不用再苦心思考如何从我们感兴趣的类型结构中挖出需要的类型结构。

我们也可以使用 `infer` 关键字写一些有用的 **类型帮助别名（helper type aliases）**。举个例子，我们可以获取一个函数返回的类型：
```typescript
type GetReturnType<Type> = Type extends (...args: never[]) => infer Return
  ? Return
  : never;
 
type Num = GetReturnType<() => number>;
// type Num = number
 
type Str = GetReturnType<(x: string) => string>;
// type Str = string
 
type Bools = GetReturnType<(a: boolean, b: boolean) => boolean[]>;   
// type Bools = boolean[]
```    

当从多重调用签名（就比如重载函数）中推断类型的时候，会按照最后的签名进行推断，因为一般这个签名是用来处理所有情况的签名。
```typescript
declare function stringOrNum(x: string): number;
declare function stringOrNum(x: number): string;
declare function stringOrNum(x: string | number): string | number;
 
type T1 = ReturnType<typeof stringOrNum>;                     
// type T1 = string | number
```    

分发条件类型（Distributive Conditional Types）
----------------------------------------------------------------------------------

当在泛型中使用条件类型的时候，如果传入一个联合类型，就会变成 **分发的（distributive）**，举个例子：
```typescript
type ToArray<Type> = Type extends any ? Type[] : never;
```    

如果我们在 `ToArray` 传入一个联合类型，这个条件类型会被应用到联合类型的每个成员：
```typescript
type ToArray<Type> = Type extends any ? Type[] : never;
 
type StrArrOrNumArr = ToArray<string | number>;        
// type StrArrOrNumArr = string[] | number[]
```    

让我们分析下 `StrArrOrNumArr` 里发生了什么，这是我们传入的类型：
```typescript
string | number;
```    

接下来遍历联合类型里的成员，相当于：
```typescript
ToArray<string> | ToArray<number>;
```    

所以最后的结果是：
```typescript
string[] | number[];
```    

通常这是我们期望的行为，如果你要避免这种行为，你可以用方括号包裹 `extends` 关键字的每一部分。
```typescript
type ToArrayNonDist<Type> = [Type] extends [any] ? Type[] : never;
 
// 'StrArrOrNumArr' is no longer a union.
type StrArrOrNumArr = ToArrayNonDist<string | number>;
// type StrArrOrNumArr = (string | number)[]
```    
