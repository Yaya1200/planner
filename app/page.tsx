import Image from "next/image";

export default function Home() {
  return (
    <div >
      <div>
        Backlog <br/>
        <button>+</button> add A card
      </div>
      <div>
        in progress <br/>
        <button>+</button> add A card
      </div>
      <div>
        Done <br/>
        <button>+</button> add A card
      </div>
    </div>
  );
}
