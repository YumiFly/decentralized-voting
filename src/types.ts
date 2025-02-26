// src/types.ts
export type PollsLengthArgs = []; // pollsLength 无输入参数
export type PollsArgs = [bigint]; // polls 函数接收一个 uint256 参数

export interface Poll {
  index: number;
  title: string;
  description: string;
  endTime: number;
}