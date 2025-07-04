export function shuffle<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    const titip = newArray[i];
    newArray[i] = newArray[j];
    newArray[j] = titip;
  }

  if (array[0] === newArray[0] && array[1] === newArray[1]) {
    return shuffle(array);
  } else {
    return newArray;
  }
}
