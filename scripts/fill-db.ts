import { prisma } from "../src/backend/utils/prisma";
import axios from "axios";
import { number } from "zod";

interface Champion {
  id: number;
  name: string;
  title: string;
  description: string;
  image: string;
  avatar: string;
  blurb: string;
}

const doBackFill = async () => {
  const champions = (
    await axios.get(
      "http://ddragon.leagueoflegends.com/cdn/11.24.1/data/en_US/champion.json"
    )
  ).data.data;

  const formattedChampion = Object.keys(champions).map((key, index) => ({
    id: index + 1,
    name: champions[key].name,
    title: champions[key].title,
    image: `http://ddragon.leagueoflegends.com/cdn/img/champion/loading/${champions[key].id}_0.jpg`,
    avatar: `http://ddragon.leagueoflegends.com/cdn/11.24.1/img/champion/${champions[key].id}.png`,
  }));

  console.log(formattedChampion);

  await prisma.champion.deleteMany({});

  const creation = await prisma.champion.createMany({
    data: formattedChampion,
  });

  console.log("Creation?", creation);
};

doBackFill();
