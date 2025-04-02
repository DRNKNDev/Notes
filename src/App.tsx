import { useState } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";
import { Button } from "@/components/ui/button";

function App() {
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");

  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
    setGreetMsg(await invoke("greet", { name }));
  }

  return (
    <main className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-center">Welcome to Tauri + React</h1>

      <div className="flex justify-center items-center gap-6">
        <a href="https://vitejs.dev" target="_blank" className="hover:scale-110 transition-transform">
          <img src="/vite.svg" className="w-16 h-16" alt="Vite logo" />
        </a>
        <a href="https://tauri.app" target="_blank" className="hover:scale-110 transition-transform">
          <img src="/tauri.svg" className="w-16 h-16" alt="Tauri logo" />
        </a>
        <a href="https://reactjs.org" target="_blank" className="hover:scale-110 transition-transform">
          <img src={reactLogo} className="w-16 h-16" alt="React logo" />
        </a>
      </div>
      <p className="text-center text-muted-foreground">Click on the Tauri, Vite, and React logos to learn more.</p>

      <form
        className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        onSubmit={(e) => {
          e.preventDefault();
          greet();
        }}
      >
        <input
          id="greet-input"
          onChange={(e) => setName(e.currentTarget.value)}
          placeholder="Enter a name..."
          className="px-4 py-2 rounded-md border border-input bg-background w-full sm:w-auto"
        />
        <Button type="submit">Greet</Button>
      </form>
      <p className="text-center font-medium">{greetMsg}</p>
    </main>
  );
}

export default App;
