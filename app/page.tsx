import Image from "next/image";

export default function Home() {
  return (
    <div className="add-container">
      <div className="backlog">
       <span className="continer-name"> Backlog</span>  <br/>
        <button>+</button> <span className="add-name"> add a card</span>
      </div>
      <div>
        <button>Backlog</button>
        <button>In Progress</button>
        <button>Done</button>
      </div>
      <div className="in-progress">
        <span className="continer-name"> In Progress</span>  <br/>
        <button>+</button> <span className="add-name"> add a card</span>
      </div>
      <div className="done">
     <span className="continer-name"> Done</span>  <br/>
        <button>+</button> <span className="add-name"> add a card</span>
      </div>
    </div>
  );
}
