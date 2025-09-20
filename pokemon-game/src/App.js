import './App.css';
import Game from './pages/Game';

function App() {
return (
  <div style = {
    { maxWidth: 640, margin: '0 auto', padding: 16 }
  }>
    <h1 style = {
      { textAlign: 'center' }
    }> Indovina il Pokémon
         </h1>
     <Game />
  </div>
);

}

export default App;
