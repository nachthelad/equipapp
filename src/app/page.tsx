"use client"
import PlayerForm from "@/components/PlayerForm";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <PlayerForm onSubmit={(players) => console.log(players)} />
    </main>
  );
}
