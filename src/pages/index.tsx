import { getOptionsForVote } from "@/utils/getRandomChampion";
import { trpc } from "@/utils/trpc";
import { inferQueryResponse } from "./api/trpc/[trpc]";

import React, { useState } from "react";

import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const [ids, updateIds] = useState(() => getOptionsForVote());

  const [first, second] = ids;

  const firstChampion = trpc.useQuery(["get-champion-by-id", { id: first }]);
  const secondChampion = trpc.useQuery(["get-champion-by-id", { id: second }]);

  const voteMutation = trpc.useMutation(["cast-vote"]);

  const voteForRoundest = (selected: number) => {
    if (selected === first)
      voteMutation.mutate({ votedFor: first, votedAgainst: second });
    else voteMutation.mutate({ votedFor: second, votedAgainst: first });

    updateIds(getOptionsForVote());
  };

  const dataLoaded = firstChampion.data && secondChampion.data;

  return (
    <div className="h-screen w-screen flex flex-col justify-between items-center relative">
      <div className="text-2xl text-center mt-5 pt-8">
        Who deserves the game?
      </div>
      {dataLoaded && (
        <div className="flex justify-between items-center w-auto h-full pt-8">
          <ChampionListing
            champion={firstChampion.data}
            vote={() => voteForRoundest(first)}
          />
          <div className=""></div>
          <ChampionListing
            champion={secondChampion.data}
            vote={() => voteForRoundest(second)}
          />
        </div>
      )}
      {!dataLoaded && <img src="/tail-spin.svg" className="w-48" />}
      <div className="w-full text-xl text-center mb-2 flex justify-center">
        <Link href="/results">Results</Link>
      </div>
    </div>
  );
}

type ChampionFromServer = inferQueryResponse<"get-champion-by-id">;

const ChampionListing: React.FC<{
  champion: ChampionFromServer;
  vote: () => void;
}> = (props) => {
  return (
    <div
      className="relative flex flex-col justify-center items-center cursor-pointer h-560 w-308"
      onClick={() => props.vote()}
    >
      <Image
        layout="fill"
        src={String(props.champion?.image)}
        className="object-cover object-center rounded-3xl champion-image"
      />
      <div className="absolute text-2xl text-center capitalize mt-2 px-2 champion-text">
        <p>{props.champion?.name}</p>
        <p>{props.champion?.title}</p>
      </div>
    </div>
  );
};
