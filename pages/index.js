import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import Home from "../components/Home";

export default function Index({ set }) {
  return (
    <>
      <p>broken yo</p>
      <Home set={set} />
    </>
  );
}
