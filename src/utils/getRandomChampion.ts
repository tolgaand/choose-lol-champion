const MAX_DEX_ID = 157;

export const getRandomChampion: (notThisOne?: number) => number = (
  notThisOne
) => {
  const championNumber = Math.floor(Math.random() * MAX_DEX_ID + 1);

  if (championNumber !== notThisOne) return championNumber;
  return getRandomChampion(notThisOne);
};

export const getOptionsForVote = () => {
  const firstId = getRandomChampion();
  const secondId = getRandomChampion(firstId);

  return [firstId, secondId];
};
