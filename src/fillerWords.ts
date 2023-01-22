const fillerWordSet = new Set();
fillerWordSet.add("oh");
fillerWordSet.add("um");
fillerWordSet.add("uh");
fillerWordSet.add("ah");
fillerWordSet.add("er");
fillerWordSet.add("well");
fillerWordSet.add("so");
fillerWordSet.add("right");
fillerWordSet.add("literally");
fillerWordSet.add("okay");
fillerWordSet.add("yeah");
fillerWordSet.add("like");

export const fillerWordCount = (
  speechArr: string[],
  originalSpeechArr: string[]
) => {
  const originalHashmap = new Map();
  for (let i = 0; i < originalSpeechArr.length; i++) {
    const key = originalSpeechArr[i]?.toLowerCase();
    if (fillerWordSet.has(key)) {
      if (originalHashmap.has(key)) {
        originalHashmap.set(key, originalHashmap.get(key) + 1);
      } else {
        originalHashmap.set(key, 1);
      }
    }
  }
  let count = 0;
  for (let i = 0; i < speechArr.length; i++) {
    const key = speechArr[i]?.toLowerCase();
    if (fillerWordSet.has(key)) {
      if (originalHashmap.has(key)) {
        if (originalHashmap.get(key) > 0) {
          originalHashmap.set(key, originalHashmap.get(key) - 1);
        } else {
          count++;
        }
      } else {
        count++;
      }
    }
  }
  return count;
};
