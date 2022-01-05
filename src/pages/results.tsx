import React from "react";
import { GetServerSideProps } from "next";
import { prisma } from "@/backend/utils/prisma";
import { AsyncReturnType } from "@/utils/ts-bs";
import Image from "next/image";

const getPokemonInOrder = async () => {
  return await prisma.champion.findMany({
    orderBy: {
      VotesFor: {
        _count: "desc",
      },
    },
    select: {
      id: true,
      name: true,
      title: true,
      avatar: true,

      _count: {
        select: {
          VotesFor: true,
          VotesAgainst: true,
        },
      },
    },
  });
};

type PokemonQueryResult = AsyncReturnType<typeof getPokemonInOrder>;
const generateCountPercent = (champion: PokemonQueryResult[number]) => {
  const { VotesFor, VotesAgainst } = champion._count;

  if (VotesFor + VotesAgainst === 0) return 0;

  return ((VotesFor / (VotesFor + VotesAgainst)) * 100).toFixed(2);
};

const PokemonListing: React.FC<{ champion: PokemonQueryResult[number] }> = ({
  champion,
}) => {
  return (
    <div className="flex border-b p-2 items-center justify-between">
      <div className="flex items-center">
        <Image width={64} height={64} layout="fixed" src={champion?.avatar} />
        <div className="capitalize">{champion.name}</div>
      </div>
      <div className="pr-4">{generateCountPercent(champion) + "%"}</div>
    </div>
  );
};

const ResultsPage: React.FC<{
  champion: PokemonQueryResult;
}> = ({ champion }) => {
  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl p-4">Results</h2>
      <div className="flex flex-col w-full max-w-2xl border">
        {champion.map((currentChampion, index) => {
          return (
            <PokemonListing
              champion={currentChampion}
              key={index}
            ></PokemonListing>
          );
        })}
      </div>
    </div>
  );
};

export default ResultsPage;

export const getStaticProps: GetServerSideProps = async () => {
  return {
    props: {
      champion: await getPokemonInOrder(),
    },
    revalidate: 60,
  };
};
