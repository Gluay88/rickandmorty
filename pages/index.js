import Head from "next/head";
import { useState } from "react";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import styles from "../styles/Home.module.css";
import {
  Heading,
  Input,
  Stack,
  IconButton,
  Box,
  Flex,
  useToast,
} from "@chakra-ui/react";
import { SearchIcon, CloseIcon } from "@chakra-ui/icons";

import Character from "../components/Character";

export default function Home(results) {
  const intialState = results;
  const [search, setSearch] = useState("");
  const [characters, setCharacters] = useState(intialState.characters);
  const toast = useToast();

  return (
    <Flex direction="column" justify="center" align="center">
      <Head>
        <title>Rick and Morty</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Box mb={4} flexDirection="column" align="center" justify="center" py={8}>
        <Heading as="h1" size="2xl" mb={8}>
          Rick and Morty
        </Heading>
        <form
          onSubmit={async (event) => {
            event.preventDefault();
            const results = await fetch("/api/SearchCharacters", {
              method: "post",
              body: search,
            });
            const { characters, error } = await results.json();
            if (error) {
              toast({
                position: "bottom",
                title: "An error occurred.",
                description: error,
                status: "error",
                duration: 5000,
                isClosable: true,
              });
            } else {
              setCharacters(characters);
            }
          }}
        >
          <Stack width="100%" isInline mb={20} justify="center">
            <Input
              placeholder="Search"
              value={search}
              border="solid 1px lightgray"
              onChange={(e) => setSearch(e.target.value)}
            />
            <IconButton
              colorScheme="blue"
              aria-label="Search database"
              icon={<SearchIcon />}
              disabled={search === ""}
              type="submit"
              cursor="pointer"
            />
            <IconButton
              backgroundColor="lightgray"
              aria-label="Reset "
              icon={<CloseIcon />}
              disabled={search === ""}
              onClick={async () => {
                setSearch("");
                setCharacters(intialState.characters);
              }}
              cursor="pointer"
            />
          </Stack>
        </form>
        <Character characters={characters} />
      </Box>

      <footer className={styles.footer}>Copyright &copy; 2022 - Gluay S. Wang</footer>
    </Flex>
  );
}

export async function getStaticProps() {
  const client = new ApolloClient({
    uri: "https://rickandmortyapi.com/graphql/",
    cache: new InMemoryCache(),
  });
  const { data } = await client.query({
    query: gql`
      query {
        characters(page: 1) {
          info {
            count
            pages
          }
          results {
            name
            id
            location {
              name
              id
            }
            image
            origin {
              name
              id
            }
            episode {
              id
              episode
              air_date
            }
          }
        }
      }
    `,
  });

  return {
    props: {
      characters: data.characters.results,
    },
  };
}
