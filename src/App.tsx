import './App.css';
import AnimatedBackground from './components/AnimatedBackground';
import DescriptionGenerator from './components/DescriptionGenerator';

const App = () => {
  return (
    <div className="App">
      <AnimatedBackground />
        <DescriptionGenerator />
    </div>
  );
};

export default App;