import shirtData from './data/shirts.json'
import Toolbar from './components/Toolbar'
import './App.css'

function App() {
  // Get the first product from the data for demonstration
  const firstSeason = shirtData.clothing_inventory[0]
  const firstProductLine = firstSeason.product_lines[0]
  const firstProduct = firstProductLine.products[0]

  return (
    <div className="bg-background ">
      <Toolbar />
    </div>
  )
}

export default App
