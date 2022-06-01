function forceMaxMin(_number: number, _max: number, _min: number): number {
  return Math.max(_min, Math.min(_max, _number));
}

export default { forceMaxMin };
