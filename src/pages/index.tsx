import { getOptionsForVote } from "@/utils/getRandomPokemon";
import { trpc } from "@/utils/trpc";
import { inferQueryResponse } from "./api/trpc/[trpc]";

import React, { useState } from "react";

import Image from "next/image";

export default function Home() {
  const [ids, updateIds] = useState(() => getOptionsForVote());

  const [first, second] = ids;

  const firstPokemon = trpc.useQuery(["get-pokemon-by-id", { id: first }]);
  const secondPokemon = trpc.useQuery(["get-pokemon-by-id", { id: second }]);

  const voteMutation = trpc.useMutation(["cast-vote"]);

  const voteForRoundest = (selected: number) => {
    if (selected === first)
      voteMutation.mutate({ votedFor: first, votedAgainst: second });
    else voteMutation.mutate({ votedFor: second, votedAgainst: first });

    updateIds(getOptionsForVote());
  };

  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center">
      <div className="text-2xl text-center">Which Pokémon is Rounder?</div>
      <div className="p-2" />
      <div className="border rounded p-8 flex justify-between items-center max-w-2xl">
        {!firstPokemon.isLoading &&
          firstPokemon.data &&
          !secondPokemon.isLoading &&
          secondPokemon.data && (
            <>
              <PokemonListing
                pokemon={firstPokemon.data}
                vote={() => voteForRoundest(first)}
              />
              <div className="p-8">Vs</div>
              <PokemonListing
                pokemon={secondPokemon.data}
                vote={() => voteForRoundest(second)}
              />
            </>
          )}
      </div>
    </div>
  );
}

type PokemonFromServer = inferQueryResponse<"get-pokemon-by-id">;

const PokemonListing: React.FC<{
  pokemon: PokemonFromServer;
  vote: () => void;
}> = (props) => {
  return (
    <div className="flex flex-col justify-center items-center">
      <Image
        width={256}
        height={256}
        layout="fixed"
        src={String(props.pokemon.sprites.front_default)}
      />
      <div className="text-2xl text-center capitalize mt-[-2rem]">
        {props.pokemon.name}
      </div>
      <button
        onClick={() => props.vote()}
        className="text-1xl px-6 py-1 border rounded mt-1"
      >
        Rounder
      </button>
    </div>
  );
};
